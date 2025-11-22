import { useState, useEffect, useRef } from "react";

interface UseLoadingProgressOptions {
  duration?: number;
  updateInterval?: number;
}

// Module-level flag that persists across component remounts
let globalIsCompleted = false;

export function useLoadingProgress(options: UseLoadingProgressOptions = {}) {
  const { duration = 3000, updateInterval = 50 } = options;
  const [progress, setProgress] = useState(() => {
    // Initialize state based on global completion status
    return globalIsCompleted ? 100 : 0;
  });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isCompletedRef = useRef(globalIsCompleted);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Prevent restarting if already completed globally
    if (globalIsCompleted || isCompletedRef.current) {
      isCompletedRef.current = true;
      // State should already be initialized to 100 via lazy initializer
      return;
    }

    const startTime = Date.now();
    startTimeRef.current = startTime;

    timerRef.current = setInterval(() => {
      // Don't process if already completed - check first thing
      if (isCompletedRef.current) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        return;
      }

      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min((elapsed / duration) * 100, 100);

      // Check if we've reached 100% BEFORE updating state
      if (progressPercent >= 100) {
        globalIsCompleted = true; // Set global flag
        isCompletedRef.current = true;
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        // Set to 100% and ensure it stays there
        setProgress(() => 100);
        return;
      }

      setProgress((oldProgress) => {
        // Critical: Never allow progress to decrease or reset
        // If we've already reached 100%, lock it there
        if (oldProgress >= 100 || isCompletedRef.current || globalIsCompleted) {
          globalIsCompleted = true;
          isCompletedRef.current = true;
          return 100;
        }

        // Smooth progression with slight randomization for natural feel
        // Always ensure new progress is >= old progress
        const baseProgress = progressPercent;
        const randomOffset = (Math.random() - 0.5) * 2; // Small random variation
        const candidateProgress = baseProgress + randomOffset;

        // Only allow forward progress - never go backwards
        const newProgress = Math.min(
          Math.max(candidateProgress, oldProgress),
          100
        );

        // Mark as completed if we've reached 100%
        if (newProgress >= 100) {
          globalIsCompleted = true;
          isCompletedRef.current = true;
        }

        return newProgress;
      });
    }, updateInterval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [duration, updateInterval]);

  return progress;
}
