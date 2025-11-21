import { useMemo } from "react";
import { Alert, Typography } from "@mui/material";
import { Lightbulb } from "@mui/icons-material";
import type { Listing, SubjectProperty } from "../types/listing";
import { computeLinearRegression } from "../utils/regression";
import { medianPricePerSqft } from "../utils/stats";

interface InsightCalloutProps {
  listings: Listing[];
  subjectProperty: SubjectProperty;
}

export default function InsightCallout({
  listings,
  subjectProperty,
}: InsightCalloutProps) {
  const insight = useMemo(() => {
    if (listings.length < 2) {
      return null;
    }

    const regression = computeLinearRegression(
      listings.map((l) => ({ sqft: l.sqft, price: l.price }))
    );

    if (!regression) {
      return null;
    }

    // Calculate slope (price per sqft from regression)
    const [point1, point2] = regression;
    const slope = (point2.price - point1.price) / (point2.sqft - point1.sqft);
    const pricePer100Sqft = slope * 100;

    // Analyze bedroom distribution
    const bedCounts = listings.reduce((acc, l) => {
      acc[l.beds] = (acc[l.beds] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    const dominantBeds = Object.entries(bedCounts).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0];

    // Analyze year built
    const medianYear = listings.map((l) => l.yearBuilt).sort((a, b) => a - b)[
      Math.floor(listings.length / 2)
    ];

    const medianPricePerSqftValue = medianPricePerSqft(listings);

    const insights: string[] = [];

    if (pricePer100Sqft > 0) {
      insights.push(
        `Each additional 100 sqft adds about $${Math.round(
          pricePer100Sqft
        ).toLocaleString()} on average.`
      );
    }

    if (dominantBeds) {
      insights.push(
        `Your dataset is dominated by ${dominantBeds}-bed homes${
          medianYear > 1995 ? ` built after ${medianYear - 5}` : ""
        }.`
      );
    }

    if (medianPricePerSqftValue > 0) {
      const subjectPricePerSqft =
        subjectProperty.sqft > 0
          ? medianPricePerSqftValue * subjectProperty.sqft
          : 0;
      if (subjectPricePerSqft > 0) {
        insights.push(
          `Based on median price/sqft of $${medianPricePerSqftValue.toFixed(
            2
          )}, your subject property's estimated value is approximately $${Math.round(
            subjectPricePerSqft
          ).toLocaleString()}.`
        );
      }
    }

    return insights.length > 0 ? insights[0] : null;
  }, [listings, subjectProperty]);

  if (!insight) {
    return null;
  }

  return (
    <Alert
      icon={<Lightbulb sx={{ fontSize: 20 }} />}
      severity="info"
      sx={{
        mb: 2,
        borderRadius: 2,
        background:
          "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)",
        border: "1px solid rgba(59, 130, 246, 0.2)",
        "& .MuiAlert-icon": {
          color: "primary.main",
        },
        "& .MuiAlert-message": {
          width: "100%",
        },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          color: "text.primary",
          lineHeight: 1.6,
        }}
      >
        {insight}
      </Typography>
    </Alert>
  );
}
