import { Chip, Box, Typography } from "@mui/material";
import type { Filters } from "../types/listing";

interface FilterPresetsProps {
  activePreset: string | null;
  onPresetSelect: (preset: string | null, filters: Filters) => void;
  onReset: () => void;
}

interface Preset {
  id: string;
  label: string;
  filters: Filters;
}

const presets: Preset[] = [
  {
    id: "starter",
    label: "Starter Homes",
    filters: {
      priceMin: null,
      priceMax: 300000,
      sqftMin: null,
      sqftMax: 2000,
      minBeds: 2,
      minBaths: 1,
      yearBuiltMin: null,
      yearBuiltMax: null,
      maxDistance: null,
    },
  },
  {
    id: "luxury",
    label: "Luxury",
    filters: {
      priceMin: 500000,
      priceMax: null,
      sqftMin: 2500,
      sqftMax: null,
      minBeds: 3,
      minBaths: 2,
      yearBuiltMin: null,
      yearBuiltMax: null,
      maxDistance: null,
    },
  },
  {
    id: "fixers",
    label: "Fixers",
    filters: {
      priceMin: null,
      priceMax: 400000,
      sqftMin: null,
      sqftMax: null,
      minBeds: null,
      minBaths: null,
      yearBuiltMin: null,
      yearBuiltMax: 1990,
      maxDistance: null,
    },
  },
  {
    id: "cashflow",
    label: "Cashflow Focus",
    filters: {
      priceMin: null,
      priceMax: 350000,
      sqftMin: 1200,
      sqftMax: 2500,
      minBeds: 2,
      minBaths: 1.5,
      yearBuiltMin: 1980,
      yearBuiltMax: null,
      maxDistance: 5,
    },
  },
];

export default function FilterPresets({
  activePreset,
  onPresetSelect,
  onReset,
}: FilterPresetsProps) {
  return (
    <Box
      sx={{
        mb: 2,
        display: "flex",
        flexWrap: "wrap",
        gap: 1,
        alignItems: "center",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          fontWeight: 500,
          mr: 1,
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        Quick Filters:
      </Typography>
      {presets.map((preset) => (
        <Chip
          key={preset.id}
          label={preset.label}
          onClick={() => {
            if (activePreset === preset.id) {
              onReset();
              onPresetSelect(null, preset.filters);
            } else {
              onPresetSelect(preset.id, preset.filters);
            }
          }}
          variant={activePreset === preset.id ? "filled" : "outlined"}
          color={activePreset === preset.id ? "primary" : "default"}
          sx={{
            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: activePreset === preset.id ? "scale(1.05)" : "scale(1)",
            fontWeight: activePreset === preset.id ? 600 : 500,
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            },
          }}
        />
      ))}
    </Box>
  );
}
