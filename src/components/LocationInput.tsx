
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GOOGLE_MAPS_API_KEY } from "@/config/api-keys";

interface LocationInputProps {
  value: string;
  onChange: (location: string, details?: { lat: number; lng: number }) => void;
  placeholder?: string;
  className?: string;
}

const LocationInput = ({ value, onChange, placeholder = "Enter location", className = "" }: LocationInputProps) => {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  
  // Load Google Maps API script
  useEffect(() => {
    if (window.google?.maps?.places) {
      initAutocomplete();
      return;
    }

    const scriptExists = document.getElementById("google-maps-script");
    if (scriptExists) return;

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      console.log("Google Maps API loaded");
      initAutocomplete();
    };

    document.head.appendChild(script);

    return () => {
      const script = document.getElementById("google-maps-script");
      if (script) document.head.removeChild(script);
    };
  }, []);

  const initAutocomplete = () => {
    if (!window.google?.maps?.places || !inputRef.current) return;
    
    try {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        { types: ["geocode"] }
      );
      
      autocompleteRef.current.addListener("place_changed", () => {
        if (!autocompleteRef.current) return;
        
        const place = autocompleteRef.current.getPlace();
        
        if (!place.geometry || !place.geometry.location) {
          toast({
            title: "Error",
            description: "Please select a location from the dropdown",
            variant: "destructive"
          });
          return;
        }
        
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || value;
        
        onChange(address, { lat, lng });
      });
    } catch (error) {
      console.error("Error initializing Google Places Autocomplete:", error);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
      <Input
        ref={inputRef}
        type="text"
        className="pl-10"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default LocationInput;
