import {
  Paper,
  TextField,
  Typography,
  Button,
  Box,
  Slider,
  Grid,
} from "@mui/material";
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
  const updateFilter = (field: keyof Filters, value: number | null) => {
    onFiltersChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6">Filters</Typography>
        <Button variant="outlined" size="small" onClick={onReset}>
          Reset
        </Button>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="body2" gutterBottom>
            Price Range
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

        <Grid item xs={12}>
          <Typography variant="body2" gutterBottom>
            Square Feet Range
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

        <Grid item xs={12}>
          <Typography variant="body2" gutterBottom>
            Minimum Bedrooms: {filters.minBeds || 0}
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

        <Grid item xs={12}>
          <Typography variant="body2" gutterBottom>
            Minimum Bathrooms: {filters.minBaths || 0}
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

        <Grid item xs={12}>
          <Typography variant="body2" gutterBottom>
            Year Built Range
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

        <Grid item xs={12}>
          <Typography variant="body2" gutterBottom>
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
    </Paper>
  );
}

