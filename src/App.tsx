import {
  useState,
  useMemo,
  useTransition,
  Suspense,
  useDeferredValue,
  useEffect,
  lazy,
} from "react";
import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Paper,
  ThemeProvider,
  CssBaseline,
  Snackbar,
  Alert,
} from "@mui/material";
import { LoadScriptNext } from "@react-google-maps/api";
import SubjectPropertyForm from "./components/SubjectPropertyForm";
import SubjectSummary from "./components/SubjectSummary";
import MapVisualization from "./components/MapVisualization";
import ControlsPanel from "./components/ControlsPanel";
import KPITiles from "./components/KPITiles";
import ExportButton from "./components/ExportButton";
import ImportButton from "./components/ImportButton";
import MockDataControl from "./components/MockDataControl";
import Loader from "./components/Loader";
import FilterPresets from "./components/FilterPresets";
import WorkspaceHeader from "./components/WorkspaceHeader";
import type { ViewMode, ThemeMode } from "./components/WorkspaceHeader";
import InsightCallout from "./components/InsightCallout";
import EmptyState from "./components/EmptyState";
import TimelineScrubber from "./components/TimelineScrubber";
import TransitionIndicator from "./components/TransitionIndicator";
import { useDebouncedFilters } from "./hooks/useDebouncedFilters";
import type { SubjectProperty, Filters, Listing } from "./types/listing";
import {
  generateListings,
  getDefaultSubjectProperty,
  recomputeListingDistances,
  type GenerateListingsOptions,
} from "./data/listings";
import type { ImportParseResult } from "./utils/importListings";
import { PRODUCT_NAME, PRODUCT_PAGE_TITLE } from "./brand";
import { createAppTheme } from "./theme/appTheme";
import { glassCardSx } from "./theme/glassSurfaces";
import { LISTINGS_VIZ_CAP } from "./constants/listingsViz";
import { sampleListingsForViz } from "./utils/sampleListingsForViz";

const ChartsGrid = lazy(() => import("./components/ChartsGrid"));
const ListingsTable = lazy(() => import("./components/ListingsTable"));

const mapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
const placesApiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY || mapsApiKey;
const defaultFilters: Filters = {
  priceMin: null,
  priceMax: null,
  sqftMin: null,
  sqftMax: null,
  minBeds: null,
  minBaths: null,
  yearBuiltMin: null,
  yearBuiltMax: null,
  maxDistance: null,
};

/** Stable identity for @react-google-maps/api; must not be recreated each render. */
const MAP_LIBRARIES = ["places"] as ("places" | "drawing" | "geometry" | "visualization")[];

type ListingsSource = "synthetic" | "imported";

function App() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [subjectProperty, setSubjectProperty] = useState<SubjectProperty>(
    getDefaultSubjectProperty()
  );
  const [actualFilters, setActualFilters] = useState<Filters>(defaultFilters);
  const [viewMode, setViewMode] = useState<ViewMode>("overview");
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [highlightedListingId, setHighlightedListingId] = useState<
    string | null
  >(null);
  const [actualDateRange, setActualDateRange] = useState<[number, number]>([
    2020, 2024,
  ]);
  const [isChartPending, startChartTransition] = useTransition();

  const [listingsSource, setListingsSource] =
    useState<ListingsSource>("synthetic");
  const [importedListings, setImportedListings] = useState<Listing[] | null>(
    null
  );
  const [syntheticCount, setSyntheticCount] = useState(150);
  const [syntheticOptions, setSyntheticOptions] =
    useState<GenerateListingsOptions>({});

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }>({ open: false, message: "", severity: "info" });

  const muiPaletteMode = themeMode === "dark" ? "dark" : "light";
  const theme = useMemo(
    () => createAppTheme(muiPaletteMode),
    [muiPaletteMode]
  );

  // Simulate initial data generation with a delay
  useEffect(() => {
    const simulateDataGeneration = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2700));
      await new Promise((resolve) => setTimeout(resolve, 300));
      setIsInitialLoading(false);
    };

    simulateDataGeneration();
  }, []);

  useEffect(() => {
    document.title = PRODUCT_PAGE_TITLE;
  }, []);

  const {
    filters,
    updateFilters,
    isPending: isFiltersPending,
  } = useDebouncedFilters(actualFilters, {
    debounceMs: 150,
    onFiltersChange: setActualFilters,
  });

  const handleDateRangeChange = (range: [number, number]) => {
    setActualDateRange(range);
  };

  const importedWithDistance = useMemo(() => {
    if (listingsSource !== "imported" || !importedListings?.length) {
      return null;
    }
    return recomputeListingDistances(importedListings, subjectProperty);
  }, [listingsSource, importedListings, subjectProperty]);

  const allListings = useMemo(() => {
    if (listingsSource === "imported" && importedWithDistance) {
      return importedWithDistance;
    }
    return generateListings(syntheticCount, subjectProperty, syntheticOptions);
  }, [
    listingsSource,
    importedWithDistance,
    syntheticCount,
    subjectProperty,
    syntheticOptions,
  ]);

  const handleImportComplete = (
    result: ImportParseResult,
    filename: string
  ) => {
    if (!result.listings.length) {
      setSnackbar({
        open: true,
        message: result.errors.join(" ") || "Import failed",
        severity: "error",
      });
      return;
    }

    setListingsSource("imported");
    setImportedListings(result.listings);

    const years = result.listings.map((l) => l.listingDate);
    if (years.length) {
      setActualDateRange([Math.min(...years), Math.max(...years)]);
    }

    let message = `Imported ${result.listings.length} listing(s) from ${filename}.`;
    if (result.warnings.length) {
      message += ` ${result.warnings.length} warning(s) — check the console or re-export for details.`;
    }
    if (result.errors.length) {
      message += ` ${result.errors.join(" ")}`;
    }

    if (result.warnings.length && !result.errors.length) {
      console.warn("Import warnings:", result.warnings);
    }

    setSnackbar({
      open: true,
      message,
      severity:
        result.warnings.length || result.errors.length ? "warning" : "success",
    });
  };

  const handleMockApply = ({
    count,
    options,
  }: {
    count: number;
    options: GenerateListingsOptions;
  }) => {
    setListingsSource("synthetic");
    setImportedListings(null);
    setSyntheticCount(count);
    setSyntheticOptions(options);
    setSnackbar({
      open: true,
      message: `Generated ${count} synthetic comparables.`,
      severity: "success",
    });
  };

  const deferredFilters = useDeferredValue(filters);
  const deferredDateRange = useDeferredValue(actualDateRange);
  const isDeferredPending =
    filters !== deferredFilters || actualDateRange !== deferredDateRange;

  const filteredListings = useMemo(() => {
    const filtered = allListings.filter((listing) => {
      const listingDate = listing.listingDate || listing.yearBuilt;
      if (
        listingDate < deferredDateRange[0] ||
        listingDate > deferredDateRange[1]
      ) {
        return false;
      }

      if (
        deferredFilters.priceMin !== null &&
        listing.price < deferredFilters.priceMin
      ) {
        return false;
      }
      if (
        deferredFilters.priceMax !== null &&
        listing.price > deferredFilters.priceMax
      ) {
        return false;
      }
      if (
        deferredFilters.sqftMin !== null &&
        listing.sqft < deferredFilters.sqftMin
      ) {
        return false;
      }
      if (
        deferredFilters.sqftMax !== null &&
        listing.sqft > deferredFilters.sqftMax
      ) {
        return false;
      }
      if (
        deferredFilters.minBeds !== null &&
        listing.beds < deferredFilters.minBeds
      ) {
        return false;
      }
      if (
        deferredFilters.minBaths !== null &&
        listing.baths < deferredFilters.minBaths
      ) {
        return false;
      }
      if (
        deferredFilters.yearBuiltMin !== null &&
        listing.yearBuilt < deferredFilters.yearBuiltMin
      ) {
        return false;
      }
      if (
        deferredFilters.yearBuiltMax !== null &&
        listing.yearBuilt > deferredFilters.yearBuiltMax
      ) {
        return false;
      }
      if (
        deferredFilters.maxDistance !== null &&
        listing.distanceFromSubject > deferredFilters.maxDistance
      ) {
        return false;
      }
      return true;
    });
    return filtered;
  }, [allListings, deferredFilters, deferredDateRange]);

  const vizListings = useMemo(
    () => sampleListingsForViz(filteredListings, LISTINGS_VIZ_CAP),
    [filteredListings]
  );
  const isVizDownsampled = filteredListings.length > LISTINGS_VIZ_CAP;

  const handleResetFilters = () => {
    startChartTransition(() => {
      setActualFilters(defaultFilters);
      updateFilters(defaultFilters);
      setActivePreset(null);
    });
  };

  const handlePresetSelect = (
    presetId: string | null,
    presetFilters: Filters
  ) => {
    startChartTransition(() => {
      setActualFilters(presetFilters);
      updateFilters(presetFilters);
      setActivePreset(presetId);
    });
  };

  const showEmptyState = filteredListings.length === 0;
  const isAnyPending = isFiltersPending || isChartPending || isDeferredPending;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {isInitialLoading ? (
        <Loader />
      ) : (
        <Box
          sx={{
            flexGrow: 1,
            minHeight: "100vh",
            bgcolor: "background.default",
            transition: "background-color 0.3s ease",
          }}
        >
          <TransitionIndicator isPending={isAnyPending} />
          {mapsApiKey ? (
            <LoadScriptNext
              googleMapsApiKey={mapsApiKey}
              libraries={MAP_LIBRARIES}
              loadingElement={<Loader />}
            >
              <>
              <AppBar position="static" sx={{ mb: 0 }}>
                <Toolbar sx={{ py: 1.5, px: { xs: 2, sm: 3 } }}>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{
                      flexGrow: 1,
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                      color: "common.white",
                    }}
                  >
                    {PRODUCT_NAME}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      flexShrink: 0,
                    }}
                  >
                    <ImportButton onImportComplete={handleImportComplete} />
                    <MockDataControl
                      initialCount={syntheticCount}
                      initialOptions={syntheticOptions}
                      onApply={handleMockApply}
                    />
                    <ExportButton
                      listings={filteredListings}
                      subjectProperty={subjectProperty}
                    />
                  </Box>
                </Toolbar>
              </AppBar>

              <Box
                sx={{
                  display: "flex",
                  minHeight: "calc(100vh - 64px)",
                  bgcolor: "background.default",
                }}
              >
                <Box
                  sx={{
                    width: { xs: "100%", md: "320px" },
                    flexShrink: 0,
                    bgcolor: (t) =>
                      t.palette.mode === "dark" ? "#1e293b" : "#e2e8f0",
                    borderRight: "1px solid",
                    borderColor: "divider",
                    p: 2,
                    overflowY: "auto",
                    position: { xs: "relative", md: "sticky" },
                    top: 0,
                    height: { xs: "auto", md: "100vh" },
                  }}
                >
                  <SubjectPropertyForm
                    subjectProperty={subjectProperty}
                    onSubjectPropertyChange={setSubjectProperty}
                    apiKey={placesApiKey}
                  />
                  <Box sx={{ mt: 2 }}>
                    <ControlsPanel
                      filters={filters}
                      onFiltersChange={updateFilters}
                      onReset={handleResetFilters}
                    />
                  </Box>
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    overflowY: "auto",
                    p: 3,
                    bgcolor: "background.default",
                  }}
                >
                  <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
                    <FilterPresets
                      activePreset={activePreset}
                      onPresetSelect={handlePresetSelect}
                      onReset={handleResetFilters}
                    />

                    <Paper
                      sx={(t) => ({
                        p: 2.5,
                        mb: 3,
                        borderRadius: 3,
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        ...glassCardSx(t),
                      })}
                    >
                      <SubjectSummary
                        subjectProperty={subjectProperty}
                        compCount={filteredListings.length}
                      />
                    </Paper>

                    {!showEmptyState && <KPITiles listings={filteredListings} />}

                    <WorkspaceHeader
                      viewMode={viewMode}
                      themeMode={themeMode}
                      onViewModeChange={setViewMode}
                      onThemeModeChange={setThemeMode}
                    />

                    {!showEmptyState && isVizDownsampled && (
                      <Alert severity="info" sx={{ mb: 2 }}>
                        Showing {vizListings.length} of{" "}
                        {filteredListings.length} comparables on the map and
                        scatter charts for performance. KPIs, the regression
                        line, and histograms still reflect all{" "}
                        {filteredListings.length} rows. Narrow filters or the
                        year range to focus the workspace.
                      </Alert>
                    )}

                    {!showEmptyState && (
                      <TimelineScrubber
                        listings={filteredListings}
                        initialDateRange={actualDateRange}
                        onDateRangeChange={handleDateRangeChange}
                      />
                    )}

                    {showEmptyState ? (
                      <EmptyState onResetFilters={handleResetFilters} />
                    ) : (
                      <>
                        <InsightCallout
                          listings={filteredListings}
                          subjectProperty={subjectProperty}
                        />

                        {viewMode === "table" ? (
                          <Box sx={{ mt: 3 }}>
                            <Suspense fallback={<Loader variant="embedded" />}>
                              <ListingsTable
                                listings={filteredListings}
                                highlightedListingId={highlightedListingId}
                                onListingHover={setHighlightedListingId}
                              />
                            </Suspense>
                          </Box>
                        ) : (
                          <Box sx={{ mt: 3 }}>
                            <Suspense fallback={<Loader variant="embedded" />}>
                              <ChartsGrid
                                listings={filteredListings}
                                scatterListings={vizListings}
                                subjectProperty={subjectProperty}
                                highlightedListingId={highlightedListingId}
                                onListingHover={setHighlightedListingId}
                              />
                            </Suspense>
                            {viewMode === "overview" && (
                              <Box sx={{ mt: 3 }}>
                                <Suspense fallback={<Loader variant="embedded" />}>
                                  <ListingsTable
                                    listings={filteredListings}
                                    highlightedListingId={highlightedListingId}
                                    onListingHover={setHighlightedListingId}
                                  />
                                </Suspense>
                              </Box>
                            )}
                          </Box>
                        )}

                        {viewMode !== "table" && (
                          <Box sx={{ mt: 3 }}>
                            <MapVisualization
                              subjectProperty={subjectProperty}
                              listings={vizListings}
                              apiKey={mapsApiKey}
                            />
                          </Box>
                        )}
                      </>
                    )}
                  </Container>
                </Box>
              </Box>
              </>
            </LoadScriptNext>
          ) : (
            <>
              <AppBar position="static" sx={{ mb: 4 }}>
                <Toolbar sx={{ py: 1.5, px: { xs: 2, sm: 3 } }}>
                  <Typography
                    variant="h5"
                    component="div"
                    sx={{
                      flexGrow: 1,
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                      color: "common.white",
                    }}
                  >
                    {PRODUCT_NAME}
                  </Typography>
                </Toolbar>
              </AppBar>
              <Container maxWidth="xl">
                <Typography color="error" sx={{ p: 2 }}>
                  Please configure VITE_GOOGLE_MAPS_API_KEY in your .env file.
                  Optionally, set VITE_GOOGLE_PLACES_API_KEY for a separate
                  Places API key.
                </Typography>
              </Container>
            </>
          )}
        </Box>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={8000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
