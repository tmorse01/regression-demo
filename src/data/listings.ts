import type { Listing, SubjectProperty } from "../types/listing";

const DEFAULT_SUBJECT_LAT = 48.75;
const DEFAULT_SUBJECT_LNG = -122.48;
const DEFAULT_SUBJECT_SQFT = 1800;

const DEFAULT_GENERATION = {
  sqftSpread: 1200,
  /** Degrees; ~0.08° ≈ 9 km N–S — fits typical zoom-12 framed area around subject. */
  geoSpread: 0.08,
  pricePerSqftBase: 350,
  pricePerSqftVariance: 40,
} as const;

export interface GenerateListingsOptions {
  sqftSpread?: number;
  geoSpread?: number;
  pricePerSqftBase?: number;
  pricePerSqftVariance?: number;
  /** Deterministic comps when set; otherwise `Math.random`. */
  seed?: number | null;
}

export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function recomputeListingDistances(
  listings: Listing[],
  subjectProperty: SubjectProperty
): Listing[] {
  return listings.map((listing) => ({
    ...listing,
    distanceFromSubject: calculateDistance(
      subjectProperty.lat,
      subjectProperty.lng,
      listing.lat,
      listing.lng
    ),
  }));
}

function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function mergeGenerationOptions(
  options?: GenerateListingsOptions
): Required<Omit<GenerateListingsOptions, "seed">> & { seed: number | null } {
  return {
    sqftSpread: options?.sqftSpread ?? DEFAULT_GENERATION.sqftSpread,
    geoSpread: options?.geoSpread ?? DEFAULT_GENERATION.geoSpread,
    pricePerSqftBase:
      options?.pricePerSqftBase ?? DEFAULT_GENERATION.pricePerSqftBase,
    pricePerSqftVariance:
      options?.pricePerSqftVariance ??
      DEFAULT_GENERATION.pricePerSqftVariance,
    seed: options?.seed ?? null,
  };
}

function generateListingWithRng(
  i: number,
  subjectProperty: SubjectProperty,
  rand: () => number,
  opts: ReturnType<typeof mergeGenerationOptions>
): Listing {
  const sqft = subjectProperty.sqft + (rand() - 0.5) * opts.sqftSpread;
  const pricePerSqft =
    opts.pricePerSqftBase + (rand() - 0.5) * opts.pricePerSqftVariance;
  const price = Math.round(sqft * pricePerSqft);

  const beds = Math.floor(2 + rand() * 4);
  const baths = Math.round((1 + rand() * 2.5) * 2) / 2;
  const yearBuilt = 1965 + Math.floor(rand() * 55);
  const listingDate = 2020 + Math.floor(rand() * 5);

  const lat = subjectProperty.lat + (rand() - 0.5) * opts.geoSpread;
  const lng = subjectProperty.lng + (rand() - 0.5) * opts.geoSpread;

  const distanceFromSubject = calculateDistance(
    subjectProperty.lat,
    subjectProperty.lng,
    lat,
    lng
  );

  return {
    id: i.toString(),
    price,
    sqft: Math.round(sqft),
    beds,
    baths,
    yearBuilt,
    listingDate,
    lat,
    lng,
    distanceFromSubject,
  };
}

export function generateListing(
  i: number,
  subjectProperty: SubjectProperty,
  options?: GenerateListingsOptions
): Listing {
  const opts = mergeGenerationOptions(options);
  const rand =
    opts.seed != null
      ? mulberry32((opts.seed ^ 0x9e3779b9) + i * 2654435761)
      : Math.random.bind(Math);
  return generateListingWithRng(i, subjectProperty, rand, opts);
}

export function generateListings(
  count: number,
  subjectProperty: SubjectProperty,
  options?: GenerateListingsOptions
): Listing[] {
  const opts = mergeGenerationOptions(options);
  const baseRand =
    opts.seed != null
      ? mulberry32(opts.seed ^ 0x9e3779b9)
      : Math.random.bind(Math);

  return Array.from({ length: count }, (_, i) =>
    generateListingWithRng(i, subjectProperty, baseRand, opts)
  );
}

export function getDefaultSubjectProperty(): SubjectProperty {
  return {
    address: "Bellingham, WA",
    lat: DEFAULT_SUBJECT_LAT,
    lng: DEFAULT_SUBJECT_LNG,
    sqft: DEFAULT_SUBJECT_SQFT,
    beds: 3,
    baths: 2,
    yearBuilt: 1998,
  };
}
