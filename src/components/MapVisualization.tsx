import { useState, useCallback } from "react";
import { Paper, Typography, Box } from "@mui/material";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import type { Listing, SubjectProperty } from "../types/listing";

interface MapVisualizationProps {
  subjectProperty: SubjectProperty;
  listings: Listing[];
  apiKey: string;
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

export default function MapVisualization({
  subjectProperty,
  listings,
  apiKey,
}: MapVisualizationProps) {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [_map, setMap] = useState<google.maps.Map | null>(null);

  const center = {
    lat: subjectProperty.lat,
    lng: subjectProperty.lng,
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!apiKey) {
    return (
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Map Visualization
        </Typography>
        <Box
          sx={{
            height: 400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f5f5f5",
          }}
        >
          <Typography color="textSecondary">
            Google Maps API key not configured
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Map Visualization
      </Typography>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        <Marker
          position={center}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#ff5722",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          }}
          title="Subject Property"
        />

        {listings.map((listing) => (
          <Marker
            key={listing.id}
            position={{ lat: listing.lat, lng: listing.lng }}
            onClick={() => setSelectedListing(listing)}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 6,
              fillColor: "#3b82f6",
              fillOpacity: 0.8,
              strokeColor: "#ffffff",
              strokeWeight: 1,
            }}
          />
        ))}

        {selectedListing && (
          <InfoWindow
            position={{
              lat: selectedListing.lat,
              lng: selectedListing.lng,
            }}
            onCloseClick={() => setSelectedListing(null)}
          >
            <div style={{ padding: "4px" }}>
              <div style={{ fontWeight: "bold", marginBottom: "4px" }}>
                ${selectedListing.price.toLocaleString()}
              </div>
              <div>{selectedListing.sqft.toLocaleString()} sqft</div>
              <div>
                ${(selectedListing.price / selectedListing.sqft).toFixed(2)}
                /sqft
              </div>
              <div>
                {selectedListing.beds} bed · {selectedListing.baths} bath
              </div>
              <div>Built {selectedListing.yearBuilt}</div>
              <div>
                {selectedListing.distanceFromSubject.toFixed(2)} miles away
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </Paper>
  );
}
