
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import LocationInput from "@/components/LocationInput";
import { useToast } from "@/hooks/use-toast";

interface MapLocationPickerProps {
  onLocationSelect: (location: { address: string; lat: number; lng: number }) => void;
  defaultLocation?: { lat: number; lng: number };
}

const MapLocationPicker = ({ 
  onLocationSelect, 
  defaultLocation = { lat: 40.7128, lng: -74.006 } 
}: MapLocationPickerProps) => {
  const [locationInput, setLocationInput] = useState("");
  const [currentPosition, setCurrentPosition] = useState(defaultLocation);
  const { toast } = useToast();
  
  const handleLocationChange = (address: string, details?: { lat: number; lng: number }) => {
    setLocationInput(address);
    
    if (details) {
      setCurrentPosition({ lat: details.lat, lng: details.lng });
      onLocationSelect({ address, lat: details.lat, lng: details.lng });
      
      toast({
        title: "Location set",
        description: `Location set to ${address}`
      });
    }
  };

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
              <LocationInput
                value={locationInput}
                onChange={handleLocationChange}
                placeholder="e.g. London, Camden"
                className="flex-1"
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
