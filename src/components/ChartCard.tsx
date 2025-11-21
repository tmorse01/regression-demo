import { Paper, Typography, Box, useTheme } from "@mui/material";
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
  const theme = useTheme();

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        transition: "box-shadow 0.3s ease-in-out",
        "&:hover": {
          elevation: 4,
          boxShadow: theme.shadows[6],
        },
      }}
    >
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          flexShrink: 0,
          fontWeight: 600,
          color: theme.palette.text.primary,
          mb: 2,
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          width: "100%",
          height: height,
          flexShrink: 0,
          "& .recharts-wrapper": {
            fontFamily: theme.typography.fontFamily,
          },
        }}
      >
        {children}
      </Box>
    </Paper>
  );
}
