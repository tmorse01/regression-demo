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

  const updateFilter = (field: keyof Filters, value: number | null) => {
    // This will trigger the debounced update in the parent
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

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
                value={filters.priceMin || ""}
                onChange={(e) =>
                  updateFilter(
                    "priceMin",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                size="small"
                fullWidth
                InputProps={{
                  startAdornment: <span>$</span>,
                }}
              />
              <TextField
                label="Max"
                type="number"
                value={filters.priceMax || ""}
                onChange={(e) =>
                  updateFilter(
                    "priceMax",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
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
                value={filters.sqftMin || ""}
                onChange={(e) =>
                  updateFilter(
                    "sqftMin",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                size="small"
                fullWidth
              />
              <TextField
                label="Max"
                type="number"
                value={filters.sqftMax || ""}
                onChange={(e) =>
                  updateFilter(
                    "sqftMax",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
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
              Bedrooms: {filters.minBeds || 0}
            </Typography>
            <Slider
              value={filters.minBeds || 0}
              onChange={(_, value) => updateFilter("minBeds", value as number)}
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
              Bathrooms: {filters.minBaths || 0}
            </Typography>
            <Slider
              value={filters.minBaths || 0}
              onChange={(_, value) => updateFilter("minBaths", value as number)}
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
                value={filters.yearBuiltMin || ""}
                onChange={(e) =>
                  updateFilter(
                    "yearBuiltMin",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                size="small"
                fullWidth
              />
              <TextField
                label="Max"
                type="number"
                value={filters.yearBuiltMax || ""}
                onChange={(e) =>
                  updateFilter(
                    "yearBuiltMax",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
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
              Max Distance (miles): {filters.maxDistance || "No limit"}
            </Typography>
            <Slider
              value={filters.maxDistance || 10}
              onChange={(_, value) =>
                updateFilter("maxDistance", value as number)
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
