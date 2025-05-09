import { useState, useEffect } from "react";
import { Search, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetFooter,
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
} from "@/components/ui/sheet";
import ListingCard, { ListingProps } from "@/components/ListingCard";
import CategoryFilter from "@/components/CategoryFilter";
import { supabase } from "@/integrations/supabase/client";
import { useLocation, useSearchParams } from "react-router-dom";
import { ListingTable } from "@/types/database";
import { useToast } from "@/hooks/use-toast";
import LocationInput from "@/components/LocationInput";
import { GOOGLE_MAPS_API_KEY } from "@/config/api-keys";

// Categories data
const categories = [
  { id: "tools", name: "Tools", icon: "🛠️" },
  { id: "electronics", name: "Electronics", icon: "📱" },
  { id: "outdoor", name: "Outdoor", icon: "🏕️" },
  { id: "furniture", name: "Furniture", icon: "🪑" },
  { id: "clothing", name: "Clothing", icon: "👕" },
  { id: "sports", name: "Sports", icon: "🏀" },
  { id: "books", name: "Books", icon: "📚" },
  { id: "kitchen", name: "Kitchen", icon: "🍳" },
  { id: "games", name: "Games", icon: "🎮" },
  { id: "music", name: "Music", icon: "🎸" },
];

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { toast } = useToast();
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get("search") || "");
  const [locationQuery, setLocationQuery] = useState<string>(searchParams.get("location") || "");
  const [priceMin, setPriceMin] = useState<number | undefined>(undefined);
  const [priceMax, setPriceMax] = useState<number | undefined>(undefined);
  const [listings, setListings] = useState<ListingProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(false);
  
  // Replace Google Maps initialization with LocationInput component  
  const handleLocationChange = (address: string, details?: { lat: number; lng: number }) => {
    setLocationQuery(address);
    if (details) {
      // Use the coordinates if needed
      console.log("Selected coordinates:", details);
      handleSearch();
    }
  };
  
  // Get search parameters from URL on initial load
  useEffect(() => {
    const category = searchParams.get("category");
    if (category) {
      setSelectedCategory(category);
    }
    
    const search = searchParams.get("search");
    if (search) {
      setSearchQuery(search);
    }
    
    const loc = searchParams.get("location");
    if (loc) {
      setLocationQuery(loc);
    }
    
    const min = searchParams.get("min");
    if (min) {
      setPriceMin(parseFloat(min));
    }
    
    const max = searchParams.get("max");
    if (max) {
      setPriceMax(parseFloat(max));
    }
    
    const sort = searchParams.get("sort");
    if (sort) {
      setSortBy(sort);
    }
  }, []);
  
  // Fetch listings from Supabase and apply filters
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      
      try {
        // Start building the query
        let query = supabase
          .from('listings')
          .select('*')
          .eq('status', 'active');
        
        // Apply category filter if selected
        if (selectedCategory) {
          query = query.eq('category', selectedCategory);
        }
        
        // Apply search filter if provided
        if (searchQuery) {
          query = query.ilike('title', `%${searchQuery}%`);
        }
        
        // Apply location filter if provided
        if (locationQuery) {
          query = query.ilike('location', `%${locationQuery}%`);
        }
        
        // Apply price range filters if provided
        if (priceMin !== undefined) {
          query = query.gte('price_per_day', priceMin);
        }
        
        if (priceMax !== undefined) {
          query = query.lte('price_per_day', priceMax);
        }
        
        // Execute the query
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Format listings to match the ListingProps type
          const formattedListings = data.map((listing: ListingTable) => ({
            id: listing.id,
            title: listing.title,
            price: listing.price_per_day || 0,
            priceUnit: "day" as "day" | "hour" | "week" | "month",
            imageUrl: listing.images && listing.images.length > 0 
              ? listing.images[0] 
              : "https://via.placeholder.com/300x200?text=No+Image",
            location: listing.location || "No location",
            category: listing.category || "Other",
            distance: 0 // Would be calculated in a real app
          }));
          
          // Sort the listings based on selected option
          const sortedListings = [...formattedListings].sort((a, b) => {
            switch(sortBy) {
              case "price-low":
                return a.price - b.price;
              case "price-high":
                return b.price - a.price;
              case "distance":
                return (a.distance || 999) - (b.distance || 999);
              case "rating":
                return b.rating - a.rating;
              default:
                return 0; // Default sorting (recommended)
            }
          });
          
          setListings(sortedListings);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchListings();
  }, [selectedCategory, searchQuery, locationQuery, priceMin, priceMax, sortBy]);
  
  const handleSelectCategory = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    
    // Update URL params
    if (categoryId) {
      searchParams.set("category", categoryId);
    } else {
      searchParams.delete("category");
    }
    setSearchParams(searchParams);
  };

  // Get current location for the search
  const getCurrentLocation = async () => {
    setLoadingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
      setLoadingLocation(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        try {
          // Use Google Maps Geocoding API to get address from coordinates
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
          );
          
          const data = await response.json();
          
          if (data.status === "OK" && data.results && data.results.length > 0) {
            // Find locality (city) and administrative_area_level_1 (state)
            let city = "";
            let state = "";
            
            for (const component of data.results[0].address_components) {
              if (component.types.includes("locality")) {
                city = component.long_name;
              }
              if (component.types.includes("administrative_area_level_1")) {
                state = component.long_name;
              }
            }
            
            const formattedAddress = city && state ? `${city}, ${state}` : data.results[0].formatted_address;
            setLocationQuery(formattedAddress);
            
            toast({
              title: "Location found",
              description: `Using your location: ${formattedAddress}`
            });
            
            // Trigger search with the new location
            handleSearch();
          } else {
            throw new Error("Could not determine address from coordinates");
          }
        } catch (error) {
          console.error("Error getting location name:", error);
          toast({
            title: "Location found",
            description: "Using your current location"
          });
          setLocationQuery("Your current location");
          handleSearch();
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        toast({
          title: "Error",
          description: "Could not get your location. Please enter it manually.",
          variant: "destructive"
        });
        setLoadingLocation(false);
      }
    );
  };

  const handleSearch = () => {
    // Update URL params
    if (searchQuery) {
      searchParams.set("search", searchQuery);
    } else {
      searchParams.delete("search");
    }
    
    if (locationQuery) {
      searchParams.set("location", locationQuery);
    } else {
      searchParams.delete("location");
    }
    
    setSearchParams(searchParams);
  };
  
  const applyFilters = (min?: number, max?: number) => {
    setPriceMin(min);
    setPriceMax(max);
    
    // Update URL params
    if (min) {
      searchParams.set("min", min.toString());
    } else {
      searchParams.delete("min");
    }
    
    if (max) {
      searchParams.set("max", max.toString());
    } else {
      searchParams.delete("max");
    }
    
    setSearchParams(searchParams);
  };
  
  const handleSortChange = (value: string) => {
    setSortBy(value);
    
    // Update URL params
    searchParams.set("sort", value);
    setSearchParams(searchParams);
  };
  
  return (
    <div>
      {/* Search Bar */}
      <div className="sticky top-16 z-10 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input 
                className="pl-10 h-12" 
                placeholder="Search for items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="relative flex-grow md:max-w-[240px]">
              <LocationInput 
                placeholder="Location"
                value={locationQuery}
                onChange={handleLocationChange}
              />
            </div>
            <Button onClick={handleSearch} className="h-12">
              Search
            </Button>
            <div className="flex-shrink-0">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="h-12 w-12">
                    <Filter className="h-5 w-5" />
                    <span className="sr-only">Filter</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Options</SheetTitle>
                    <SheetDescription>
                      Refine your search results
                    </SheetDescription>
                  </SheetHeader>
                  
                  <div className="py-6">
                    <h3 className="font-medium mb-2">Price Range</h3>
                    <div className="flex items-center gap-2">
                      <Input 
                        placeholder="Min" 
                        type="number" 
                        value={priceMin || ''}
                        onChange={(e) => setPriceMin(e.target.value ? Number(e.target.value) : undefined)}
                      />
                      <span>to</span>
                      <Input 
                        placeholder="Max" 
                        type="number"
                        value={priceMax || ''}
                        onChange={(e) => setPriceMax(e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </div>
                  </div>
                  
                  <SheetFooter>
                    <Button onClick={() => applyFilters(priceMin, priceMax)}>Apply Filters</Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
        
        <CategoryFilter 
          categories={categories}
          onSelectCategory={handleSelectCategory}
          selectedCategory={selectedCategory}
        />
      </div>
      
      {/* Results area */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold">
            {isLoading ? (
              <span>Searching...</span>
            ) : (
              <span>{listings.length} items available {selectedCategory && ` in ${selectedCategory}`}</span>
            )}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm hidden md:inline">Sort by:</span>
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="rating">Highest Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listings.length > 0 ? (
              listings.map(listing => (
                <ListingCard key={listing.id} {...listing} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center">
                <p className="text-xl text-gray-600 mb-4">No items found. Try adjusting your filters.</p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery("");
                  setLocationQuery("");
                  setPriceMin(undefined);
                  setPriceMax(undefined);
                  setSelectedCategory(null);
                  setSearchParams({});
                }}>
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
