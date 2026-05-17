import { describe, expect, it } from "vitest";
import { median } from "./stats";

describe("median", () => {
  it("returns 0 for an empty array", () => {
    expect(median([])).toBe(0);
  });

  it("returns the middle value for odd-length inputs", () => {
    expect(median([3, 1, 2])).toBe(2);
  });

  it("averages the two middle values for even-length inputs", () => {
    expect(median([1, 2, 3, 4])).toBe(2.5);
  });
});
