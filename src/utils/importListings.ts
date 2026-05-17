import Papa from "papaparse";
import type { Listing } from "../types/listing";

export interface ImportParseResult {
  listings: Listing[];
  warnings: string[];
  errors: string[];
}

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Map normalized header -> Listing field key */
const CSV_HEADER_ALIASES: Record<string, keyof Listing | "price_per_sqft"> = {
  id: "id",
  price: "price",
  sqft: "sqft",
  "square feet": "sqft",
  squarefeet: "sqft",
  beds: "beds",
  baths: "baths",
  "year built": "yearBuilt",
  yearbuilt: "yearBuilt",
  "listing year": "listingDate",
  listingdate: "listingDate",
  "listing date": "listingDate",
  lat: "lat",
  latitude: "lat",
  lng: "lng",
  lon: "lng",
  long: "lng",
  longitude: "lng",
  "distance (miles)": "distanceFromSubject",
  "distance from subject": "distanceFromSubject",
  distance: "distanceFromSubject",
  distancemiles: "distanceFromSubject",
  "price/sqft": "price_per_sqft",
  "price per sqft": "price_per_sqft",
};

function pickId(rowIndex: number, batch: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${batch}-${crypto.randomUUID()}`;
  }
  return `${batch}-${rowIndex}-${Date.now()}`;
}

function num(v: unknown): number | null {
  if (v === "" || v === null || v === undefined) return null;
  const n = typeof v === "number" ? v : Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : null;
}

function rowToListing(
  row: Record<string, unknown>,
  col: Map<string, keyof Listing | "price_per_sqft">,
  rowIndex: number,
  batchId: string,
  warnings: string[]
): Listing | null {
  const get = (field: keyof Listing | "price_per_sqft"): unknown => {
    for (const [header, key] of col) {
      if (key === field && header in row) return row[header];
    }
    return undefined;
  };

  const price = num(get("price"));
  const sqft = num(get("sqft"));
  if (price === null || sqft === null || sqft <= 0) {
    warnings.push(
      `Row ${rowIndex + 1}: skipped (need numeric price and sqft > 0)`
    );
    return null;
  }

  let lat = num(get("lat"));
  let lng = num(get("lng"));
  if (lat === null || lng === null) {
    warnings.push(
      `Row ${rowIndex + 1}: missing lat/lng; placed at 0,0 — update subject or data for map accuracy`
    );
    lat = 0;
    lng = 0;
  }

  const idRaw = get("id");
  const id =
    idRaw !== undefined && idRaw !== null && String(idRaw).trim() !== ""
      ? String(idRaw).trim()
      : pickId(rowIndex, batchId);

  const beds = num(get("beds")) ?? 3;
  const baths = num(get("baths")) ?? 2;
  const yearBuilt = num(get("yearBuilt")) ?? 2000;

  let listingDate = num(get("listingDate"));
  if (listingDate === null) {
    listingDate = yearBuilt;
  }

  let distanceFromSubject = num(get("distanceFromSubject"));
  if (distanceFromSubject === null) {
    distanceFromSubject = 0;
  }

  return {
    id,
    price: Math.round(price),
    sqft: Math.round(sqft),
    beds: Math.max(0, Math.floor(beds)),
    baths: Math.max(0, baths),
    yearBuilt: Math.floor(yearBuilt),
    listingDate: Math.floor(listingDate),
    lat,
    lng,
    distanceFromSubject,
  };
}

function buildColumnMap(
  headers: string[]
): Map<string, keyof Listing | "price_per_sqft"> {
  const col = new Map<string, keyof Listing | "price_per_sqft">();
  for (const h of headers) {
    const norm = normalizeHeader(h);
    const key = CSV_HEADER_ALIASES[norm];
    if (key) col.set(h, key);
  }
  return col;
}

export function parseListingsCsv(text: string): ImportParseResult {
  const warnings: string[] = [];
  const errors: string[] = [];
  const batchId = `csv-${Date.now()}`;

  const parsed = Papa.parse<Record<string, unknown>>(text, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (h) => h.trim(),
  });

  if (parsed.errors.length) {
    for (const e of parsed.errors) {
      if (e.type === "Quotes" || e.type === "Delimiter") {
        errors.push(e.message);
      }
    }
  }

  const rows = parsed.data;
  if (!rows.length) {
    return {
      listings: [],
      warnings,
      errors: errors.length ? errors : ["No data rows in CSV"],
    };
  }

  const headers = parsed.meta.fields?.filter(Boolean) ?? [];
  if (!headers.length) {
    return {
      listings: [],
      warnings,
      errors: ["CSV has no headers"],
    };
  }

  const col = buildColumnMap(headers);
  const hasPrice = [...col.values()].includes("price");
  const hasSqft = [...col.values()].includes("sqft");
  if (!hasPrice || !hasSqft) {
    return {
      listings: [],
      warnings,
      errors: [
        "CSV must include Price and Sqft columns (see export format or Listing fields)",
      ],
    };
  }

  const listings: Listing[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const listing = rowToListing(row, col, i, batchId, warnings);
    if (listing) listings.push(listing);
  }

  if (!listings.length && !errors.length) {
    errors.push("No valid rows imported");
  }

  return { listings, warnings, errors };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export function parseListingsJson(text: string): ImportParseResult {
  const warnings: string[] = [];
  const errors: string[] = [];
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return { listings: [], warnings, errors: ["Invalid JSON"] };
  }

  const arr: unknown[] = Array.isArray(data)
    ? data
    : isRecord(data) && Array.isArray(data.listings)
      ? data.listings
      : [];

  if (!arr.length) {
    return {
      listings: [],
      warnings,
      errors: [
        "JSON must be a Listing[] array or { listings: Listing[] }",
      ],
    };
  }

  const batchId = `json-${Date.now()}`;
  const listings: Listing[] = [];

  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (!isRecord(item)) {
      warnings.push(`Index ${i}: skipped (not an object)`);
      continue;
    }
    const price = num(item.price);
    const sqft = num(item.sqft);
    if (price === null || sqft === null || sqft <= 0) {
      warnings.push(`Index ${i}: skipped (need price and sqft > 0)`);
      continue;
    }

    let lat = num(item.lat);
    let lng = num(item.lng);
    if (lat === null || lng === null) {
      warnings.push(
        `Index ${i}: missing lat/lng; using 0,0 — add coordinates for map accuracy`
      );
      lat = 0;
      lng = 0;
    }

    const id =
      item.id != null && String(item.id).trim() !== ""
        ? String(item.id)
        : pickId(i, batchId);

    const beds = num(item.beds) ?? 3;
    const baths = num(item.baths) ?? 2;
    const yearBuilt = num(item.yearBuilt) ?? 2000;
    let listingDate = num(item.listingDate);
    if (listingDate === null) listingDate = yearBuilt;

    const row: Listing = {
      id,
      price: Math.round(price),
      sqft: Math.round(sqft),
      beds: Math.max(0, Math.floor(beds)),
      baths: Math.max(0, baths),
      yearBuilt: Math.floor(yearBuilt),
      listingDate: Math.floor(listingDate),
      lat,
      lng,
      distanceFromSubject: num(item.distanceFromSubject) ?? 0,
    };

    listings.push(row);
  }

  if (!listings.length) {
    errors.push("No valid listings in JSON");
  }

  return { listings, warnings, errors };
}