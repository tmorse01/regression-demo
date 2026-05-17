import { useState, useEffect, useRef, useCallback } from "react";

/**
 * Reusable hook for debounced input handling
 *
 * **strategy `'debounce'`** (default): immediate local UI updates plus debounced parent
 * updates on each change (good while dragging sliders that need gradual feedback elsewhere).
 *
 * **strategy `'commit'`**: changes only update local state; parent receives values on
 * `handleCommit` / `flush` (e.g. TextField blur, Slider release). Optionally
 * **`commitIdleDebounceMs`** also pushes to the parent after the user stops changing
 * the value for that long — without requiring blur — while **`dirty`** blocks prop
 * overwrites mid-typing (preset/reset may not reflect until blur if still editing).
 *
 * @param debounceMs - Debounce delay when strategy is `'debounce'` (default: 250)
 * @param commitIdleDebounceMs - When strategy is `'commit'`, idle timeout to call `onValueChange`
 */
export function useDebouncedInput<T>(
  initialValue: T,
  onValueChange: (value: T) => void,
  options?: {
    debounceMs?: number;
    onCommit?: (value: T) => void;
    strategy?: "debounce" | "commit";
    /** Idle push to parent without blur (commit strategy only). */
    commitIdleDebounceMs?: number;
  }
) {
  const {
    debounceMs = 250,
    onCommit,
    strategy = "debounce",
    commitIdleDebounceMs,
  } = options || {};

  const [localValue, setLocalValue] = useState<T>(initialValue);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Mirrors localValue for synchronous comparisons inside idle callbacks */
  const localRef = useRef<T>(initialValue);
  /** Latest value passed to handleChange; idle callback reads this */
  const latestIdleRef = useRef<T>(initialValue);
  const dirtyRef = useRef(false);

  // sync from props
  useEffect(() => {
    if (strategy === "commit") {
      if (dirtyRef.current) return;
      setLocalValue(initialValue);
      localRef.current = initialValue;
      return;
    }
    setLocalValue(initialValue);
    localRef.current = initialValue;
  }, [initialValue, strategy]);

  const debouncedUpdate = useCallback(
    (value: T) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        onValueChange(value);
      }, debounceMs);
    },
    [onValueChange, debounceMs]
  );

  const handleChange = useCallback(
    (value: T) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }

      latestIdleRef.current = value;
      localRef.current = value;
      setLocalValue(value);
      dirtyRef.current = true;

      if (strategy === "debounce") {
        debouncedUpdate(value);
        return;
      }

      if (commitIdleDebounceMs != null && commitIdleDebounceMs > 0) {
        idleTimerRef.current = setTimeout(() => {
          idleTimerRef.current = null;
          const v = latestIdleRef.current;
          onValueChange(v);
          if (Object.is(v, localRef.current)) {
            dirtyRef.current = false;
          }
        }, commitIdleDebounceMs);
      }
    },
    [debouncedUpdate, strategy, commitIdleDebounceMs, onValueChange]
  );

  const handleCommit = useCallback(
    (value: T) => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
        idleTimerRef.current = null;
      }

      latestIdleRef.current = value;
      localRef.current = value;
      setLocalValue(value);
      onValueChange(value);
      dirtyRef.current = false;

      if (onCommit) {
        onCommit(value);
      }
    },
    [onValueChange, onCommit]
  );

  const flush = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    const v = localRef.current;
    onValueChange(v);
    dirtyRef.current = false;
  }, [onValueChange]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
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
