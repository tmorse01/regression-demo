import {
  useState,
  useMemo,
  useTransition,
  Suspense,
  useDeferredValue,
} from "react";
import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Paper,
} from "@mui/material";
import { LoadScript } from "@react-google-maps/api";
import SubjectPropertyForm from "./components/SubjectPropertyForm";
import SubjectSummary from "./components/SubjectSummary";
import MapVisualization from "./components/MapVisualization";
import ControlsPanel from "./components/ControlsPanel";
import KPITiles from "./components/KPITiles";
import ChartsGrid from "./components/ChartsGrid";
import ListingsTable from "./components/ListingsTable";
import ExportButton from "./components/ExportButton";
import Loader from "./components/Loader";
import FilterPresets from "./components/FilterPresets";
import WorkspaceHeader from "./components/WorkspaceHeader";
import type { ViewMode, ThemeMode } from "./components/WorkspaceHeader";
import InsightCallout from "./components/InsightCallout";
import EmptyState from "./components/EmptyState";
import TimelineScrubber from "./components/TimelineScrubber";
import TransitionIndicator from "./components/TransitionIndicator";
import { useDebouncedFilters } from "./hooks/useDebouncedFilters";
import type { SubjectProperty, Filters } from "./types/listing";
import { generateListings, getDefaultSubjectProperty } from "./data/listings";

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

function App() {
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

  // Debounced filters with optimistic updates
  const {
    filters,
    updateFilters,
    isPending: isFiltersPending,
  } = useDebouncedFilters(actualFilters, {
    debounceMs: 150, // Reduced debounce for faster feel
    onFiltersChange: setActualFilters,
  });

  // Date range is managed locally in TimelineScrubber component
  // Only update parent state via debounced callback from the component
  const handleDateRangeChange = (range: [number, number]) => {
    setActualDateRange(range);
  };

  const allListings = useMemo(() => {
    return generateListings(150, subjectProperty);
  }, [subjectProperty]);

  // Defer heavy filtering computation - this allows inputs to feel instant
  // while the expensive filtering happens in the background
  const deferredFilters = useDeferredValue(filters);
  const deferredDateRange = useDeferredValue(actualDateRange);
  const isDeferredPending =
    filters !== deferredFilters || actualDateRange !== deferredDateRange;

  // Heavy computation - only runs when deferred values change
  // This is automatically low-priority thanks to useDeferredValue
  const filteredListings = useMemo(() => {
    const filtered = allListings.filter((listing) => {
      // Date range filter
      const listingDate = listing.listingDate || listing.yearBuilt;
      if (
        listingDate < deferredDateRange[0] ||
        listingDate > deferredDateRange[1]
      ) {
        return false;
      }

      // Other filters
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

  const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = [
    "places",
  ];

  const showEmptyState = filteredListings.length === 0;
  const isAnyPending = isFiltersPending || isChartPending || isDeferredPending;

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: "100vh",
        backgroundColor: themeMode === "dark" ? "#0f172a" : "#f1f5f9",
        transition: "background-color 0.3s ease",
      }}
    >
      <TransitionIndicator isPending={isAnyPending} />
      {mapsApiKey ? (
        <LoadScript
          googleMapsApiKey={mapsApiKey}
          libraries={libraries}
          loadingElement={<Loader />}
        >
          <AppBar position="static" sx={{ mb: 0 }}>
            <Toolbar sx={{ py: 1.5, px: { xs: 2, sm: 3 } }}>
              <Typography
                variant="h5"
                component="div"
                sx={{
                  flexGrow: 1,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                }}
              >
                Construction Lender Regression Analysis
              </Typography>
              <ExportButton
                listings={filteredListings}
                subjectProperty={subjectProperty}
              />
            </Toolbar>
          </AppBar>

          <Box
            sx={{
              display: "flex",
              minHeight: "calc(100vh - 64px)",
              backgroundColor: themeMode === "dark" ? "#0f172a" : "#f1f5f9",
            }}
          >
            {/* Left Filter Rail */}
            <Box
              sx={{
                width: { xs: "100%", md: "320px" },
                flexShrink: 0,
                backgroundColor: themeMode === "dark" ? "#1e293b" : "#e2e8f0",
                borderRight: "1px solid",
                borderColor: "divider",
                p: 2,
                overflowY: "auto",
                position: { xs: "relative", md: "sticky" },
                top: 0,
                height: { xs: "auto", md: "calc(100vh - 64px)" },
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

            {/* Right Analysis Workspace */}
            <Box
              sx={{
                flex: 1,
                overflowY: "auto",
                p: 3,
                backgroundColor: themeMode === "dark" ? "#0f172a" : "#f1f5f9",
              }}
            >
              <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3 } }}>
                {/* Filter Presets */}
                <FilterPresets
                  activePreset={activePreset}
                  onPresetSelect={handlePresetSelect}
                  onReset={handleResetFilters}
                />

                {/* Subject Summary Card */}
                <Paper
                  sx={{
                    p: 2.5,
                    mb: 3,
                    borderRadius: 3,
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(0, 0, 0, 0.05)",
                    boxShadow:
                      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <SubjectSummary
                    subjectProperty={subjectProperty}
                    compCount={filteredListings.length}
                  />
                </Paper>

                {/* KPI Tiles */}
                {!showEmptyState && <KPITiles listings={filteredListings} />}

                {/* Workspace Header */}
                <WorkspaceHeader
                  viewMode={viewMode}
                  themeMode={themeMode}
                  onViewModeChange={setViewMode}
                  onThemeModeChange={setThemeMode}
                />

                {/* Timeline Scrubber */}
                {!showEmptyState && (
                  <TimelineScrubber
                    listings={filteredListings}
                    initialDateRange={actualDateRange}
                    onDateRangeChange={handleDateRangeChange}
                  />
                )}

                {/* Empty State */}
                {showEmptyState ? (
                  <EmptyState onResetFilters={handleResetFilters} />
                ) : (
                  <>
                    {/* Insight Callout */}
                    <InsightCallout
                      listings={filteredListings}
                      subjectProperty={subjectProperty}
                    />

                    {/* Charts or Table based on view mode */}
                    {viewMode === "table" ? (
                      <Box sx={{ mt: 3 }}>
                        <Suspense fallback={<Loader />}>
                          <ListingsTable
                            listings={filteredListings}
                            highlightedListingId={highlightedListingId}
                            onListingHover={setHighlightedListingId}
                          />
                        </Suspense>
                      </Box>
                    ) : (
                      <Box sx={{ mt: 3 }}>
                        <Suspense fallback={<Loader />}>
                          <ChartsGrid
                            listings={filteredListings}
                            subjectProperty={subjectProperty}
                            highlightedListingId={highlightedListingId}
                            onListingHover={setHighlightedListingId}
                          />
                        </Suspense>
                        {viewMode === "overview" && (
                          <Box sx={{ mt: 3 }}>
                            <Suspense fallback={<Loader />}>
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

                    {/* Map Visualization */}
                    {viewMode !== "table" && (
                      <Box sx={{ mt: 3 }}>
                        <MapVisualization
                          subjectProperty={subjectProperty}
                          listings={filteredListings}
                          apiKey={mapsApiKey}
                        />
                      </Box>
                    )}
                  </>
                )}
              </Container>
            </Box>
          </Box>
        </LoadScript>
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
                }}
              >
                Construction Lender Regression Analysis
              </Typography>
            </Toolbar>
          </AppBar>
          <Container maxWidth="xl">
            <Typography color="error" sx={{ p: 2 }}>
              Please configure VITE_GOOGLE_MAPS_API_KEY in your .env file.
              Optionally, set VITE_GOOGLE_PLACES_API_KEY for a separate Places
              API key.
            </Typography>
          </Container>
        </>
      )}
    </Box>
  );
}

export default App;
