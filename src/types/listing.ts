export interface Listing {
  id: string;
  price: number;
  sqft: number;
  beds: number;
  baths: number;
  yearBuilt: number;
  lat: number;
  lng: number;
  distanceFromSubject: number;
}

export interface SubjectProperty {
  address: string;
  lat: number;
  lng: number;
  sqft: number;
  beds: number;
  baths: number;
  yearBuilt: number;
}

export interface Filters {
  priceMin: number | null;
  priceMax: number | null;
  sqftMin: number | null;
  sqftMax: number | null;
  minBeds: number | null;
  minBaths: number | null;
  yearBuiltMin: number | null;
  yearBuiltMax: number | null;
  maxDistance: number | null;
}

