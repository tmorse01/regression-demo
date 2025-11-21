import { Box, Typography, Slider } from "@mui/material";
import { useMemo } from "react";
import type { Listing } from "../types/listing";

interface TimelineScrubberProps {
  listings: Listing[];
  dateRange: [number, number];
  onDateRangeChange: (range: [number, number]) => void;
}

export default function TimelineScrubber({
  listings,
  dateRange,
  onDateRangeChange,
}: TimelineScrubberProps) {
  const { minDate, maxDate } = useMemo(() => {
    if (listings.length === 0) {
      return { minDate: 2020, maxDate: 2024 };
    }
    const dates = listings.map((l) => l.listingDate || l.yearBuilt);
    const min = Math.min(...dates);
    const max = Math.max(...dates);
    return {
      minDate: Math.max(2020, Math.floor(min / 10) * 10), // Round down to nearest 10, but not below 2020
      maxDate: Math.min(2024, Math.ceil(max / 10) * 10), // Round up to nearest 10, but not above 2024
    };
  }, [listings]);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    const values = newValue as number[];
    onDateRangeChange([values[0], values[1]]);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="body2"
        sx={{
          mb: 1.5,
          color: "text.secondary",
          fontWeight: 500,
          fontSize: "0.75rem",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        Listing Date Range
      </Typography>
      <Slider
        value={dateRange}
        onChange={handleChange}
        min={minDate}
        max={maxDate}
        step={1}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => value.toString()}
        sx={{
          "& .MuiSlider-thumb": {
            width: 20,
            height: 20,
            boxShadow: "0 0 0 8px rgba(59, 130, 246, 0.16)",
            "&:hover": {
              boxShadow: "0 0 0 12px rgba(59, 130, 246, 0.24)",
            },
            "&.Mui-focusVisible": {
              boxShadow: "0 0 0 12px rgba(59, 130, 246, 0.24)",
            },
          },
          "& .MuiSlider-track": {
            height: 4,
            borderRadius: 2,
            background: "linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)",
          },
          "& .MuiSlider-rail": {
            height: 4,
            borderRadius: 2,
            opacity: 0.3,
          },
        }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 0.5,
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {minDate}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {maxDate}
        </Typography>
      </Box>
    </Box>
  );
}
