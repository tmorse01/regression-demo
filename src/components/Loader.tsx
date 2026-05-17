import { Box, Typography, useMediaQuery } from "@mui/material";
import { keyframes } from "@mui/system";
import { useTheme } from "@mui/material/styles";
import { useLoadingProgress } from "../hooks/useLoadingProgress";
import {
  PRODUCT_NAME,
  PRODUCT_TAGLINE,
  BRAND_LOADER_BAR_GRADIENT_LIGHT,
  BRAND_LOADER_BAR_GRADIENT_DARK,
} from "../brand";
import { glassCardSx } from "../theme/glassSurfaces";

export type LoaderVariant = "fullscreen" | "embedded";

export interface LoaderProps {
  variant?: LoaderVariant;
}

const logoFloat = keyframes`
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-6px) scale(1.03);
  }
`;

const shimmerSweep = keyframes`
  0% {
    transform: translateX(-120%);
  }
  100% {
    transform: translateX(220%);
  }
`;

const indeterminateSlide = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(350%);
  }
`;

const reducedMotionBarPulse = keyframes`
  0%, 100% {
    opacity: 0.45;
  }
  50% {
    opacity: 1;
  }
`;

function BrandGradientBar({
  mode,
  determinate,
  value,
  motionOk,
}: {
  mode: "light" | "dark";
  determinate: boolean;
  value: number;
  motionOk: boolean;
}) {
  const gradient =
    mode === "dark"
      ? BRAND_LOADER_BAR_GRADIENT_DARK
      : BRAND_LOADER_BAR_GRADIENT_LIGHT;

  const trackBg =
    mode === "dark" ? "rgba(148, 163, 184, 0.22)" : "rgba(15, 23, 42, 0.08)";

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: 9,
        borderRadius: 999,
        overflow: "hidden",
        backgroundColor: trackBg,
        boxShadow:
          mode === "dark"
            ? "inset 0 1px 2px rgba(0,0,0,0.35)"
            : "inset 0 1px 2px rgba(0,0,0,0.06)",
      }}
    >
      {determinate ? (
        <Box
          sx={{
            width: `${Math.min(100, Math.max(0, value))}%`,
            height: "100%",
            borderRadius: 999,
            position: "relative",
            overflow: "hidden",
            transition: motionOk ? "width 0.2s ease-out" : undefined,
            background: gradient,
            boxShadow:
              "0 0 12px rgba(59, 130, 246, 0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
        >
          {motionOk && (
            <Box
              aria-hidden
              sx={{
                position: "absolute",
                inset: 0,
                overflow: "hidden",
                borderRadius: 999,
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "55%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 45%, transparent 90%)",
                  animation: `${shimmerSweep} 1.6s ease-in-out infinite`,
                },
              }}
            />
          )}
        </Box>
      ) : (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            overflow: "hidden",
            borderRadius: 999,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: "29%",
              height: "100%",
              width: "42%",
              borderRadius: 999,
              background: gradient,
              boxShadow:
                "0 0 14px rgba(59, 130, 246, 0.45), inset 0 1px 0 rgba(255,255,255,0.15)",
              animation: motionOk
                ? `${indeterminateSlide} 1.35s ease-in-out infinite`
                : `${reducedMotionBarPulse} 1.4s ease-in-out infinite`,
            }}
          />
        </Box>
      )}
    </Box>
  );
}

function LoaderChrome({
  variant,
  progress,
}: {
  variant: LoaderVariant;
  progress?: number;
}) {
  const theme = useTheme();
  const motionOk = !useMediaQuery("(prefers-reduced-motion: reduce)", {
    defaultMatches: false,
  });
  const mode = theme.palette.mode;
  const isFullscreen = variant === "fullscreen";
  const determinate = isFullscreen && progress !== undefined;

  const logoSize = isFullscreen ? 100 : 72;
  const barMaxWidth = isFullscreen ? 320 : 280;

  const logoAnimation = motionOk
    ? `${logoFloat} 2.8s ease-in-out infinite`
    : undefined;

  const stack = (
    <>
      <Box
        component="img"
        src="/favicon.svg"
        alt=""
        aria-hidden
        sx={{
          width: logoSize,
          height: logoSize,
          mb: isFullscreen ? 3 : 2,
          animation: logoAnimation,
          filter:
            mode === "dark"
              ? "drop-shadow(0 6px 14px rgba(0,0,0,0.45))"
              : "drop-shadow(0 6px 14px rgba(15,23,42,0.12))",
        }}
      />

      <Typography
        variant={isFullscreen ? "h6" : "subtitle1"}
        sx={{
          color: "primary.main",
          fontWeight: 600,
          letterSpacing: "-0.02em",
          mb: 0.75,
          textAlign: "center",
        }}
      >
        Loading {PRODUCT_NAME}
      </Typography>

      {isFullscreen && (
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            textAlign: "center",
            maxWidth: 320,
            mb: 3,
            px: 1,
            lineHeight: 1.45,
          }}
        >
          {PRODUCT_TAGLINE}
        </Typography>
      )}

      {!isFullscreen && (
        <Typography
          variant="caption"
          sx={{
            color: "text.secondary",
            mb: 2,
            textAlign: "center",
          }}
        >
          Preparing workspace…
        </Typography>
      )}

      <Box
        sx={{ width: "100%", maxWidth: barMaxWidth, px: isFullscreen ? 0 : 1 }}
      >
        <BrandGradientBar
          mode={mode}
          determinate={!!determinate}
          value={determinate ? progress! : 0}
          motionOk={motionOk}
        />
      </Box>
    </>
  );

  if (isFullscreen) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {stack}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        py: 3,
      }}
    >
      {stack}
    </Box>
  );
}

function LoaderFullscreen() {
  const theme = useTheme();
  const progress = useLoadingProgress({ duration: 1000, updateInterval: 50 });

  return (
    <Box
      role="status"
      aria-live="polite"
      aria-busy
      aria-label={`Loading ${PRODUCT_NAME}`}
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
        zIndex: 9999,
        backgroundColor: theme.palette.background.default,
        backgroundImage:
          theme.palette.mode === "dark"
            ? "radial-gradient(ellipse 85% 65% at 50% 42%, rgba(59, 130, 246, 0.14) 0%, transparent 55%)"
            : "radial-gradient(ellipse 85% 65% at 50% 42%, rgba(59, 130, 246, 0.1) 0%, transparent 58%)",
      }}
    >
      <Box
        sx={(t) => ({
          ...glassCardSx(t),
          borderRadius: 3,
          maxWidth: 400,
          width: "min(92vw, 400px)",
          px: { xs: 3, sm: 4 },
          py: { xs: 3.5, sm: 4 },
        })}
      >
        <LoaderChrome variant="fullscreen" progress={progress} />
      </Box>
    </Box>
  );
}

function LoaderEmbedded() {
  return (
    <Box
      role="status"
      aria-live="polite"
      aria-busy
      aria-label={`Loading ${PRODUCT_NAME}`}
      sx={{
        position: "relative",
        width: "100%",
        minHeight: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LoaderChrome variant="embedded" />
    </Box>
  );
}

export default function Loader({ variant = "fullscreen" }: LoaderProps) {
  return variant === "fullscreen" ? <LoaderFullscreen /> : <LoaderEmbedded />;
}
