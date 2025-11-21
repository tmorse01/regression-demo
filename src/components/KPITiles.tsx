import { useEffect, useState, useRef } from "react";
import { Card, CardContent, Typography, Box, useTheme } from "@mui/material";
import { Home, TrendingUp, SquareFoot, LocationOn } from "@mui/icons-material";
import type { Listing } from "../types/listing";
import {
  medianPrice,
  medianPricePerSqft,
  averageDistance,
} from "../utils/stats";

interface KPITilesProps {
  listings: Listing[];
}

interface KPITileProps {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
  formatValue?: (val: number) => string;
}

function KPITile({ label, value, icon, color, formatValue }: KPITileProps) {
  const theme = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const prevValueRef = useRef(value);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      // Trigger animation state change
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      prevValueRef.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  const displayValue =
    formatValue && typeof value === "number" ? formatValue(value) : value;

  return (
    <Card
      sx={{
        height: "100%",
        position: "relative",
        borderRadius: 3,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        border: `1px solid rgba(255, 255, 255, 0.3)`,
        boxShadow: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06),
          0 0 0 1px rgba(0, 0, 0, 0.05)`,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${color}, ${color}dd)`,
        },
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05),
            0 0 0 1px rgba(0, 0, 0, 0.05), 0 0 20px ${color}33`,
        },
      }}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.5,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 500,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {label}
          </Typography>
          <Box
            sx={{
              color: `${color}88`,
              display: "flex",
              alignItems: "center",
              transition: "all 0.3s ease",
            }}
          >
            {icon}
          </Box>
        </Box>
        <Typography
          variant="h4"
          component="div"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            transform: isAnimating ? "scale(1.05)" : "scale(1)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            lineHeight: 1.2,
            opacity: isAnimating ? 0.7 : 1,
          }}
          key={value}
        >
          {displayValue}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default function KPITiles({ listings }: KPITilesProps) {
  const theme = useTheme();
  const count = listings.length;
  const median = medianPrice(listings);
  const medianPerSqft = medianPricePerSqft(listings);
  const avgDistance = averageDistance(listings);

  const tiles = [
    {
      label: "Active Comps",
      value: count,
      icon: <Home sx={{ fontSize: 20 }} />,
      color: theme.palette.primary.main,
      formatValue: (val: number) => Math.round(val).toLocaleString(),
    },
    {
      label: "Median Price",
      value: median,
      icon: <TrendingUp sx={{ fontSize: 20 }} />,
      color: theme.palette.secondary.main,
      formatValue: (val: number) => `$${Math.round(val).toLocaleString()}`,
    },
    {
      label: "Median Price/Sqft",
      value: medianPerSqft,
      icon: <SquareFoot sx={{ fontSize: 20 }} />,
      color: theme.palette.success?.main || "#10b981",
      formatValue: (val: number) => `$${val.toFixed(2)}`,
    },
    {
      label: "Avg Distance",
      value: avgDistance,
      icon: <LocationOn sx={{ fontSize: 20 }} />,
      color: theme.palette.info?.main || "#3b82f6",
      formatValue: (val: number) => `${val.toFixed(2)} mi`,
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, 1fr)",
          md: "repeat(4, 1fr)",
        },
        gap: 2,
        mb: 3,
      }}
    >
      {tiles.map((tile, index) => (
        <KPITile key={index} {...tile} />
      ))}
    </Box>
  );
}
