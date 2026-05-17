import { Paper, Typography, Box, useTheme } from "@mui/material";
import type { ReactNode } from "react";
import { glassCardSx } from "../theme/glassSurfaces";

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
      elevation={0}
      sx={{
        ...glassCardSx(theme),
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background:
            theme.palette.mode === "dark"
              ? "linear-gradient(90deg, transparent, rgba(226,232,240,0.35), transparent)"
              : "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)",
        },
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 10px 15px -3px rgba(0, 0, 0, 0.35), 0 4px 6px -2px rgba(0, 0, 0, 0.28)"
              : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
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
