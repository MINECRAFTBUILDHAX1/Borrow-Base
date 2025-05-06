
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MapLocationPickerProps {
  onLocationSelect: (location: { address: string; lat: number; lng: number }) => void;
  defaultLocation?: { lat: number; lng: number };
}

const MapLocationPicker = ({ onLocationSelect, defaultLocation = { lat: 40.7128, lng: -74.006 } }: MapLocationPickerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(defaultLocation);
  const { toast } = useToast();

  const handleManualLocationSubmit = () => {
    if (!locationInput) {
      toast({
        title: "Error",
        description: "Please enter a city or neighborhood",
        variant: "destructive"
      });
      return;
    }

    // In a real app, you would geocode this address
    // For now, we'll just pass it through with default coordinates
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

  const getCurrentLocation = () => {
    setIsLoading(true);
    setUseCurrentLocation(true);

    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCurrentPosition({ lat, lng });
        
        // In a real app, you would reverse geocode these coordinates
        // For now, we'll just use them directly
        onLocationSelect({
          address: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`,
          lat,
          lng
        });
        
        toast({
          title: "Location set",
          description: "Using your current location"
        });
        setIsLoading(false);
      },
      (error) => {
        console.error("Error getting location", error);
        toast({
          title: "Error",
          description: "Could not get your location. Please enter it manually.",
          variant: "destructive"
        });
        setIsLoading(false);
        setUseCurrentLocation(false);
      }
    );
  };

  return (
    <div className="w-full h-full p-4 border rounded-lg">
      <div className="mb-4">
        <h3 className="font-medium mb-2">Set Your Location</h3>
        <p className="text-sm text-gray-500 mb-4">
          Enter your city or neighborhood, or use your current location
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
              />
              <Button onClick={handleManualLocationSubmit}>
                Set Location
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">OR</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full flex gap-2"
            onClick={getCurrentLocation}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4" />
            )}
            Use Current Location
          </Button>
        </div>
      </div>

      {useCurrentLocation && (
        <div className="mt-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm">
            <strong>Using your current location:</strong><br />
            Latitude: {currentPosition.lat.toFixed(6)}<br />
            Longitude: {currentPosition.lng.toFixed(6)}
          </p>
        </div>
      )}
    </div>
  );
};

export default MapLocationPicker;
