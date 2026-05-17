import {
  createTheme,
  type PaletteMode,
  type ThemeOptions,
} from "@mui/material/styles";

const typography: ThemeOptions["typography"] = {
  fontFamily: [
    '"Poppins"',
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    "sans-serif",
  ].join(","),
  h1: {
    fontWeight: 700,
    fontSize: "2.5rem",
    lineHeight: 1.2,
    letterSpacing: "-0.02em",
  },
  h2: {
    fontWeight: 700,
    fontSize: "2rem",
    lineHeight: 1.3,
    letterSpacing: "-0.02em",
  },
  h3: {
    fontWeight: 600,
    fontSize: "1.75rem",
    lineHeight: 1.3,
    letterSpacing: "-0.01em",
  },
  h4: {
    fontWeight: 600,
    fontSize: "1.5rem",
    lineHeight: 1.4,
  },
  h5: {
    fontWeight: 600,
    fontSize: "1.25rem",
    lineHeight: 1.4,
    letterSpacing: "-0.02em",
  },
  h6: {
    fontWeight: 600,
    fontSize: "1.125rem",
    lineHeight: 1.5,
  },
  body1: {
    fontSize: "1rem",
    lineHeight: 1.5,
  },
  body2: {
    fontSize: "0.875rem",
    lineHeight: 1.5,
  },
  button: {
    fontWeight: 500,
    textTransform: "none",
  },
};

export function createAppTheme(mode: PaletteMode) {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: isDark
        ? {
            main: "#cbd5e1",
            light: "#e2e8f0",
            dark: "#94a3b8",
          }
        : {
            main: "#1e293b",
            light: "#475569",
            dark: "#0f172a",
          },
      secondary: {
        main: "#3b82f6",
        light: "#60a5fa",
        dark: "#2563eb",
      },
      background: isDark
        ? {
            default: "#0f172a",
            paper: "#1e293b",
          }
        : {
            default: "#f8fafc",
            paper: "#ffffff",
          },
      // Must be a valid color string; `undefined` breaks MUI TableCell borders (decomposeColor).
      divider: isDark
        ? "rgba(148, 163, 184, 0.16)"
        : "rgba(15, 23, 42, 0.12)",
    },
    typography,
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow:
              "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
            background: isDark
              ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
              : "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          },
        },
      },
    },
  });
}
