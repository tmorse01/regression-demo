import { Box, Typography, Button, Paper } from "@mui/material";
import { SearchOff, Refresh } from "@mui/icons-material";

interface EmptyStateProps {
  onResetFilters: () => void;
}

export default function EmptyState({ onResetFilters }: EmptyStateProps) {
  return (
    <Paper
      sx={{
        p: 6,
        textAlign: "center",
        borderRadius: 3,
        background:
          "linear-gradient(135deg, rgba(248, 250, 252, 0.8) 0%, rgba(241, 245, 249, 0.8) 100%)",
        border: "1px solid rgba(0, 0, 0, 0.05)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 1,
          }}
        >
          <SearchOff
            sx={{
              fontSize: 48,
              color: "primary.main",
              opacity: 0.6,
            }}
          />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
          No properties match these filters
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: "text.secondary",
            maxWidth: 500,
            mb: 3,
          }}
        >
          Try widening your price or square footage range, or adjust other
          filters to see more results.
        </Typography>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={onResetFilters}
          sx={{
            px: 3,
            py: 1,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Reset Filters
        </Button>
      </Box>
    </Paper>
  );
}
