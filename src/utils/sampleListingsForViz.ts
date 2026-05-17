import type { Listing } from "../types/listing";

/**
 * Deterministic subsample for heavy visuals (scatter plots, map markers).
 * Sorts by `id`, then takes evenly spaced indices so the sample is stable
 * for the same input across re-renders.
 */
export function sampleListingsForViz(
  listings: Listing[],
  cap: number
): Listing[] {
  if (listings.length === 0 || cap < 1) {
    return listings;
  }
  if (listings.length <= cap) {
    return listings;
  }

  const sorted = [...listings].sort((a, b) => a.id.localeCompare(b.id));
  const n = sorted.length;
  const step = n / cap;
  const out: Listing[] = [];

  for (let i = 0; i < cap; i++) {
    const idx = Math.min(n - 1, Math.floor(i * step));
    out.push(sorted[idx]);
  }

  return out;
}
