import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { GOOGLE_MAPS_API_KEY } from "@/config/api-keys";

interface MapLocationPickerProps {
  onLocationSelect: (location: { address: string; lat: number; lng: number }) => void;
  defaultLocation?: { lat: number; lng: number };
}

const MapLocationPicker = ({ onLocationSelect, defaultLocation = { lat: 40.7128, lng: -74.006 } }: MapLocationPickerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [currentPosition, setCurrentPosition] = useState(defaultLocation);
  const { toast } = useToast();
  const autocompleteInputRef = useRef<HTMLInputElement>(null);
  const autoCompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Load Google Maps API script
  useEffect(() => {
    // Skip if the API is already loaded
    if (window.google?.maps?.places) return;

    const scriptExists = document.getElementById("google-maps-script");
    if (scriptExists) return;

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => console.log("Google Maps API loaded");
    document.head.appendChild(script);

    return () => {
      // Cleanup if component unmounts before script loads
      const script = document.getElementById("google-maps-script");
      if (script) document.head.removeChild(script);
    };
  }, []);

  // Initialize autocomplete when Google API is loaded
  useEffect(() => {
    if (!window.google?.maps?.places || !autocompleteInputRef.current) return;

    try {
      autoCompleteRef.current = new window.google.maps.places.Autocomplete(
        autocompleteInputRef.current,
        { types: ["geocode"] }
      );

      autoCompleteRef.current.addListener("place_changed", () => {
        if (!autoCompleteRef.current) return;

        const place = autoCompleteRef.current.getPlace();

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
        const address = place.formatted_address || locationInput;

        setCurrentPosition({ lat, lng });
        onLocationSelect({ address, lat, lng });

        toast({
          title: "Location set",
          description: `Location set to ${address}`
        });
      });
    } catch (error) {
      console.error("Error initializing Google Places Autocomplete:", error);
    }
  }, [onLocationSelect, toast, locationInput]);

  const handleManualLocationSubmit = () => {
    if (!locationInput) {
      toast({
        title: "Error",
        description: "Please enter your city or neighborhood",
        variant: "destructive"
      });
      return;
    }

    onLocationSelect({
      address: locationInput,
      lat: currentPosition.lat,
      lng: currentPosition.lng
    });

    toast({
      title: "Location set",
      description: `Location set to ${locationInput}`
    });
  };

  return (
    <div className="w-full h-full p-4 border rounded-lg">
      <div className="mb-4">
        <h3 className="font-medium mb-2">Set Your Location</h3>
        <p className="text-sm text-gray-500 mb-4">
          Enter your city or neighborhood
        </p>

        <div className="space-y-4">
          <div>
            <Label htmlFor="location">City or Neighborhood</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="location"
                placeholder="e.g. London, Camden"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="flex-1"
                ref={autocompleteInputRef}
              />
              <Button onClick={handleManualLocationSubmit}>
                Set Location
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLocationPicker;
