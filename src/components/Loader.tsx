import { Box, Typography, LinearProgress } from "@mui/material";
import { keyframes } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";

// Subtle pulse animation for logo
const pulse = keyframes`
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
`;

export default function Loader() {
  const theme = useTheme();
  const [progress, setProgress] = useState(0);

  // Fake progress bar animation - slower to show loader longer
  useEffect(() => {
    const startTime = Date.now();
    const duration = 3000; // Total duration to reach 100%

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressPercent = Math.min((elapsed / duration) * 100, 100);

      setProgress((oldProgress) => {
        // Smooth progression with slight randomization for natural feel
        const baseProgress = progressPercent;
        const randomOffset = (Math.random() - 0.5) * 2; // Small random variation
        const newProgress = Math.min(
          Math.max(baseProgress + randomOffset, oldProgress),
          100
        );

        return newProgress;
      });
    }, 50); // Update more frequently for smoother animation

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.background.default,
        zIndex: 9999,
      }}
    >
      {/* Logo */}
      <Box
        component="img"
        src="/favicon.svg"
        alt="Logo"
        sx={{
          width: 100,
          height: 100,
          mb: 4,
          animation: `${pulse} 2s ease-in-out infinite`,
        }}
      />

      {/* Loading text */}
      <Typography
        variant="h6"
        sx={{
          color: theme.palette.primary.main,
          fontWeight: 500,
          letterSpacing: "0.05em",
          mb: 3,
        }}
      >
        Loading Analytics
      </Typography>

      {/* Progress bar */}
      <Box sx={{ width: "100%", maxWidth: 320, px: 2 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 6,
            borderRadius: 3,
            backgroundColor: theme.palette.grey[200],
            "& .MuiLinearProgress-bar": {
              borderRadius: 3,
              background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            },
          }}
        />
      </Box>
    </Box>
  );
}
