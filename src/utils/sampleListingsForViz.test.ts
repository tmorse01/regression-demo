import { describe, expect, it } from "vitest";
import type { Listing } from "../types/listing";
import { LISTINGS_VIZ_CAP } from "../constants/listingsViz";
import { sampleListingsForViz } from "./sampleListingsForViz";

function makeListing(id: string, overrides: Partial<Listing> = {}): Listing {
  return {
    id,
    price: 400_000,
    sqft: 2000,
    beds: 3,
    baths: 2,
    yearBuilt: 2010,
    listingDate: 2020,
    lat: 40,
    lng: -75,
    distanceFromSubject: 1,
    ...overrides,
  };
}

describe("sampleListingsForViz", () => {
  it("returns empty array unchanged", () => {
    expect(sampleListingsForViz([], 10)).toEqual([]);
  });

  it("returns the same array reference when under cap", () => {
    const listings = [makeListing("a"), makeListing("b")];
    expect(sampleListingsForViz(listings, 500)).toBe(listings);
  });

  it("returns the same array reference when length equals cap", () => {
    const listings = Array.from({ length: 10 }, (_, i) =>
      makeListing(String(i))
    );
    expect(sampleListingsForViz(listings, 10)).toBe(listings);
  });

  it("returns exactly cap items when above cap", () => {
    const listings = Array.from({ length: 2000 }, (_, i) =>
      makeListing(`id-${i}`)
    );
    const sampled = sampleListingsForViz(listings, LISTINGS_VIZ_CAP);
    expect(sampled).toHaveLength(LISTINGS_VIZ_CAP);
  });

  it("uses unique listing ids in the sample", () => {
    const listings = Array.from({ length: 1200 }, (_, i) =>
      makeListing(`id-${i}`)
    );
    const sampled = sampleListingsForViz(listings, 500);
    const ids = new Set(sampled.map((l) => l.id));
    expect(ids.size).toBe(sampled.length);
  });

  it("is stable for the same input", () => {
    const listings = Array.from({ length: 800 }, (_, i) =>
      makeListing(`id-${i}`)
    );
    const a = sampleListingsForViz(listings, 200);
    const b = sampleListingsForViz(listings, 200);
    expect(a.map((l) => l.id)).toEqual(b.map((l) => l.id));
  });
});
