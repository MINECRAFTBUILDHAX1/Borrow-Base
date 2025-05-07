
import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

// Add the Google Maps types
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement,
            options?: { types?: string[] }
          ) => {
            addListener: (event: string, callback: () => void) => void;
            getPlace: () => {
              formatted_address?: string;
              geometry?: {
                location: {
                  lat: () => number;
                  lng: () => number;
                };
              };
            };
          };
        };
      };
    };
  }
}

interface LocationInputProps {
  onLocationSelected?: (location: { address: string; lat: number; lng: number }) => void;
  placeholder?: string;
  value?: string;
  onChange?: (address: string, details?: { lat: number; lng: number }) => void;
  className?: string;
}

const LocationInput = ({ 
  onLocationSelected,
  placeholder = "Enter your location",
  value,
  onChange,
  className = ""
}: LocationInputProps) => {
  const [location, setLocation] = useState(value || "");
  const [locationDetails, setLocationDetails] = useState<{
    address: string;
    lat: number;
    lng: number;
  } | null>(null);

  const locationInputRef = useRef<HTMLInputElement>(null);

  // Update internal state when value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setLocation(value);
    }
  }, [value]);

  useEffect(() => {
    // Check if Google Maps script is already loaded
    const googleMapsLoaded = typeof window.google !== "undefined" && 
                             typeof window.google.maps !== "undefined" && 
                             typeof window.google.maps.places !== "undefined";
    
    if (googleMapsLoaded && locationInputRef.current) {
      initializeAutocomplete();
    } else {
      // Load Google Maps script if not already loaded
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCM6Ux_KougBeEYkxVQCArnIzA9cdgjYII&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeAutocomplete;
      document.body.appendChild(script);
    }
  }, []);

  const initializeAutocomplete = () => {
    if (!locationInputRef.current) return;
    
    const autocomplete = new window.google.maps.places.Autocomplete(
      locationInputRef.current,
      { types: ["geocode"] }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const address = place.formatted_address || "";
      
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const details = { address, lat, lng };
        
        setLocation(address);
        setLocationDetails(details);
        
        if (onLocationSelected) {
          onLocationSelected(details);
        }

        if (onChange) {
          onChange(address, { lat, lng });
        }
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocation(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-2">
      <Input
        ref={locationInputRef}
        type="text"
        placeholder={placeholder}
        value={location}
        onChange={handleInputChange}
        className={`w-full ${className}`}
      />

      {locationDetails && (
        <div className="text-sm text-muted-foreground">
          📍 {locationDetails.address}
        </div>
      )}
    </div>
  );
};

export default LocationInput;
