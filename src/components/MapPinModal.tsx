import { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { GoogleMap, Marker } from "@react-google-maps/api";

interface MapPinModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (lat: number, lng: number) => void;
  initialLat: number;
  initialLng: number;
  apiKey: string;
}

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

export default function MapPinModal({
  open,
  onClose,
  onSubmit,
  initialLat,
  initialLng,
  apiKey,
}: MapPinModalProps) {
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  }>({
    lat: initialLat,
    lng: initialLng,
  });

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setMarkerPosition({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
    }
  }, []);

  const handleSubmit = () => {
    onSubmit(markerPosition.lat, markerPosition.lng);
    onClose();
  };

  const handleCancel = () => {
    // Reset marker position to initial values
    setMarkerPosition({
      lat: initialLat,
      lng: initialLng,
    });
    onClose();
  };

  // Update marker position when initial values change (when modal opens with new coordinates)
  useEffect(() => {
    if (open) {
      setMarkerPosition({
        lat: initialLat,
        lng: initialLng,
      });
    }
  }, [open, initialLat, initialLng]);

  if (!apiKey) {
    return (
      <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
        <DialogTitle>Select Location on Map</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              height: 500,
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
      <DialogTitle>Select Location on Map</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={{ lat: initialLat, lng: initialLng }}
            zoom={12}
            onClick={handleMapClick}
            options={{
              clickableIcons: false,
            }}
          >
            <Marker
              position={markerPosition}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#ff5722",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              }}
              title="Selected Location"
            />
          </GoogleMap>
        </Box>
        <Typography variant="body2" color="textSecondary" align="center">
          Latitude: {markerPosition.lat.toFixed(6)}, Longitude:{" "}
          {markerPosition.lng.toFixed(6)}
        </Typography>
        <Typography
          variant="caption"
          color="textSecondary"
          align="center"
          display="block"
          sx={{ mt: 1 }}
        >
          Click on the map to place a marker
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

