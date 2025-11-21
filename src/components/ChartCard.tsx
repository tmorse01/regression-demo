import { Paper, Typography, Box } from "@mui/material";
import type { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  children: ReactNode;
  height?: number;
}

export default function ChartCard({
  title,
  children,
  height = 300,
}: ChartCardProps) {
  return (
    <Paper
      sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Typography variant="h6" gutterBottom sx={{ flexShrink: 0 }}>
        {title}
      </Typography>
      <Box sx={{ width: "100%", height: height, flexShrink: 0 }}>
        {children}
      </Box>
    </Paper>
  );
}
