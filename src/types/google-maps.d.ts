
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: google.maps.places.AutocompleteOptions
          ) => google.maps.places.Autocomplete;
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
  }
}

export {};
