import { Typography, Box } from "@mui/material";
import type { SubjectProperty } from "../types/listing";

interface SubjectSummaryProps {
  subjectProperty: SubjectProperty;
  compCount: number;
}

export default function SubjectSummary({
  subjectProperty,
  compCount,
}: SubjectSummaryProps) {
  return (
    <Box>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: 600,
          mb: 2,
          fontSize: "1.1rem",
        }}
      >
        Subject Property
      </Typography>
      <Typography variant="body1" gutterBottom>
        {subjectProperty.address}
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {subjectProperty.beds} bed · {subjectProperty.baths} bath ·{" "}
        {subjectProperty.sqft.toLocaleString()} sqft · Built{" "}
        {subjectProperty.yearBuilt}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
        {compCount} comps found
      </Typography>
    </Box>
  );
}
