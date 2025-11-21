import { useState } from "react";
import Grid from "@mui/material/Grid";
import { Paper, Typography, useTheme } from "@mui/material";
import {
  ScatterChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import ChartCard from "./ChartCard";
import type { Listing, SubjectProperty } from "../types/listing";
import { computeLinearRegression } from "../utils/regression";
import {
  getBedColor,
  getSubjectPropertyColor,
  getRegressionLineColor,
  getHighlightedColor,
} from "../utils/chartPalette";

interface ChartsGridProps {
  listings: Listing[];
  subjectProperty?: SubjectProperty;
  highlightedListingId?: string | null;
  onListingHover?: (listingId: string | null) => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number | string;
  }>;
  label?: string | number;
}

const formatPriceValue = (
  name: string | undefined,
  value: number | string
): string => {
  if (typeof value !== "number") return String(value);

  // Format Price values (for first chart)
  if (name === "Price") {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`;
    }
    return `$${value.toLocaleString()}`;
  }

  // Format Price/Sqft values (for second chart) - abbreviate
  if (name === "Price/Sqft" || name?.includes("Price/Sqft")) {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k/sqft`;
    }
    return `$${Math.round(value)}/sqft`;
  }

  // Default formatting for other numeric values
  return value.toLocaleString();
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <Paper
        elevation={4}
        sx={(theme) => ({
          p: 1.5,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
        })}
      >
        {label && (
          <Typography variant="subtitle2" sx={{ mb: 0.5, fontWeight: 600 }}>
            {typeof label === "number" ? label.toLocaleString() : label}
          </Typography>
        )}
        {payload.map((entry, index) => (
          <Typography
            key={index}
            variant="body2"
            sx={(theme) => ({
              color: theme.palette.text.primary,
              "&:not(:last-child)": { mb: 0.5 },
            })}
          >
            <strong>{entry.name}:</strong>{" "}
            {typeof entry.value === "number"
              ? formatPriceValue(entry.name, entry.value)
              : entry.value}
          </Typography>
        ))}
      </Paper>
    );
  }
  return null;
};

// Helper function to get color based on distance or beds
// Now uses the chart palette for theme-aligned colors
const getColorForPoint = (
  _distance: number,
  _maxDistance: number,
  beds: number,
  isSubject: boolean,
  isHighlighted: boolean
): string => {
  if (isSubject) {
    return getSubjectPropertyColor();
  }
  if (isHighlighted) {
    return getHighlightedColor();
  }
  // Color by beds using theme-aligned palette
  return getBedColor(beds);
};

export default function ChartsGrid({
  listings,
  subjectProperty,
  highlightedListingId,
  onListingHover,
}: ChartsGridProps) {
  const theme = useTheme();
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  const maxDistance = Math.max(
    ...listings.map((l) => l.distanceFromSubject),
    1
  );

  const scatterData = listings.map((l) => {
    const isHighlighted =
      highlightedListingId === l.id || hoveredPoint === l.id;
    return {
      id: l.id,
      sqft: l.sqft,
      price: l.price,
      beds: l.beds,
      baths: l.baths,
      distance: l.distanceFromSubject,
      isHighlighted,
      fill: getColorForPoint(
        l.distanceFromSubject,
        maxDistance,
        l.beds,
        false,
        isHighlighted
      ),
      r: isHighlighted ? 6 : 4,
    };
  });

  // Group by bed count for color coding
  const scatterByBeds = [2, 3, 4, 5].map((bedCount) => ({
    bedCount,
    data: scatterData.filter((d) => d.beds === bedCount),
    color: getColorForPoint(0, 1, bedCount, false, false),
  }));

  // Add subject property point if provided
  const subjectPoint = subjectProperty
    ? {
        sqft: subjectProperty.sqft,
        price: subjectProperty.sqft * 350, // Estimate
      }
    : null;

  // Calculate sqft range for proper axis domain
  const sqftMin = Math.min(...listings.map((l) => l.sqft));
  const sqftMax = Math.max(...listings.map((l) => l.sqft));
  const sqftRange = sqftMax - sqftMin;
  const sqftDomain = [
    Math.max(0, sqftMin - sqftRange * 0.05), // Add 5% padding below, but don't go below 0
    sqftMax + sqftRange * 0.05, // Add 5% padding above
  ];

  const regressionLine = computeLinearRegression(
    listings.map((l) => ({ sqft: l.sqft, price: l.price }))
  );

  const distanceData = listings.map((l) => ({
    distance: l.distanceFromSubject,
    pricePerSqft: l.price / l.sqft,
  }));

  const pricePerSqftData = listings.map((l) => l.price / l.sqft);
  const minPricePerSqft = Math.min(...pricePerSqftData);
  const maxPricePerSqft = Math.max(...pricePerSqftData);

  // Calculate price per sqft domain with padding (5% padding on each side)
  // Start at the minimum value in the dataset, not 0
  const pricePerSqftRange = maxPricePerSqft - minPricePerSqft;
  const pricePerSqftDomain = [
    minPricePerSqft - pricePerSqftRange * 0.05, // Start at min with 5% padding below
    maxPricePerSqft + pricePerSqftRange * 0.05, // End at max with 5% padding above
  ];

  const binSize = (maxPricePerSqft - minPricePerSqft) / 20;
  const histogramData = Array.from({ length: 20 }, (_, i) => {
    const binStart = minPricePerSqft + i * binSize;
    const binEnd = binStart + binSize;
    const count = pricePerSqftData.filter(
      (p) => p >= binStart && p < binEnd
    ).length;
    return {
      range: `${Math.round(binStart)}-${Math.round(binEnd)}`,
      count,
      mid: (binStart + binEnd) / 2,
    };
  });

  const yearData = listings.map((l) => ({
    year: l.yearBuilt,
    pricePerSqft: l.price / l.sqft,
  }));

  // Calculate year range for proper axis domain
  const yearMin = Math.min(...listings.map((l) => l.yearBuilt));
  const yearMax = Math.max(...listings.map((l) => l.yearBuilt));
  const yearDomain = [
    Math.floor(yearMin / 10) * 10 - 5, // Round down to nearest 10 and subtract 5
    Math.ceil(yearMax / 10) * 10 + 5, // Round up to nearest 10 and add 5
  ];

  // Chart styling constants
  const axisStyle = {
    stroke: theme.palette.text.secondary,
    fontSize: 12,
    fontFamily: theme.typography.fontFamily,
  };

  const gridStyle = {
    stroke: theme.palette.divider,
    strokeDasharray: "3 3",
    strokeOpacity: 0.5,
  };

  return (
    <Grid container spacing={2} sx={{ width: "100%" }}>
      <Grid size={{ xs: 12, md: 6, lg: 6 }}>
        <ChartCard title="Sqft vs Price (with Regression)" height={300}>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart
              data={scatterData}
              margin={{ top: 10, right: 10, bottom: 20, left: 10 }}
            >
              <CartesianGrid {...gridStyle} />
              <XAxis
                type="number"
                dataKey="sqft"
                name="Square Feet"
                domain={sqftDomain}
                tick={axisStyle}
                label={{
                  value: "Square Feet",
                  position: "insideBottom",
                  offset: -5,
                  style: { ...axisStyle, fontWeight: 500 },
                }}
              />
              <YAxis
                type="number"
                dataKey="price"
                name="Price"
                tick={axisStyle}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                label={{
                  value: "Price ($)",
                  angle: -90,
                  position: "insideLeft",
                  style: { ...axisStyle, fontWeight: 500 },
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              {scatterByBeds.map((group) => (
                <Scatter
                  key={`scatter-${group.bedCount}`}
                  data={group.data}
                  dataKey="price"
                  fill={group.color}
                  fillOpacity={0.6}
                  onMouseEnter={(data: { id?: string }) => {
                    const entry = scatterData.find((d) => d.id === data?.id);
                    if (entry?.id && onListingHover) {
                      setHoveredPoint(entry.id);
                      onListingHover(entry.id);
                    }
                  }}
                  onMouseLeave={() => {
                    setHoveredPoint(null);
                    if (onListingHover) {
                      onListingHover(null);
                    }
                  }}
                />
              ))}
              {subjectPoint && (
                <Scatter
                  dataKey="price"
                  data={[subjectPoint]}
                  fill={getSubjectPropertyColor()}
                  fillOpacity={0.9}
                  shape={(props: unknown) => {
                    const p = props as { cx?: number; cy?: number };
                    const { cx, cy } = p;
                    if (cx === undefined || cy === undefined) {
                      return <g />;
                    }
                    const subjectColor = getSubjectPropertyColor();
                    return (
                      <g>
                        <circle
                          cx={cx}
                          cy={cy}
                          r={10}
                          fill={subjectColor}
                          fillOpacity={0.9}
                          style={{
                            filter: `drop-shadow(0 0 10px ${subjectColor})`,
                          }}
                        />
                        <circle cx={cx} cy={cy} r={3} fill="#fff" />
                      </g>
                    );
                  }}
                />
              )}
              {regressionLine && (
                <Line
                  type="linear"
                  data={regressionLine}
                  dataKey="price"
                  stroke={getRegressionLineColor()}
                  strokeWidth={3}
                  dot={false}
                  name="Regression Line"
                  strokeDasharray="5 5"
                  z={100}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              )}
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 6 }}>
        <ChartCard title="Distance vs Price/Sqft" height={300}>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart
              data={distanceData}
              margin={{ top: 10, right: 10, bottom: 20, left: 10 }}
            >
              <CartesianGrid {...gridStyle} />
              <XAxis
                type="number"
                dataKey="distance"
                name="Distance (miles)"
                tick={axisStyle}
                label={{
                  value: "Distance (miles)",
                  position: "insideBottom",
                  offset: -5,
                  style: { ...axisStyle, fontWeight: 500 },
                }}
              />
              <YAxis
                type="number"
                dataKey="pricePerSqft"
                name="Price/Sqft"
                domain={pricePerSqftDomain}
                tick={axisStyle}
                tickFormatter={(value) => `$${Math.round(value)}`}
                label={{
                  value: "$/Sqft",
                  angle: -90,
                  position: "left",
                  style: { ...axisStyle, fontWeight: 500 },
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter dataKey="pricePerSqft" fillOpacity={0.6}>
                {distanceData.map((_entry, index) => {
                  const listing = listings[index];
                  const distanceRatio =
                    listing.distanceFromSubject / maxDistance;
                  const intensity = 1 - distanceRatio * 0.5; // Light to dark gradient
                  const color = theme.palette.info.main;
                  return (
                    <Cell
                      key={`cell-distance-${index}`}
                      fill={color}
                      opacity={intensity}
                      r={highlightedListingId === listing.id ? 6 : 4}
                      style={{
                        filter:
                          highlightedListingId === listing.id
                            ? `drop-shadow(0 0 6px ${color})`
                            : "none",
                        transition: "all 0.2s ease",
                      }}
                    />
                  );
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 6 }}>
        <ChartCard title="Price/Sqft Distribution" height={300}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={histogramData}
              margin={{ top: 10, right: 10, bottom: 20, left: 10 }}
            >
              <CartesianGrid {...gridStyle} />
              <XAxis
                dataKey="mid"
                tick={axisStyle}
                label={{
                  value: "Price/Sqft ($)",
                  position: "insideBottom",
                  offset: -5,
                  style: { ...axisStyle, fontWeight: 500 },
                }}
                tickFormatter={(value) => `$${Math.round(value)}`}
              />
              <YAxis
                tick={axisStyle}
                label={{
                  value: "Count",
                  angle: -90,
                  position: "insideLeft",
                  style: { ...axisStyle, fontWeight: 500 },
                }}
                domain={[0, "dataMax"]}
              />
              <Tooltip
                content={<CustomTooltip />}
                labelFormatter={(value) => `$${Math.round(value)}`}
                formatter={(value: number) => value}
              />
              <Bar
                dataKey="count"
                fill={theme.palette.primary.main}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 6 }}>
        <ChartCard title="Year Built vs Price/Sqft" height={300}>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart
              data={yearData}
              margin={{ top: 10, right: 10, bottom: 20, left: 10 }}
            >
              <CartesianGrid {...gridStyle} />
              <XAxis
                type="number"
                dataKey="year"
                name="Year Built"
                domain={yearDomain}
                tick={axisStyle}
                label={{
                  value: "Year Built",
                  position: "insideBottom",
                  offset: -5,
                  style: { ...axisStyle, fontWeight: 500 },
                }}
                tickFormatter={(value) => value.toString()}
              />
              <YAxis
                type="number"
                dataKey="pricePerSqft"
                name="Price/Sqft"
                domain={pricePerSqftDomain}
                tick={axisStyle}
                tickFormatter={(value) => `$${Math.round(value)}`}
                label={{
                  value: "$/Sqft",
                  angle: -90,
                  position: "left",
                  style: { ...axisStyle, fontWeight: 500 },
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter dataKey="pricePerSqft" fillOpacity={0.6}>
                {yearData.map((_entry, index) => {
                  const listing = listings[index];
                  const color = theme.palette.warning.main;
                  return (
                    <Cell
                      key={`cell-year-${index}`}
                      fill={color}
                      r={highlightedListingId === listing.id ? 6 : 4}
                      style={{
                        filter:
                          highlightedListingId === listing.id
                            ? `drop-shadow(0 0 6px ${color})`
                            : "none",
                        transition: "all 0.2s ease",
                      }}
                    />
                  );
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid>
    </Grid>
  );
}
