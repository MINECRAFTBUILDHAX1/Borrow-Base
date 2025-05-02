
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SearchIcon, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ListingCard, { ListingProps } from "@/components/ListingCard";
import CategoryFilter from "@/components/CategoryFilter";
import { supabase } from "@/integrations/supabase/client";
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

const Index = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [featuredListings, setFeaturedListings] = useState<ListingProps[]>([]);
  const [nearbyListings, setNearbyListings] = useState<ListingProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  
  // Fetch listings from Supabase
  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true);
      
      try {
        // Fetch all listings with proper type casting
        const { data: allListings, error } = await supabase
          .from('listings')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false }) as unknown as PostgrestResponse<ListingTable[]>;
          
        if (error) {
          throw error;
        }
        
        if (allListings) {
          // Format listings to match the ListingProps type
          const formattedListings = allListings.map(listing => ({
            id: listing.id,
            title: listing.title,
            price: listing.price_per_day,
            priceUnit: 'day' as 'day' | 'hour' | 'week' | 'month', // Explicitly cast to the union type
            imageUrl: listing.images && listing.images.length > 0 
              ? listing.images[0] 
              : "https://via.placeholder.com/300x200?text=No+Image",
            location: listing.location || "No location",
            rating: listing.average_rating || 0,
            reviewCount: listing.review_count || 0,
            category: listing.category || "Other",
            distance: 0 // Would be calculated in a real app
          }));
          
          // For featured listings, just take the first 4 items
          setFeaturedListings(formattedListings.slice(0, 4));
          
          // For nearby listings, take the next 4 items
          // In a real app, you'd filter by actual location proximity
          setNearbyListings(formattedListings.slice(4, 8));
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchListings();
  }, []);
  
  // Filter listings based on selected category
  useEffect(() => {
    const fetchFilteredListings = async () => {
      if (!selectedCategory) return;
      
      setIsLoading(true);
      
      try {
        // Fetch listings filtered by category with proper type casting
        const { data: filteredListings, error } = await supabase
          .from('listings')
          .select('*')
          .eq('status', 'active')
          .eq('category', selectedCategory)
          .order('created_at', { ascending: false }) as unknown as PostgrestResponse<ListingTable[]>;
          
        if (error) {
          throw error;
        }
        
        if (filteredListings) {
          // Format listings to match the ListingProps type
          const formattedListings = filteredListings.map(listing => ({
            id: listing.id,
            title: listing.title,
            price: listing.price_per_day,
            priceUnit: 'day' as 'day' | 'hour' | 'week' | 'month', // Explicitly cast to the union type
            imageUrl: listing.images && listing.images.length > 0 
              ? listing.images[0] 
              : "https://via.placeholder.com/300x200?text=No+Image",
            location: listing.location || "No location",
            rating: listing.average_rating || 0,
            reviewCount: listing.review_count || 0,
            category: listing.category || "Other",
            distance: 0 // Would be calculated in a real app
          }));
          
          // For featured listings, just take the first 4 items
          setFeaturedListings(formattedListings.slice(0, 4));
          
          // For nearby listings, take the next 4 items
          setNearbyListings(formattedListings.slice(4, 8));
        }
      } catch (error) {
        console.error('Error fetching filtered listings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (selectedCategory) {
      fetchFilteredListings();
    }
  }, [selectedCategory]);
  
  const handleSelectCategory = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };
  
  const handleSearch = () => {
    // Navigate to explore page with search parameters
    navigate(`/explore?search=${searchQuery}&location=${locationQuery}`);
  };
  
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-brand-purple to-brand-purple-dark text-white py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Borrow anything from people around you
            </h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Access thousands of items without the cost of ownership. List your own items and start earning.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-4 max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-grow">
                <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input 
                  className="pl-10 h-12 text-gray-800" 
                  placeholder="What do you want to borrow?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="relative flex-grow">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input 
                  className="pl-10 h-12 text-gray-800" 
                  placeholder="Location"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button size="lg" className="h-12" onClick={handleSearch}>
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="border-b">
        <CategoryFilter 
          categories={categories}
          onSelectCategory={handleSelectCategory}
          selectedCategory={selectedCategory}
        />
      </section>
      
      {/* Featured Listings Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {selectedCategory ? `Featured ${selectedCategory}` : "Featured Items"}
            </h2>
            <Link to="/explore" className="text-brand-purple hover:underline">
              View all
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
            </div>
          ) : featuredListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredListings.map(listing => (
                <ListingCard key={listing.id} {...listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No featured items found {selectedCategory && `in ${selectedCategory}`}.
              {!selectedCategory && (
                <div className="mt-4">
                  <Link to="/create-listing">
                    <Button>Be the first to list an item</Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      
      {/* Nearby Listings Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {selectedCategory ? `${selectedCategory} Near You` : "Near You"}
            </h2>
            <Link to="/explore" className="text-brand-purple hover:underline">
              View all
            </Link>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-brand-purple" />
            </div>
          ) : nearbyListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {nearbyListings.map(listing => (
                <ListingCard key={listing.id} {...listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No nearby items found {selectedCategory && `in ${selectedCategory}`}.
            </div>
          )}
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">How BorrowBase Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-brand-pastel-purple flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Find What You Need</h3>
              <p className="text-gray-600">Browse thousands of items available in your area.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-brand-pastel-green flex items-center justify-center mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Book & Pay Securely</h3>
              <p className="text-gray-600">Reserve items for the dates you need and pay securely online.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-brand-pastel-yellow flex items-center justify-center mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Pick Up & Return</h3>
              <p className="text-gray-600">Meet the owner, pick up the item, and return it when you're done.</p>
            </div>
          </div>
          <Button className="mt-12" size="lg" onClick={() => navigate('/explore')}>
            Start Borrowing
          </Button>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 bg-brand-pastel-purple">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Have items to share?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Turn your unused items into income by renting them out to people in your community.
          </p>
          <Link to="/create-listing">
            <Button size="lg" variant="secondary">
              List Your Items
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
