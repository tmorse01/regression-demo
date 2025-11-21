import {
  ToggleButton,
  ToggleButtonGroup,
  Box,
  Typography,
} from "@mui/material";
import {
  BarChart,
  TableChart,
  Dashboard,
  DarkMode,
  LightMode,
} from "@mui/icons-material";

export type ViewMode = "analysis" | "table" | "overview";
export type ThemeMode = "light" | "dark";

interface WorkspaceHeaderProps {
  viewMode: ViewMode;
  themeMode: ThemeMode;
  onViewModeChange: (mode: ViewMode) => void;
  onThemeModeChange: (mode: ThemeMode) => void;
}

export default function WorkspaceHeader({
  viewMode,
  themeMode,
  onViewModeChange,
  onThemeModeChange,
}: WorkspaceHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
        flexWrap: "wrap",
        gap: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: "text.primary",
        }}
      >
        Analysis Workspace
      </Typography>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newMode) => {
            if (newMode !== null) {
              onViewModeChange(newMode);
            }
          }}
          size="small"
          sx={{
            "& .MuiToggleButton-root": {
              px: 2,
              py: 0.75,
              textTransform: "none",
              fontWeight: 500,
              border: "1px solid",
              borderColor: "divider",
              "&.Mui-selected": {
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                "&:hover": {
                  backgroundColor: "primary.dark",
                },
              },
            },
          }}
        >
          <ToggleButton value="overview">
            <Dashboard sx={{ mr: 0.5, fontSize: 18 }} />
            Overview
          </ToggleButton>
          <ToggleButton value="analysis">
            <BarChart sx={{ mr: 0.5, fontSize: 18 }} />
            Analysis
          </ToggleButton>
          <ToggleButton value="table">
            <TableChart sx={{ mr: 0.5, fontSize: 18 }} />
            Table
          </ToggleButton>
        </ToggleButtonGroup>
        <ToggleButton
          value={themeMode}
          selected={themeMode === "dark"}
          onChange={() => {
            onThemeModeChange(themeMode === "light" ? "dark" : "light");
          }}
          size="small"
          sx={{
            px: 1.5,
            py: 0.75,
            border: "1px solid",
            borderColor: "divider",
            "&.Mui-selected": {
              backgroundColor: "primary.main",
              color: "primary.contrastText",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            },
          }}
        >
          {themeMode === "light" ? (
            <DarkMode sx={{ fontSize: 18 }} />
          ) : (
            <LightMode sx={{ fontSize: 18 }} />
          )}
        </ToggleButton>
      </Box>
    </Box>
  );
}
