import type { Theme } from "@mui/material/styles";

/** Shared frosted-card look for light/dark palettes. */
export function glassCardSx(theme: Theme) {
  const isDark = theme.palette.mode === "dark";
  return {
    background: isDark ? "rgba(30, 41, 59, 0.94)" : "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    border: isDark
      ? "1px solid rgba(148, 163, 184, 0.14)"
      : "1px solid rgba(0, 0, 0, 0.05)",
    boxShadow: isDark
      ? "0 4px 6px -1px rgba(0, 0, 0, 0.35), 0 2px 4px -1px rgba(0, 0, 0, 0.22)"
      : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  };
}
