import { Grid } from "@mui/material";
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
} from "recharts";
import ChartCard from "./ChartCard";
import type { Listing } from "../types/listing";
import { computeLinearRegression } from "../utils/regression";

interface ChartsGridProps {
  listings: Listing[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number | string;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "white",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      >
        {payload.map((entry, index) => (
          <p key={index} style={{ margin: 0 }}>
            {entry.name}: {entry.value?.toLocaleString?.() || entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ChartsGrid({ listings }: ChartsGridProps) {
  const scatterData = listings.map((l) => ({
    sqft: l.sqft,
    price: l.price,
    beds: l.beds,
    baths: l.baths,
  }));

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

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <ChartCard title="Sqft vs Price (with Regression)" height={300}>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={scatterData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="sqft"
                name="Square Feet"
                label={{
                  value: "Square Feet",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                type="number"
                dataKey="price"
                name="Price"
                label={{
                  value: "Price ($)",
                  angle: -90,
                  position: "insideLeft",
                }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter dataKey="price" fill="#4caf50" />
              {regressionLine && (
                <Line
                  type="linear"
                  data={regressionLine}
                  dataKey="price"
                  stroke="#ff5722"
                  strokeWidth={2}
                  dot={false}
                  name="Regression Line"
                />
              )}
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid>

      <Grid item xs={12} md={6}>
        <ChartCard title="Distance vs Price/Sqft" height={300}>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={distanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="distance"
                name="Distance (miles)"
                label={{
                  value: "Distance (miles)",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                type="number"
                dataKey="pricePerSqft"
                name="Price/Sqft"
                label={{
                  value: "Price/Sqft ($)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter dataKey="pricePerSqft" fill="#2196f3" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid>

      <Grid item xs={12} md={6}>
        <ChartCard title="Price/Sqft Distribution" height={300}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={histogramData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="mid"
                label={{
                  value: "Price/Sqft ($)",
                  position: "insideBottom",
                  offset: -5,
                }}
                tickFormatter={(value) => `$${Math.round(value)}`}
              />
              <YAxis
                label={{ value: "Count", angle: -90, position: "insideLeft" }}
              />
              <Tooltip
                labelFormatter={(value) => `$${Math.round(value)}`}
                formatter={(value: number) => value}
              />
              <Bar dataKey="count" fill="#4caf50" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid>

      <Grid item xs={12} md={6}>
        <ChartCard title="Year Built vs Price/Sqft" height={300}>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={yearData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="year"
                name="Year Built"
                label={{
                  value: "Year Built",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                type="number"
                dataKey="pricePerSqft"
                name="Price/Sqft"
                label={{
                  value: "Price/Sqft ($)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Scatter dataKey="pricePerSqft" fill="#ff9800" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      </Grid>
    </Grid>
  );
}
