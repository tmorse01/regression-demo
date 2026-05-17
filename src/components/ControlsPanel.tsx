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
import { useTheme } from "@mui/material/styles";
import { glassCardSx } from "../theme/glassSurfaces";
import { FilterList, ExpandMore, ExpandLess } from "@mui/icons-material";
import type { KeyboardEvent } from "react";
import { useState } from "react";
import type { Filters } from "../types/listing";
import { useDebouncedInput } from "../hooks/useDebouncedInput";
import {
  formatThousandsFromDigits,
  stripToAmountDigits,
} from "../utils/currencyDigitsInput";

/** Apply filter from numeric text inputs after idle (no blur) — price, sqft, year-built. */
const FILTER_TEXT_COMMIT_IDLE_MS = 1200;

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
  const theme = useTheme();
  const [expanded, setExpanded] = useState(true);

  // Helper to update a single filter field
  const updateFilter = (field: keyof Filters, value: number | null) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  /** Local digits; blur/Enter commit immediately. Long idle pushes filter without blur. */
  const priceMinInput = useDebouncedInput<string>(
    filters.priceMin?.toString() || "",
    (value) => updateFilter("priceMin", value === "" ? null : Number(value)),
    { strategy: "commit", commitIdleDebounceMs: FILTER_TEXT_COMMIT_IDLE_MS }
  );

  const priceMaxInput = useDebouncedInput<string>(
    filters.priceMax?.toString() || "",
    (value) => updateFilter("priceMax", value === "" ? null : Number(value)),
    { strategy: "commit", commitIdleDebounceMs: FILTER_TEXT_COMMIT_IDLE_MS }
  );

  const sqftMinInput = useDebouncedInput<string>(
    filters.sqftMin?.toString() || "",
    (value) => updateFilter("sqftMin", value === "" ? null : Number(value)),
    { strategy: "commit", commitIdleDebounceMs: FILTER_TEXT_COMMIT_IDLE_MS }
  );

  const sqftMaxInput = useDebouncedInput<string>(
    filters.sqftMax?.toString() || "",
    (value) => updateFilter("sqftMax", value === "" ? null : Number(value)),
    { strategy: "commit", commitIdleDebounceMs: FILTER_TEXT_COMMIT_IDLE_MS }
  );

  const yearBuiltMinInput = useDebouncedInput<string>(
    filters.yearBuiltMin?.toString() || "",
    (value) =>
      updateFilter("yearBuiltMin", value === "" ? null : Number(value)),
    { strategy: "commit", commitIdleDebounceMs: FILTER_TEXT_COMMIT_IDLE_MS }
  );

  const yearBuiltMaxInput = useDebouncedInput<string>(
    filters.yearBuiltMax?.toString() || "",
    (value) =>
      updateFilter("yearBuiltMax", value === "" ? null : Number(value)),
    { strategy: "commit", commitIdleDebounceMs: FILTER_TEXT_COMMIT_IDLE_MS }
  );

  /** Thumb moves during drag locally; filtered data updates on release */
  const minBedsSlider = useDebouncedInput(
    filters.minBeds || 0,
    (value) => updateFilter("minBeds", value),
    { strategy: "commit" }
  );

  const minBathsSlider = useDebouncedInput(
    filters.minBaths || 0,
    (value) => updateFilter("minBaths", value),
    { strategy: "commit" }
  );

  const maxDistanceSlider = useDebouncedInput(
    filters.maxDistance || 10,
    (value) => updateFilter("maxDistance", value),
    { strategy: "commit" }
  );

  const commitFilterNumericHandlers = (
    input: Pick<typeof priceMinInput, "handleChange" | "handleCommit">
  ) => ({
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      input.handleChange(e.target.value),
    onBlur: (e: React.FocusEvent<HTMLInputElement>) =>
      input.handleCommit(e.target.value),
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        input.handleCommit(e.currentTarget.value);
      }
    },
  });

  const commitCurrencyAmountHandlers = (
    input: Pick<
      typeof priceMinInput,
      "value" | "handleChange" | "handleCommit"
    >
  ) => ({
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      input.handleChange(stripToAmountDigits(e.target.value)),
    onBlur: () => input.handleCommit(input.value),
    onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        input.handleCommit(input.value);
      }
    },
  });

  return (
    <Paper
      sx={{
        ...glassCardSx(theme),
        p: 2.5,
        borderRadius: 3,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "sticky",
        top: 20,
        maxHeight: "calc(100vh - 40px)",
        overflowY: "auto",
        overflowX: "hidden",
        width: "100%",
        minWidth: 0,
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "transparent",
        },
        "&::-webkit-scrollbar-thumb": {
          background:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.22)"
              : "rgba(0, 0, 0, 0.2)",
          borderRadius: "4px",
          "&:hover": {
            background:
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.32)"
                : "rgba(0, 0, 0, 0.3)",
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
        <Grid container spacing={2} sx={{ width: "100%", minWidth: 0 }}>
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
            <Box sx={{ display: "flex", gap: 1, width: "100%", minWidth: 0 }}>
              <TextField
                label="Min"
                type="text"
                inputMode="numeric"
                value={formatThousandsFromDigits(priceMinInput.value)}
                {...commitCurrencyAmountHandlers(priceMinInput)}
                size="small"
                fullWidth
                sx={{ minWidth: 0 }}
                slotProps={{
                  input: { startAdornment: <span>$</span> },
                }}
              />
              <TextField
                label="Max"
                type="text"
                inputMode="numeric"
                value={formatThousandsFromDigits(priceMaxInput.value)}
                {...commitCurrencyAmountHandlers(priceMaxInput)}
                size="small"
                fullWidth
                sx={{ minWidth: 0 }}
                slotProps={{
                  input: { startAdornment: <span>$</span> },
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
            <Box sx={{ display: "flex", gap: 1, width: "100%", minWidth: 0 }}>
              <TextField
                label="Min"
                type="number"
                value={sqftMinInput.value}
                {...commitFilterNumericHandlers(sqftMinInput)}
                size="small"
                fullWidth
                sx={{ minWidth: 0 }}
              />
              <TextField
                label="Max"
                type="number"
                value={sqftMaxInput.value}
                {...commitFilterNumericHandlers(sqftMaxInput)}
                size="small"
                fullWidth
                sx={{ minWidth: 0 }}
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
              sx={{ width: "100%" }}
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
              sx={{ width: "100%" }}
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
            <Box sx={{ display: "flex", gap: 1, width: "100%", minWidth: 0 }}>
              <TextField
                label="Min"
                type="number"
                value={yearBuiltMinInput.value}
                {...commitFilterNumericHandlers(yearBuiltMinInput)}
                size="small"
                fullWidth
                sx={{ minWidth: 0 }}
              />
              <TextField
                label="Max"
                type="number"
                value={yearBuiltMaxInput.value}
                {...commitFilterNumericHandlers(yearBuiltMaxInput)}
                size="small"
                fullWidth
                sx={{ minWidth: 0 }}
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
              sx={{ width: "100%" }}
            />
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  );
}
