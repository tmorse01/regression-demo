import { useState, useEffect, useRef, useTransition } from "react";

/**
 * Generic debounced value hook with React 19 useTransition
 * Provides immediate optimistic updates with debounced heavy updates
 */
export function useDebouncedValue<T>(
  initialValue: T,
  debounceMs: number,
  onValueChange: (value: T) => void
) {
  const [optimisticValue, setOptimisticValue] = useState<T>(initialValue);
  const [isPending, startTransition] = useTransition();
  const debounceTimerRef = useRef<number | null>(null);
  const pendingValueRef = useRef<T>(initialValue);

  // Sync optimistic value when initial value changes externally
  useEffect(() => {
    startTransition(() => {
      setOptimisticValue(initialValue);
      pendingValueRef.current = initialValue;
    });
  }, [initialValue]);

  const updateValue = (newValue: T) => {
    // Immediate optimistic update - NO delay, instant UI feedback
    setOptimisticValue(newValue);
    pendingValueRef.current = newValue;

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce the actual state update (but computation is deferred via useDeferredValue)
    // This debounce is just to batch rapid changes
    debounceTimerRef.current = window.setTimeout(() => {
      startTransition(() => {
        onValueChange(pendingValueRef.current);
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
    value: optimisticValue,
    updateValue,
    isPending,
  };
}
