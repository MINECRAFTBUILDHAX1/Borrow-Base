
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: google.maps.places.AutocompleteOptions
          ) => google.maps.places.Autocomplete;
          AutocompleteService: new () => google.maps.places.AutocompleteService;
        };
        Geocoder: new () => google.maps.Geocoder;
      };
    };
  }
}

declare namespace google.maps {
  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  class Geocoder {
    geocode(
      request: {
        location?: { lat: number; lng: number };
        address?: string;
      },
      callback: (
        results: GeocoderResult[],
        status: GeocoderStatus
      ) => void
    ): void;
  }

  type GeocoderStatus = 'OK' | 'ZERO_RESULTS' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'INVALID_REQUEST' | 'UNKNOWN_ERROR';

  interface GeocoderResult {
    address_components: {
      long_name: string;
      short_name: string;
      types: string[];
    }[];
    formatted_address: string;
    geometry: {
      location: LatLng;
      location_type: string;
      viewport: {
        south: number;
        west: number;
        north: number;
        east: number;
      };
    };
    place_id: string;
    types: string[];
  }

  namespace places {
    interface AutocompleteOptions {
      bounds?: { east: number; north: number; south: number; west: number };
      componentRestrictions?: { country: string | string[] };
      fields?: string[];
      strictBounds?: boolean;
      types?: string[];
    }

    class Autocomplete {
      addListener(eventName: string, handler: () => void): void;
      getPlace(): PlaceResult;
    }

    class AutocompleteService {
      getPlacePredictions(
        request: {
          input: string;
          componentRestrictions?: { country: string | string[] };
          types?: string[];
        },
        callback: (
          predictions: AutocompletePrediction[],
          status: PlacesServiceStatus
        ) => void
      ): void;
    }

    interface AutocompletePrediction {
      description: string;
      matched_substrings: Array<{
        length: number;
        offset: number;
      }>;
      place_id: string;
      structured_formatting: {
        main_text: string;
        main_text_matched_substrings: Array<{
          length: number;
          offset: number;
        }>;
        secondary_text: string;
      };
      terms: Array<{
        offset: number;
        value: string;
      }>;
      types: string[];
    }

    interface PlaceResult {
      address_components?: {
        long_name: string;
        short_name: string;
        types: string[];
      }[];
      formatted_address?: string;
      geometry?: {
        location: LatLng;
        viewport?: {
          south: number;
          west: number;
          north: number;
          east: number;
        };
      };
      name?: string;
      place_id?: string;
      types?: string[];
    }

    type PlacesServiceStatus = 'OK' | 'ZERO_RESULTS' | 'OVER_QUERY_LIMIT' | 'REQUEST_DENIED' | 'INVALID_REQUEST' | 'UNKNOWN_ERROR';
  }
}

export {};
