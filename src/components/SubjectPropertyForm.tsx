import { useState, useRef, useEffect } from "react";
import {
  Paper,
  TextField,
  Grid,
  Typography,
  Box,
  InputAdornment,
  Alert,
  CircularProgress,
  Autocomplete as MuiAutocomplete,
} from "@mui/material";
import type { SubjectProperty } from "../types/listing";
import { reverseGeocode } from "../utils/geocoding";
import {
  getPlacePredictions,
  getPlaceDetails,
  type PlacePrediction,
} from "../utils/placesApi";

interface SubjectPropertyFormProps {
  subjectProperty: SubjectProperty;
  onSubjectPropertyChange: (property: SubjectProperty) => void;
  apiKey: string;
}

export default function SubjectPropertyForm({
  subjectProperty,
  onSubjectPropertyChange,
  apiKey,
}: SubjectPropertyFormProps) {
  const [addressInput, setAddressInput] = useState(subjectProperty.address);
  const [manualLat, setManualLat] = useState(subjectProperty.lat.toString());
  const [manualLng, setManualLng] = useState(subjectProperty.lng.toString());
  const [useManualCoords, setUseManualCoords] = useState(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<
    PlacePrediction[]
  >([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setAddressInput(subjectProperty.address);
    setManualLat(subjectProperty.lat.toString());
    setManualLng(subjectProperty.lng.toString());
  }, [subjectProperty]);

  const handleAddressInputChange = async (value: string) => {
    setAddressInput(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!value || value.length < 3) {
      setAutocompleteSuggestions([]);
      return;
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        setApiError(null);
        const predictions = await getPlacePredictions(value, apiKey);
        setAutocompleteSuggestions(predictions);
      } catch (error: unknown) {
        console.error("Autocomplete error:", error);
        setAutocompleteSuggestions([]);

        // Show helpful error message if API is disabled
        if (error && typeof error === "object" && "apiDisabled" in error) {
          setApiError(
            "Places API (New) is not enabled. Please enable it in Google Cloud Console."
          );
        } else if (
          error &&
          typeof error === "object" &&
          "status" in error &&
          error.status === 403
        ) {
          setApiError(
            "Access denied. Please check that Places API (New) is enabled and your API key has the correct permissions."
          );
        }
      }
    }, 300);
  };

  const handlePlaceSelect = async (value: string | PlacePrediction | null) => {
    if (!value) return;

    const selectedPrediction =
      typeof value === "string"
        ? autocompleteSuggestions.find((p) => p.description === value)
        : value;

    if (!selectedPrediction) {
      setGeocodingError("Place not found");
      return;
    }

    setAddressInput(selectedPrediction.description);
    setAutocompleteSuggestions([]);
    setIsGeocoding(true);
    setGeocodingError(null);

    try {
      const details = await getPlaceDetails(
        selectedPrediction.place_id,
        apiKey
      );
      if (details) {
        const lat = details.geometry.location.lat;
        const lng = details.geometry.location.lng;
        onSubjectPropertyChange({
          ...subjectProperty,
          lat,
          lng,
          address: details.formatted_address,
        });
        setManualLat(lat.toString());
        setManualLng(lng.toString());
      } else {
        setGeocodingError("Failed to get place details");
      }
    } catch {
      setGeocodingError("Failed to get place details");
    }

    setIsGeocoding(false);
  };

  const handleManualCoordsChange = async () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (isNaN(lat) || isNaN(lng)) {
      setGeocodingError("Invalid coordinates");
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setGeocodingError("Coordinates out of range");
      return;
    }

    setIsGeocoding(true);
    setGeocodingError(null);

    try {
      const address = await reverseGeocode(lat, lng, apiKey);
      onSubjectPropertyChange({
        ...subjectProperty,
        lat,
        lng,
        address: address || `${lat}, ${lng}`,
      });
      if (address) {
        setAddressInput(address);
      }
    } catch {
      setGeocodingError("Failed to reverse geocode coordinates");
      onSubjectPropertyChange({
        ...subjectProperty,
        lat,
        lng,
        address: `${lat}, ${lng}`,
      });
    }

    setIsGeocoding(false);
  };

  const handlePropertyDetailChange = (
    field: keyof SubjectProperty,
    value: number
  ) => {
    onSubjectPropertyChange({
      ...subjectProperty,
      [field]: value,
    });
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Subject Property
      </Typography>

      {geocodingError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {geocodingError}
        </Alert>
      )}

      {apiError && (
        <Alert
          severity="warning"
          sx={{ mb: 2 }}
          action={
            <a
              href="https://console.cloud.google.com/apis/library/places.googleapis.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "inherit", textDecoration: "underline" }}
            >
              Enable API
            </a>
          }
        >
          <Typography variant="body2" component="div">
            {apiError}
            <br />
            <strong>Troubleshooting steps:</strong>
            <ol style={{ margin: "8px 0", paddingLeft: "20px" }}>
              <li>
                Go to{" "}
                <a
                  href="https://console.cloud.google.com/apis/library/places.googleapis.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Cloud Console
                </a>
              </li>
              <li>Select your project (ID: 577517809736)</li>
              <li>Click "Enable" for Places API (New)</li>
              <li>Wait a few minutes for changes to propagate</li>
              <li>
                Ensure your API key has Places API (New) enabled in API
                restrictions
              </li>
            </ol>
          </Typography>
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Box sx={{ mb: 2, position: "relative" }}>
            <MuiAutocomplete
              freeSolo
              options={autocompleteSuggestions}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.description
              }
              inputValue={addressInput}
              onInputChange={(_, newValue) => {
                handleAddressInputChange(newValue);
              }}
              onChange={(_, newValue) => {
                handlePlaceSelect(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  label="Property Address"
                  placeholder="Search for an address..."
                  disabled={useManualCoords || isGeocoding}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: isGeocoding ? (
                      <InputAdornment position="end">
                        <CircularProgress size={20} />
                      </InputAdornment>
                    ) : (
                      params.InputProps.endAdornment
                    ),
                  }}
                />
              )}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            <TextField
              label="Latitude"
              type="number"
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
              onBlur={handleManualCoordsChange}
              size="small"
              sx={{ flex: 1 }}
              disabled={!useManualCoords}
            />
            <TextField
              label="Longitude"
              type="number"
              value={manualLng}
              onChange={(e) => setManualLng(e.target.value)}
              onBlur={handleManualCoordsChange}
              size="small"
              sx={{ flex: 1 }}
              disabled={!useManualCoords}
            />
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={useManualCoords}
                onChange={(e) => setUseManualCoords(e.target.checked)}
                id="manual-coords"
              />
              <label htmlFor="manual-coords" style={{ marginLeft: 8 }}>
                Manual
              </label>
            </Box>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            label="Square Feet"
            type="number"
            value={subjectProperty.sqft}
            onChange={(e) =>
              handlePropertyDetailChange("sqft", parseInt(e.target.value) || 0)
            }
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            label="Bedrooms"
            type="number"
            value={subjectProperty.beds}
            onChange={(e) =>
              handlePropertyDetailChange("beds", parseInt(e.target.value) || 0)
            }
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            label="Bathrooms"
            type="number"
            value={subjectProperty.baths}
            onChange={(e) =>
              handlePropertyDetailChange(
                "baths",
                parseFloat(e.target.value) || 0
              )
            }
            inputProps={{ step: 0.5 }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            label="Year Built"
            type="number"
            value={subjectProperty.yearBuilt}
            onChange={(e) =>
              handlePropertyDetailChange(
                "yearBuilt",
                parseInt(e.target.value) || 0
              )
            }
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
