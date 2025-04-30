import { useState, useEffect } from "react";
import { Search, Filter, MapPin } from "lucide-react";
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
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet";
import ListingCard, { ListingProps } from "@/components/ListingCard";
import CategoryFilter from "@/components/CategoryFilter";

// Mock categories data
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
];

// Mock listings data
const mockListings: ListingProps[] = [
  {
    id: "1",
    title: "Professional DSLR Camera",
    price: 35,
    priceUnit: "day",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtZXJhfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    location: "Brooklyn, NY",
    rating: 4.9,
    reviewCount: 23,
    category: "Electronics",
    distance: 1.2
  },
  {
    id: "2",
    title: "Mountain Bike",
    price: 25,
    priceUnit: "day",
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YmljeWNsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    location: "Queens, NY",
    rating: 4.7,
    reviewCount: 18,
    category: "Sports",
    distance: 2.5
  },
  {
    id: "3",
    title: "Premium Power Drill Set",
    price: 15,
    priceUnit: "day",
    imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZHJpbGx8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
    location: "Manhattan, NY",
    rating: 4.8,
    reviewCount: 42,
    category: "Tools",
    distance: 0.8
  },
  {
    id: "4",
    title: "Camping Tent (4 Person)",
    price: 30,
    priceUnit: "day",
    imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y2FtcGluZyUyMHRlbnR8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
    location: "Bronx, NY",
    rating: 4.6,
    reviewCount: 31,
    category: "Outdoor",
    distance: 3.1
  },
  {
    id: "5",
    title: "Projector for Home Cinema",
    price: 20,
    priceUnit: "day",
    imageUrl: "https://images.unsplash.com/photo-1585504198199-20277a781a1d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cHJvamVjdG9yfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    location: "Manhattan, NY",
    rating: 4.5,
    reviewCount: 12,
    category: "Electronics",
    distance: 0.5
  },
  {
    id: "6",
    title: "Electric Guitar",
    price: 40,
    priceUnit: "day",
    imageUrl: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Z3VpdGFyfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    location: "Brooklyn, NY",
    rating: 4.9,
    reviewCount: 8,
    category: "Music",
    distance: 1.7
  },
  {
    id: "7",
    title: "Portable Grill",
    price: 15,
    priceUnit: "day",
    imageUrl: "https://images.unsplash.com/photo-1523897530436-6e6748f1bdd7?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Z3JpbGx8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
    location: "Queens, NY",
    rating: 4.6,
    reviewCount: 15,
    category: "Outdoor",
    distance: 2.2
  },
  {
    id: "8",
    title: "Professional Lawn Mower",
    price: 35,
    priceUnit: "day",
    imageUrl: "https://images.unsplash.com/photo-1589117668050-64a676875673?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bGF3biUyMG1vd2VyfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    location: "Staten Island, NY",
    rating: 4.7,
    reviewCount: 19,
    category: "Tools",
    distance: 4.5
  },
  {
    id: "9",
    title: "DJ Equipment Set",
    price: 50,
    priceUnit: "day",
    imageUrl: "https://images.unsplash.com/photo-1597627495643-3d11821c7959?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZGolMjBlcXVpcG1lbnR8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
    location: "Brooklyn, NY",
    rating: 4.8,
    reviewCount: 27,
    category: "Music",
    distance: 2.0
  },
  {
    id: "10",
    title: "Stand-up Paddle Board",
    price: 30,
    priceUnit: "day",
    imageUrl: "https://images.unsplash.com/photo-1526188717906-ab4a2f949f67?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cGFkZGxlJTIwYm9hcmR8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
    location: "Queens, NY",
    rating: 4.9,
    reviewCount: 14,
    category: "Sports",
    distance: 3.3
  },
  {
    id: "11",
    title: "Gaming Console (PS5)",
    price: 25,
    priceUnit: "day",
    imageUrl: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cHM1fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    location: "Manhattan, NY",
    rating: 4.7,
    reviewCount: 36,
    category: "Games",
    distance: 1.1
  },
  {
    id: "12",
    title: "Professional Drone",
    price: 45,
    priceUnit: "day",
    imageUrl: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZHJvbmV8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
    location: "Brooklyn, NY",
    rating: 4.8,
    reviewCount: 22,
    category: "Electronics",
    distance: 2.4
  }
];

const Explore = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>("recommended");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [location, setLocation] = useState<string>("New York, NY");
  const [priceMin, setPriceMin] = useState<number | undefined>(undefined);
  const [priceMax, setPriceMax] = useState<number | undefined>(undefined);
  
  // Filter listings based on category and search query
  const filteredListings = mockListings.filter(listing => {
    const matchesCategory = !selectedCategory || listing.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = !searchQuery || listing.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = 
      (!priceMin || listing.price >= priceMin) && 
      (!priceMax || listing.price <= priceMax);
    
    return matchesCategory && matchesSearch && matchesPrice;
  });
  
  // Sort listings based on selected option
  const sortedListings = [...filteredListings].sort((a, b) => {
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
  
  const handleSelectCategory = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handleSearch = () => {
    // In a real app, this would trigger an API call with the search parameters
    console.log("Searching for:", { searchQuery, location, selectedCategory });
  };
  
  const applyFilters = (min?: number, max?: number) => {
    setPriceMin(min);
    setPriceMax(max);
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
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
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
                        onChange={(e) => setPriceMin(e.target.value ? Number(e.target.value) : undefined)}
                      />
                      <span>to</span>
                      <Input 
                        placeholder="Max" 
                        type="number"
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
            {sortedListings.length} items available
            {selectedCategory && ` in ${selectedCategory}`}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm hidden md:inline">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {sortedListings.length > 0 ? (
            sortedListings.map(listing => (
              <ListingCard key={listing.id} {...listing} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-xl text-gray-600">No items found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
