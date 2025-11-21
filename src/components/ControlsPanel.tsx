import {
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  Slider,
  Grid,
  Collapse,
  IconButton,
} from "@mui/material";
import { FilterList, ExpandMore, ExpandLess } from "@mui/icons-material";
import { useState } from "react";
import type { Filters } from "../types/listing";
import { useDebouncedInput } from "../hooks/useDebouncedInput";

interface ControlsPanelProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onReset: () => void;
}

export default function ControlsPanel({
  filters,
  onFiltersChange,
  onReset,
}: ControlsPanelProps) {
  const [expanded, setExpanded] = useState(true);

  // Helper to update a single filter field
  const updateFilter = (field: keyof Filters, value: number | null) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  // Debounced inputs for TextFields - local state with debounced parent updates
  const priceMinInput = useDebouncedInput<string>(
    filters.priceMin?.toString() || "",
    (value) => updateFilter("priceMin", value === "" ? null : Number(value)),
    { debounceMs: 300 }
  );

  const priceMaxInput = useDebouncedInput<string>(
    filters.priceMax?.toString() || "",
    (value) => updateFilter("priceMax", value === "" ? null : Number(value)),
    { debounceMs: 300 }
  );

  const sqftMinInput = useDebouncedInput<string>(
    filters.sqftMin?.toString() || "",
    (value) => updateFilter("sqftMin", value === "" ? null : Number(value)),
    { debounceMs: 300 }
  );

  const sqftMaxInput = useDebouncedInput<string>(
    filters.sqftMax?.toString() || "",
    (value) => updateFilter("sqftMax", value === "" ? null : Number(value)),
    { debounceMs: 300 }
  );

  const yearBuiltMinInput = useDebouncedInput<string>(
    filters.yearBuiltMin?.toString() || "",
    (value) =>
      updateFilter("yearBuiltMin", value === "" ? null : Number(value)),
    { debounceMs: 300 }
  );

  const yearBuiltMaxInput = useDebouncedInput<string>(
    filters.yearBuiltMax?.toString() || "",
    (value) =>
      updateFilter("yearBuiltMax", value === "" ? null : Number(value)),
    { debounceMs: 300 }
  );

  // Debounced inputs for Sliders
  const minBedsSlider = useDebouncedInput(
    filters.minBeds || 0,
    (value) => updateFilter("minBeds", value),
    { debounceMs: 200 }
  );

  const minBathsSlider = useDebouncedInput(
    filters.minBaths || 0,
    (value) => updateFilter("minBaths", value),
    { debounceMs: 200 }
  );

  const maxDistanceSlider = useDebouncedInput(
    filters.maxDistance || 10,
    (value) => updateFilter("maxDistance", value),
    { debounceMs: 200 }
  );

  return (
    <Paper
      sx={{
        p: 2.5,
        borderRadius: 3,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(0, 0, 0, 0.05)",
        boxShadow:
          "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "sticky",
        top: 20,
        maxHeight: "calc(100vh - 40px)",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "rgba(0, 0, 0, 0.2)",
          borderRadius: "4px",
          "&:hover": {
            background: "rgba(0, 0, 0, 0.3)",
          },
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: expanded ? 2 : 0,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FilterList sx={{ color: "primary.main" }} />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              fontSize: "1.1rem",
            }}
          >
            Filters
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={onReset}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 1.5,
            }}
          >
            Reset
          </Button>
          <IconButton
            size="small"
            onClick={() => setExpanded(!expanded)}
            sx={{
              display: { xs: "flex", md: "none" },
            }}
          >
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
      </Box>
      <Collapse in={expanded}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Typography
              variant="body2"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: "text.primary",
                fontSize: "0.875rem",
                mb: 1,
              }}
            >
              Price
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                label="Min"
                type="number"
                value={priceMinInput.value}
                onChange={(e) => priceMinInput.handleChange(e.target.value)}
                onBlur={() => priceMinInput.flush()}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: <span>$</span>,
                }}
              />
              <TextField
                label="Max"
                type="number"
                value={priceMaxInput.value}
                onChange={(e) => priceMaxInput.handleChange(e.target.value)}
                onBlur={() => priceMaxInput.flush()}
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: <span>$</span>,
                }}
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography
              variant="body2"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: "text.primary",
                fontSize: "0.875rem",
                mb: 1,
              }}
            >
              Size
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                label="Min"
                type="number"
                value={sqftMinInput.value}
                onChange={(e) => sqftMinInput.handleChange(e.target.value)}
                onBlur={() => sqftMinInput.flush()}
                size="small"
                fullWidth
              />
              <TextField
                label="Max"
                type="number"
                value={sqftMaxInput.value}
                onChange={(e) => sqftMaxInput.handleChange(e.target.value)}
                onBlur={() => sqftMaxInput.flush()}
                size="small"
                fullWidth
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography
              variant="body2"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: "text.primary",
                fontSize: "0.875rem",
                mb: 1,
              }}
            >
              Bedrooms: {minBedsSlider.value}
            </Typography>
            <Slider
              value={minBedsSlider.value}
              onChange={(_, value) =>
                minBedsSlider.handleChange(value as number)
              }
              onChangeCommitted={(_, value) =>
                minBedsSlider.handleCommit(value as number)
              }
              min={0}
              max={6}
              step={1}
              marks
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography
              variant="body2"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: "text.primary",
                fontSize: "0.875rem",
                mb: 1,
              }}
            >
              Bathrooms: {minBathsSlider.value}
            </Typography>
            <Slider
              value={minBathsSlider.value}
              onChange={(_, value) =>
                minBathsSlider.handleChange(value as number)
              }
              onChangeCommitted={(_, value) =>
                minBathsSlider.handleCommit(value as number)
              }
              min={0}
              max={5}
              step={0.5}
              marks
              valueLabelDisplay="auto"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography
              variant="body2"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: "text.primary",
                fontSize: "0.875rem",
                mb: 1,
              }}
            >
              Year Built
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                label="Min"
                type="number"
                value={yearBuiltMinInput.value}
                onChange={(e) => yearBuiltMinInput.handleChange(e.target.value)}
                onBlur={() => yearBuiltMinInput.flush()}
                size="small"
                fullWidth
              />
              <TextField
                label="Max"
                type="number"
                value={yearBuiltMaxInput.value}
                onChange={(e) => yearBuiltMaxInput.handleChange(e.target.value)}
                onBlur={() => yearBuiltMaxInput.flush()}
                size="small"
                fullWidth
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Typography
              variant="body2"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: "text.primary",
                fontSize: "0.875rem",
                mb: 1,
              }}
            >
              Max Distance (miles): {maxDistanceSlider.value || "No limit"}
            </Typography>
            <Slider
              value={maxDistanceSlider.value}
              onChange={(_, value) =>
                maxDistanceSlider.handleChange(value as number)
              }
              onChangeCommitted={(_, value) =>
                maxDistanceSlider.handleCommit(value as number)
              }
              min={0}
              max={10}
              step={0.5}
              marks={[
                { value: 0, label: "0" },
                { value: 5, label: "5" },
                { value: 10, label: "10" },
              ]}
              valueLabelDisplay="auto"
            />
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  );
}
