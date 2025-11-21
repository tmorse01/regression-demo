import type { Listing, SubjectProperty } from "../types/listing";

const DEFAULT_SUBJECT_LAT = 48.75;
const DEFAULT_SUBJECT_LNG = -122.48;
const DEFAULT_SUBJECT_SQFT = 1800;

function calculateDistance(
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

export function generateListing(
  i: number,
  subjectProperty: SubjectProperty
): Listing {
  const sqft = subjectProperty.sqft + (Math.random() - 0.5) * 1200;
  const pricePerSqft = 350 + (Math.random() - 0.5) * 40;
  const price = Math.round(sqft * pricePerSqft);

  const beds = Math.floor(2 + Math.random() * 4);
  const baths = Math.round((1 + Math.random() * 2.5) * 2) / 2;
  const yearBuilt = 1965 + Math.floor(Math.random() * 55);

  const lat = subjectProperty.lat + (Math.random() - 0.5) * 0.02;
  const lng = subjectProperty.lng + (Math.random() - 0.5) * 0.02;

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
    lat,
    lng,
    distanceFromSubject,
  };
}

export function generateListings(
  count: number,
  subjectProperty: SubjectProperty
): Listing[] {
  return Array.from({ length: count }, (_, i) =>
    generateListing(i, subjectProperty)
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

