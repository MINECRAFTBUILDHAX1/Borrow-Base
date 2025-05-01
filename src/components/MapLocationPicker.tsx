
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface MapLocationPickerProps {
  onLocationSelect: (location: { address: string; lat: number; lng: number }) => void;
  defaultLocation?: { lat: number; lng: number };
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const GOOGLE_MAPS_API_KEY = "AIzaSyCM6Ux_KougBeEYkxVQCArnIzA9cdgjYII";

const MapLocationPicker = ({ onLocationSelect, defaultLocation = { lat: 40.7128, lng: -74.006 } }: MapLocationPickerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [selectedPosition, setSelectedPosition] = useState(defaultLocation);
  const [address, setAddress] = useState("");

  // Load the Google Maps script
  useEffect(() => {
    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    // Define the callback function for when the script loads
    window.initMap = initMap;

    // Create the script element and append it to the document
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // Cleanup
    return () => {
      window.initMap = () => {};
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Initialize the map
  function initMap() {
    if (!mapRef.current) return;
    
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: 12,
      disableDefaultUI: true,
      zoomControl: true,
    });

    const markerInstance = new window.google.maps.Marker({
      position: defaultLocation,
      map: mapInstance,
      draggable: true,
    });

    setMap(mapInstance);
    setMarker(markerInstance);
    setIsLoading(false);

    // Get address for initial position
    geocodePosition(defaultLocation);

    // Add click event listener to the map
    mapInstance.addListener("click", (e: google.maps.MapMouseEvent) => {
      const newPosition = {
        lat: e.latLng!.lat(),
        lng: e.latLng!.lng(),
      };
      markerInstance.setPosition(newPosition);
      setSelectedPosition(newPosition);
      geocodePosition(newPosition);
    });

    // Add dragend event listener to the marker
    markerInstance.addListener("dragend", () => {
      const newPosition = {
        lat: markerInstance.getPosition()!.lat(),
        lng: markerInstance.getPosition()!.lng(),
      };
      setSelectedPosition(newPosition);
      geocodePosition(newPosition);
    });
  }

  // Geocode the position to get the address
  const geocodePosition = (position: { lat: number; lng: number }) => {
    if (!window.google) return;
    
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: position }, (results: google.maps.GeocoderResult[], status: google.maps.GeocoderStatus) => {
      if (status === "OK" && results[0]) {
        setAddress(results[0].formatted_address);
      } else {
        setAddress("Address not found");
      }
    });
  };

  const confirmLocation = () => {
    onLocationSelect({
      address,
      ...selectedPosition
    });
  };
  
  return (
    <div className="w-full h-full">
      {isLoading ? (
        <div className="w-full h-full flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
        </div>
      ) : (
        <div className="relative w-full h-full">
          <div 
            ref={mapRef} 
            className="w-full h-full rounded-md"
          />
          
          {address && (
            <div className="absolute bottom-3 left-0 right-0 mx-auto p-2 bg-white rounded-md shadow-md max-w-sm">
              <p className="font-medium text-sm">{address}</p>
              <p className="text-xs text-gray-500">
                Lat: {selectedPosition.lat.toFixed(6)}, Lng: {selectedPosition.lng.toFixed(6)}
              </p>
              <Button 
                size="sm" 
                className="mt-2 w-full"
                onClick={confirmLocation}
              >
                Confirm This Location
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapLocationPicker;
