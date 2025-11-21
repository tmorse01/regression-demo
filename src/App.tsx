import { useState, useEffect, useMemo } from "react";
import {
  Container,
  Grid,
  Box,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import { LoadScript } from "@react-google-maps/api";
import SubjectPropertyForm from "./components/SubjectPropertyForm";
import SubjectSummary from "./components/SubjectSummary";
import MapVisualization from "./components/MapVisualization";
import ControlsPanel from "./components/ControlsPanel";
import SummaryBar from "./components/SummaryBar";
import ChartsGrid from "./components/ChartsGrid";
import ListingsTable from "./components/ListingsTable";
import ExportButton from "./components/ExportButton";
import Loader from "./components/Loader";
import type { Listing, SubjectProperty, Filters } from "./types/listing";
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
  const [allListings, setAllListings] = useState<Listing[]>([]);
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  useEffect(() => {
    const listings = generateListings(150, subjectProperty);
    setAllListings(listings);
  }, [subjectProperty.lat, subjectProperty.lng]);

  const filteredListings = useMemo(() => {
    return allListings.filter((listing) => {
      if (filters.priceMin !== null && listing.price < filters.priceMin) {
        return false;
      }
      if (filters.priceMax !== null && listing.price > filters.priceMax) {
        return false;
      }
      if (filters.sqftMin !== null && listing.sqft < filters.sqftMin) {
        return false;
      }
      if (filters.sqftMax !== null && listing.sqft > filters.sqftMax) {
        return false;
      }
      if (filters.minBeds !== null && listing.beds < filters.minBeds) {
        return false;
      }
      if (filters.minBaths !== null && listing.baths < filters.minBaths) {
        return false;
      }
      if (
        filters.yearBuiltMin !== null &&
        listing.yearBuilt < filters.yearBuiltMin
      ) {
        return false;
      }
      if (
        filters.yearBuiltMax !== null &&
        listing.yearBuilt > filters.yearBuiltMax
      ) {
        return false;
      }
      if (
        filters.maxDistance !== null &&
        listing.distanceFromSubject > filters.maxDistance
      ) {
        return false;
      }
      return true;
    });
  }, [allListings, filters]);

  const handleResetFilters = () => {
    setFilters(defaultFilters);
  };

  const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = [
    "places",
  ];

  return (
    <Box sx={{ flexGrow: 1, minHeight: "100vh", backgroundColor: "#f8fafc" }}>
      {mapsApiKey ? (
        <LoadScript
          googleMapsApiKey={mapsApiKey}
          libraries={libraries}
          loadingElement={<Loader />}
        >
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
              <ExportButton
                listings={filteredListings}
                subjectProperty={subjectProperty}
              />
            </Toolbar>
          </AppBar>

          <Container maxWidth="xl">
            <SubjectPropertyForm
              subjectProperty={subjectProperty}
              onSubjectPropertyChange={setSubjectProperty}
              apiKey={placesApiKey}
            />

            <SubjectSummary
              subjectProperty={subjectProperty}
              compCount={filteredListings.length}
            />

            <MapVisualization
              subjectProperty={subjectProperty}
              listings={filteredListings}
              apiKey={mapsApiKey}
            />

            <SummaryBar listings={filteredListings} />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 3 }}>
                <ControlsPanel
                  filters={filters}
                  onFiltersChange={setFilters}
                  onReset={handleResetFilters}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 9 }}>
                <ChartsGrid listings={filteredListings} />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
              <ListingsTable listings={filteredListings} />
            </Box>
          </Container>
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
