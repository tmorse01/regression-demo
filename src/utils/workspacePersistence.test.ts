import { describe, expect, it } from "vitest";
import {
  encodeSnapshot,
  decodeSnapshot,
  parseHashPayload,
  buildShareSnapshot,
  type WorkspaceSnapshotV1,
} from "./workspacePersistence";
import type { Listing, SubjectProperty, Filters } from "../types/listing";

const subject: SubjectProperty = {
  address: "123 Test St",
  lat: 40,
  lng: -74,
  sqft: 2000,
  beds: 3,
  baths: 2,
  yearBuilt: 2000,
};

const filters: Filters = {
  priceMin: 100_000,
  priceMax: 500_000,
  sqftMin: 1500,
  sqftMax: null,
  minBeds: 2,
  minBaths: null,
  yearBuiltMin: 1990,
  yearBuiltMax: 2020,
  maxDistance: 10,
};

const minimalSnapshot: WorkspaceSnapshotV1 = {
  v: 1,
  subjectProperty: subject,
  filters,
  actualDateRange: [2018, 2023],
  viewMode: "overview",
  themeMode: "light",
  activePreset: "test-preset",
  listingsSource: "synthetic",
  syntheticCount: 100,
  syntheticOptions: { seed: 42 },
};

describe("workspacePersistence", () => {
  it("roundtrips encodeSnapshot / decodeSnapshot", () => {
    const encoded = encodeSnapshot(minimalSnapshot);
    expect(encoded).not.toContain("+");
    expect(encoded).not.toContain("/");
    const decoded = decodeSnapshot(encoded);
    expect(decoded).toEqual(minimalSnapshot);
  });

  it("decodeSnapshot returns null for garbage", () => {
    expect(decodeSnapshot("not-valid-base64!!!")).toBeNull();
    expect(decodeSnapshot(encodeSnapshot(minimalSnapshot))).not.toBeNull();
  });

  it("parseHashPayload extracts w= token", () => {
    expect(parseHashPayload("#w=abc")).toBe("abc");
    expect(parseHashPayload("w=xyz")).toBe("xyz");
    expect(parseHashPayload("#foo=1")).toBeNull();
  });

  it("buildShareSnapshot forces synthetic and drops imports", () => {
    const listing: Listing = {
      id: "1",
      price: 1,
      sqft: 1,
      beds: 1,
      baths: 1,
      yearBuilt: 2000,
      listingDate: 2020,
      lat: 0,
      lng: 0,
      distanceFromSubject: 1,
    };
    const snap = buildShareSnapshot({
      subjectProperty: subject,
      actualFilters: filters,
      actualDateRange: [2020, 2024],
      viewMode: "table",
      themeMode: "dark",
      activePreset: null,
      listingsSource: "imported",
      syntheticCount: 200,
      syntheticOptions: {},
      importedListings: [listing],
    });
    expect(snap.listingsSource).toBe("synthetic");
    expect(snap.importedListings).toBeUndefined();
  });
});
