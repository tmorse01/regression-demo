import { Box, CircularProgress, Fade } from "@mui/material";

interface TransitionIndicatorProps {
  isPending: boolean;
}

/**
 * Subtle loading indicator that appears during transitions
 * Uses React 19 useTransition for smooth appearance
 */
export default function TransitionIndicator({
  isPending,
}: TransitionIndicatorProps) {
  return (
    <Fade in={isPending} timeout={200}>
      <Box
        sx={{
          position: "fixed",
          top: 80,
          right: 24,
          zIndex: 1300,
          display: isPending ? "flex" : "none",
          alignItems: "center",
          gap: 1,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: 2,
          px: 2,
          py: 1,
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(0, 0, 0, 0.05)",
        }}
      >
        <CircularProgress size={16} thickness={4} />
        <Box
          component="span"
          sx={{
            fontSize: "0.75rem",
            color: "text.secondary",
            fontWeight: 500,
          }}
        >
          Updating...
        </Box>
      </Box>
    </Fade>
  );
}
