import { useState, useEffect } from "react";
import { Search, Filter, MapPin, Loader2 } from "lucide-react";
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
import { PostgrestResponse } from "@supabase/supabase-js";

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
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get("search") || "");
  const [locationQuery, setLocationQuery] = useState<string>(searchParams.get("location") || "");
  const [priceMin, setPriceMin] = useState<number | undefined>(undefined);
  const [priceMax, setPriceMax] = useState<number | undefined>(undefined);
  const [listings, setListings] = useState<ListingProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
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
        
        // Execute the query with proper type casting
        const { data, error } = await query as unknown as PostgrestResponse<ListingTable[]>;
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Format listings to match the ListingProps type
          const formattedListings = data.map(listing => ({
            id: listing.id,
            title: listing.title,
            price: listing.price_per_day || 0,
            priceUnit: "day" as "day" | "hour" | "week" | "month", // explicitly cast to union type
            imageUrl: listing.images && listing.images.length > 0 
              ? listing.images[0] 
              : "https://via.placeholder.com/300x200?text=No+Image",
            location: listing.location || "No location",
            rating: listing.average_rating || 0,
            reviewCount: listing.review_count || 0,
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
            <div className="relative flex-grow md:max-w-[180px]">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input 
                className="pl-10 h-12" 
                placeholder="Location"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
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
