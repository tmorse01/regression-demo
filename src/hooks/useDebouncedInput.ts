import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Reusable hook for debounced input handling
 *
 * Provides immediate local state updates for responsive UI while debouncing
 * expensive parent state updates. Perfect for TextFields, Sliders, and other inputs.
 *
 * @param initialValue - Initial value for the input
 * @param onValueChange - Callback to update parent state (debounced)
 * @param debounceMs - Debounce delay in milliseconds (default: 250)
 * @param onCommit - Optional immediate callback when user commits (e.g., onBlur, onChangeCommitted)
 *
 * @returns Object with:
 *   - value: Current local value (updates immediately)
 *   - setValue: Function to update the value
 *   - handleChange: Debounced change handler
 *   - handleCommit: Immediate commit handler
 *   - flush: Manually flush pending debounced update
 */
export function useDebouncedInput<T>(
  initialValue: T,
  onValueChange: (value: T) => void,
  options?: {
    debounceMs?: number;
    onCommit?: (value: T) => void;
  }
) {
  const { debounceMs = 250, onCommit } = options || {};

  // Local state for immediate UI updates
  const [localValue, setLocalValue] = useState<T>(initialValue);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync local state when initial value changes externally (e.g., from filter presets)
  useEffect(() => {
    setLocalValue(initialValue);
  }, [initialValue]);

  // Debounced update function
  const debouncedUpdate = useCallback(
    (value: T) => {
      // Clear existing debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Debounce the parent update
      debounceTimerRef.current = setTimeout(() => {
        onValueChange(value);
      }, debounceMs);
    },
    [onValueChange, debounceMs]
  );

  // Handle change - immediate local update, debounced parent update
  const handleChange = useCallback(
    (value: T) => {
      setLocalValue(value);
      debouncedUpdate(value);
    },
    [debouncedUpdate]
  );

  // Handle commit - flush debounced update immediately
  const handleCommit = useCallback(
    (value: T) => {
      // Clear any pending debounced update
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      setLocalValue(value);

      // Immediate update to parent
      onValueChange(value);

      // Call optional commit callback
      if (onCommit) {
        onCommit(value);
      }
    },
    [onValueChange, onCommit]
  );

  // Manually flush pending update
  const flush = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    onValueChange(localValue);
  }, [localValue, onValueChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return {
    value: localValue,
    setValue: setLocalValue,
    handleChange,
    handleCommit,
    flush,
  };
}
