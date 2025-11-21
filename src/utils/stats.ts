import type { Listing } from "../types/listing";

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export function medianPrice(listings: Listing[]): number {
  return median(listings.map((l) => l.price));
}

export function medianPricePerSqft(listings: Listing[]): number {
  return median(listings.map((l) => l.price / l.sqft));
}

export function averageDistance(listings: Listing[]): number {
  if (listings.length === 0) return 0;
  const sum = listings.reduce((acc, l) => acc + l.distanceFromSubject, 0);
  return sum / listings.length;
}

export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

