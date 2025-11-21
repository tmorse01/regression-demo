import { useState, useEffect, useRef, useTransition } from "react";
import type { Filters } from "../types/listing";

interface UseDebouncedFiltersOptions {
  debounceMs?: number;
  onFiltersChange: (filters: Filters) => void;
}

/**
 * Custom hook that provides optimistic filter updates with debouncing
 * Uses React 19 useTransition for smooth, non-blocking updates
 */
export function useDebouncedFilters(
  initialFilters: Filters,
  { debounceMs = 300, onFiltersChange }: UseDebouncedFiltersOptions
) {
  const [optimisticFilters, setOptimisticFilters] =
    useState<Filters>(initialFilters);
  const [isPending, startTransition] = useTransition();
  const debounceTimerRef = useRef<number | null>(null);
  const pendingFiltersRef = useRef<Filters>(initialFilters);

  // Sync optimistic filters when initial filters change externally (e.g., from presets)
  useEffect(() => {
    startTransition(() => {
      setOptimisticFilters(initialFilters);
      pendingFiltersRef.current = initialFilters;
    });
  }, [initialFilters]);

  const updateFilters = (newFilters: Filters) => {
    // Immediate optimistic update - NO delay, instant UI feedback
    setOptimisticFilters(newFilters);
    pendingFiltersRef.current = newFilters;

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce the actual state update (but filtering is deferred via useDeferredValue)
    // This debounce is just to batch rapid changes
    debounceTimerRef.current = window.setTimeout(() => {
      startTransition(() => {
        onFiltersChange(pendingFiltersRef.current);
      });
    }, debounceMs);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    filters: optimisticFilters,
    updateFilters,
    isPending,
  };
}
