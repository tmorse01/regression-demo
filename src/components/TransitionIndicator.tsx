import { Box, CircularProgress, Fade } from "@mui/material";
import { glassCardSx } from "../theme/glassSurfaces";

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
        sx={(theme) => ({
          ...glassCardSx(theme),
          position: "fixed",
          top: 80,
          right: 24,
          zIndex: 1300,
          display: isPending ? "flex" : "none",
          alignItems: "center",
          gap: 1,
          borderRadius: 2,
          px: 2,
          py: 1,
        })}
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
