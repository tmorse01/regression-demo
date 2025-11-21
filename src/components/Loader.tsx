import { Box, Typography } from "@mui/material";
import { keyframes } from "@mui/system";
import { useTheme } from "@mui/material/styles";

// Define keyframe animations
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
    opacity: 0.8;
  }
`;

const barWave = keyframes`
  0%, 100% {
    transform: scaleY(0.3);
    opacity: 0.6;
  }
  50% {
    transform: scaleY(1);
    opacity: 1;
  }
`;

const dotBounce = keyframes`
  0%, 80%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  40% {
    transform: translateY(-10px);
    opacity: 1;
  }
`;

export default function Loader() {
  const theme = useTheme();

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
        backgroundColor: "#f8fafc",
        zIndex: 9999,
      }}
    >
      {/* Animated Logo/Icon */}
      <Box
        sx={{
          position: "relative",
          width: 120,
          height: 120,
          mb: 4,
        }}
      >
        {/* Outer rotating ring */}
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            border: "3px solid",
            borderColor: `${theme.palette.secondary.main}20`,
            borderTopColor: theme.palette.secondary.main,
            borderRadius: "50%",
            animation: `${spin} 1s linear infinite`,
          }}
        />

        {/* Inner pulsing circle */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            animation: `${pulse} 1.5s ease-in-out infinite`,
          }}
        />
      </Box>

      {/* Animated bars (data visualization style) */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          gap: 1,
          mb: 3,
          height: 40,
        }}
      >
        {[0, 1, 2, 3, 4].map((index) => (
          <Box
            key={index}
            sx={{
              width: 8,
              height: "100%",
              backgroundColor: theme.palette.secondary.main,
              borderRadius: "4px 4px 0 0",
              animation: `${barWave} 1.2s ease-in-out infinite`,
              animationDelay: `${index * 0.1}s`,
            }}
          />
        ))}
      </Box>

      {/* Loading text */}
      <Typography
        variant="h6"
        sx={{
          color: theme.palette.primary.main,
          fontWeight: 500,
          letterSpacing: "0.05em",
          mb: 1,
        }}
      >
        Loading Analytics
      </Typography>

      {/* Animated dots */}
      <Box sx={{ display: "flex", gap: 0.5 }}>
        {[0, 1, 2].map((index) => (
          <Box
            key={index}
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: theme.palette.secondary.main,
              animation: `${dotBounce} 1.4s ease-in-out infinite`,
              animationDelay: `${index * 0.2}s`,
            }}
          />
        ))}
      </Box>
    </Box>
  );
}
