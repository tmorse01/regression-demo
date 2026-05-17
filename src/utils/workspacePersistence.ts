import type { Listing, Filters, SubjectProperty } from "../types/listing";
import type { GenerateListingsOptions } from "../data/listings";
import type { ViewMode, ThemeMode } from "../components/WorkspaceHeader";
import { PRODUCT_NAME } from "../brand";

export type ListingsSourcePersisted = "synthetic" | "imported";

/** Key used for localStorage snapshots. */
export const WORKSPACE_STORAGE_KEY = `${PRODUCT_NAME.toLowerCase()}-workspace-v1`;

const HASH_PREFIX = "w=";

export interface WorkspaceSnapshotV1 {
  v: 1;
  subjectProperty: SubjectProperty;
  /** Same shape as `actualFilters` in App. */
  filters: Filters;
  actualDateRange: [number, number];
  viewMode: ViewMode;
  themeMode: ThemeMode;
  activePreset: string | null;
  listingsSource: ListingsSourcePersisted;
  syntheticCount: number;
  syntheticOptions: GenerateListingsOptions;
  /** Omitted in share URLs; present only in localStorage. */
  importedListings?: Listing[] | null;
}

export interface WorkspacePersistedFields {
  subjectProperty: SubjectProperty;
  actualFilters: Filters;
  actualDateRange: [number, number];
  viewMode: ViewMode;
  themeMode: ThemeMode;
  activePreset: string | null;
  listingsSource: ListingsSourcePersisted;
  syntheticCount: number;
  syntheticOptions: GenerateListingsOptions;
  importedListings: Listing[] | null;
}

export type HydrationSource = "hash" | "localStorage" | "defaults";

function utf8ToBase64Url(json: string): string {
  const bytes = new TextEncoder().encode(json);
  let bin = "";
  bytes.forEach((b) => {
    bin += String.fromCharCode(b);
  });
  return btoa(bin)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlToUtf8(token: string): string | null {
  try {
    const padded =
      token.replace(/-/g, "+").replace(/_/g, "/") +
      "==".slice(0, (4 - (token.length % 4)) % 4);
    const bin = atob(padded);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i += 1) {
      out[i] = bin.charCodeAt(i);
    }
    return new TextDecoder().decode(out);
  } catch {
    return null;
  }
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isFilters(v: unknown): v is Filters {
  if (!isPlainObject(v)) return false;
  const numOrNull = (x: unknown) => x === null || typeof x === "number";
  return (
    numOrNull(v.priceMin) &&
    numOrNull(v.priceMax) &&
    numOrNull(v.sqftMin) &&
    numOrNull(v.sqftMax) &&
    numOrNull(v.minBeds) &&
    numOrNull(v.minBaths) &&
    numOrNull(v.yearBuiltMin) &&
    numOrNull(v.yearBuiltMax) &&
    numOrNull(v.maxDistance)
  );
}

function isSubjectProperty(v: unknown): v is SubjectProperty {
  if (!isPlainObject(v)) return false;
  return (
    typeof v.address === "string" &&
    typeof v.lat === "number" &&
    typeof v.lng === "number" &&
    typeof v.sqft === "number" &&
    typeof v.beds === "number" &&
    typeof v.baths === "number" &&
    typeof v.yearBuilt === "number"
  );
}

function isListing(v: unknown): v is Listing {
  if (!isPlainObject(v)) return false;
  return (
    typeof v.id === "string" &&
    typeof v.price === "number" &&
    typeof v.sqft === "number" &&
    typeof v.beds === "number" &&
    typeof v.baths === "number" &&
    typeof v.yearBuilt === "number" &&
    typeof v.listingDate === "number" &&
    typeof v.lat === "number" &&
    typeof v.lng === "number" &&
    typeof v.distanceFromSubject === "number"
  );
}

function isWorkspaceSnapshotV1(v: unknown): v is WorkspaceSnapshotV1 {
  if (!isPlainObject(v) || v.v !== 1) return false;
  if (!isSubjectProperty(v.subjectProperty)) return false;
  if (!isFilters(v.filters)) return false;
  if (
    !Array.isArray(v.actualDateRange) ||
    v.actualDateRange.length !== 2 ||
    typeof v.actualDateRange[0] !== "number" ||
    typeof v.actualDateRange[1] !== "number"
  ) {
    return false;
  }
  if (v.viewMode !== "analysis" && v.viewMode !== "table" && v.viewMode !== "overview") {
    return false;
  }
  if (v.themeMode !== "light" && v.themeMode !== "dark") {
    return false;
  }
  if (!(v.activePreset === null || typeof v.activePreset === "string")) {
    return false;
  }
  if (v.listingsSource !== "synthetic" && v.listingsSource !== "imported") {
    return false;
  }
  if (typeof v.syntheticCount !== "number") return false;
  if (
    v.syntheticOptions != null &&
    (typeof v.syntheticOptions !== "object" || Array.isArray(v.syntheticOptions))
  ) {
    return false;
  }
  if (v.importedListings !== undefined && v.importedListings !== null) {
    if (!Array.isArray(v.importedListings) || !v.importedListings.every(isListing)) {
      return false;
    }
  }
  return true;
}

export function encodeSnapshot(snapshot: WorkspaceSnapshotV1): string {
  return utf8ToBase64Url(JSON.stringify(snapshot));
}

export function decodeSnapshot(encoded: string): WorkspaceSnapshotV1 | null {
  const utf8 = base64UrlToUtf8(encoded);
  if (!utf8) return null;
  try {
    const parsed: unknown = JSON.parse(utf8);
    if (!isWorkspaceSnapshotV1(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** URL hash without `#`, e.g. `w=eyJ`... */
export function parseHashPayload(hash: string): string | null {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!raw.startsWith(HASH_PREFIX)) return null;
  return raw.slice(HASH_PREFIX.length) || null;
}

export function snapshotToPersisted(s: WorkspaceSnapshotV1): WorkspacePersistedFields {
  const imported =
    s.importedListings === undefined ? null : s.importedListings;
  return {
    subjectProperty: s.subjectProperty,
    actualFilters: s.filters,
    actualDateRange: s.actualDateRange,
    viewMode: s.viewMode,
    themeMode: s.themeMode,
    activePreset: s.activePreset,
    listingsSource: s.listingsSource,
    syntheticCount: s.syntheticCount,
    syntheticOptions: s.syntheticOptions ?? {},
    importedListings:
      s.listingsSource === "imported" ? imported : null,
  };
}

export function persistedToSnapshot(fields: WorkspacePersistedFields): WorkspaceSnapshotV1 {
  return {
    v: 1,
    subjectProperty: fields.subjectProperty,
    filters: fields.actualFilters,
    actualDateRange: fields.actualDateRange,
    viewMode: fields.viewMode,
    themeMode: fields.themeMode,
    activePreset: fields.activePreset,
    listingsSource: fields.listingsSource,
    syntheticCount: fields.syntheticCount,
    syntheticOptions: fields.syntheticOptions,
    importedListings:
      fields.listingsSource === "imported" && fields.importedListings?.length
        ? fields.importedListings
        : undefined,
  };
}

/**
 * Snapshot for sharing: never includes imported rows; always uses synthetic listings.
 */
export function buildShareSnapshot(fields: WorkspacePersistedFields): WorkspaceSnapshotV1 {
  return {
    v: 1,
    subjectProperty: fields.subjectProperty,
    filters: fields.actualFilters,
    actualDateRange: fields.actualDateRange,
    viewMode: fields.viewMode,
    themeMode: fields.themeMode,
    activePreset: fields.activePreset,
    listingsSource: "synthetic",
    syntheticCount: fields.syntheticCount,
    syntheticOptions: fields.syntheticOptions,
  };
}

export function readSnapshotFromHash(
  hash: string
): { fields: WorkspacePersistedFields } | null {
  const payload = parseHashPayload(hash);
  if (!payload) return null;
  const decoded = decodeSnapshot(payload);
  if (!decoded) return null;
  const normalized: WorkspaceSnapshotV1 = {
    ...decoded,
    listingsSource: "synthetic",
    importedListings: undefined,
  };
  return { fields: snapshotToPersisted(normalized) };
}

export function readSnapshotFromLocalStorage(): { fields: WorkspacePersistedFields } | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(WORKSPACE_STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isWorkspaceSnapshotV1(parsed)) return null;
    return { fields: snapshotToPersisted(parsed) };
  } catch {
    return null;
  }
}

export function writeSnapshotToLocalStorage(snapshot: WorkspaceSnapshotV1): boolean {
  if (typeof localStorage === "undefined") return false;
  try {
    localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify(snapshot));
    return true;
  } catch {
    return false;
  }
}

export function buildShareUrlWithHash(snapshot: WorkspaceSnapshotV1): string {
  const url = new URL(
    typeof window !== "undefined" ? window.location.href : "http://localhost/"
  );
  url.hash = `${HASH_PREFIX}${encodeSnapshot(snapshot)}`;
  return url.toString();
}

export function loadInitialWorkspace(
  defaults: WorkspacePersistedFields
): WorkspacePersistedFields & { hydrationSource: HydrationSource } {
  if (typeof window !== "undefined") {
    const fromHash = readSnapshotFromHash(window.location.hash);
    if (fromHash) {
      return { ...fromHash.fields, hydrationSource: "hash" };
    }
  }
  const fromLs =
    typeof window !== "undefined" ? readSnapshotFromLocalStorage() : null;
  if (fromLs) {
    return { ...fromLs.fields, hydrationSource: "localStorage" };
  }
  return { ...defaults, hydrationSource: "defaults" };
}
