export interface PlacePrediction {
  description: string;
  place_id: string;
}

export interface PlaceDetails {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export async function getPlacePredictions(
  input: string,
  apiKey: string
): Promise<PlacePrediction[]> {
  if (!input || input.length < 3) {
    return [];
  }

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places:autocomplete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "suggestions.placePrediction.placeId,suggestions.placePrediction.text",
        },
        body: JSON.stringify({
          input: input,
          includedRegionCodes: ["us"],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Places API error: ${response.status}`;

      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        }
      } catch {
        // If parsing fails, use the raw error text
        if (errorText) {
          errorMessage = errorText;
        }
      }

      console.error("Places API error:", response.status, errorMessage);

      // Throw a more descriptive error
      const error = new Error(errorMessage) as Error & {
        status?: number;
        apiDisabled?: boolean;
      };
      error.status = response.status;
      error.apiDisabled =
        response.status === 403 &&
        (errorMessage.includes("not been used") ||
          errorMessage.includes("disabled"));
      throw error;
    }

    const data = await response.json();
    if (data.suggestions) {
      interface Suggestion {
        placePrediction?: {
          text?: { text?: string };
          structuredFormat?: { mainText?: { text?: string } };
          placeId?: string;
        };
      }

      return (data.suggestions as Suggestion[])
        .filter((suggestion) => suggestion.placePrediction)
        .map((suggestion) => ({
          description:
            suggestion.placePrediction?.text?.text ||
            suggestion.placePrediction?.structuredFormat?.mainText?.text ||
            "",
          place_id: suggestion.placePrediction?.placeId || "",
        }))
        .filter((p: PlacePrediction) => p.description && p.place_id);
    }
    return [];
  } catch (error) {
    // Re-throw if it's our custom error with status/apiDisabled
    if (error instanceof Error && "status" in error) {
      throw error;
    }
    console.error("Places API error:", error);
    return [];
  }
}

export async function getPlaceDetails(
  placeId: string,
  apiKey: string
): Promise<PlaceDetails | null> {
  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        method: "GET",
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "formattedAddress,location",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Places API error: ${response.status}`;

      try {
        const errorData = JSON.parse(errorText);
        if (errorData.error?.message) {
          errorMessage = errorData.error.message;
        }
      } catch {
        // If parsing fails, use the raw error text
        if (errorText) {
          errorMessage = errorText;
        }
      }

      console.error("Places API error:", response.status, errorMessage);

      // Throw a more descriptive error
      const error = new Error(errorMessage) as Error & {
        status?: number;
        apiDisabled?: boolean;
      };
      error.status = response.status;
      error.apiDisabled =
        response.status === 403 &&
        (errorMessage.includes("not been used") ||
          errorMessage.includes("disabled"));
      throw error;
    }

    const data = await response.json();
    if (data.location) {
      return {
        formatted_address: data.formattedAddress || "",
        geometry: {
          location: {
            lat: data.location.latitude || 0,
            lng: data.location.longitude || 0,
          },
        },
      };
    }
    return null;
  } catch (error) {
    // Re-throw if it's our custom error with status/apiDisabled
    if (error instanceof Error && "status" in error) {
      throw error;
    }
    console.error("Places API error:", error);
    return null;
  }
}
