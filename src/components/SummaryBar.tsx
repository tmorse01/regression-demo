import { Card, CardContent, Typography, Grid, Box } from "@mui/material";
import type { Listing } from "../types/listing";
import {
  medianPrice,
  medianPricePerSqft,
  averageDistance,
} from "../utils/stats";

interface SummaryBarProps {
  listings: Listing[];
}

export default function SummaryBar({ listings }: SummaryBarProps) {
  const count = listings.length;
  const median = medianPrice(listings);
  const medianPerSqft = medianPricePerSqft(listings);
  const avgDistance = averageDistance(listings);

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom variant="body2">
              Active Comps
            </Typography>
            <Typography variant="h4" component="div">
              {count}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom variant="body2">
              Median Price
            </Typography>
            <Typography variant="h4" component="div">
              ${median.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom variant="body2">
              Median Price/Sqft
            </Typography>
            <Typography variant="h4" component="div">
              ${medianPerSqft.toFixed(2)}
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card>
          <CardContent>
            <Typography color="textSecondary" gutterBottom variant="body2">
              Avg Distance
            </Typography>
            <Typography variant="h4" component="div">
              {avgDistance.toFixed(2)} mi
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
