
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SearchIcon, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

// Mock featured listings data
const allFeaturedListings: ListingProps[] = [
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
];

// Mock nearby listings data
const allNearbyListings: ListingProps[] = [
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
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [featuredListings, setFeaturedListings] = useState<ListingProps[]>(allFeaturedListings);
  const [nearbyListings, setNearbyListings] = useState<ListingProps[]>(allNearbyListings);
  
  const handleSelectCategory = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };
  
  // Filter listings based on selected category
  useEffect(() => {
    if (selectedCategory === null) {
      setFeaturedListings(allFeaturedListings);
      setNearbyListings(allNearbyListings);
    } else {
      const filteredFeatured = allFeaturedListings.filter(listing => 
        listing.category.toLowerCase() === selectedCategory.toLowerCase()
      );
      const filteredNearby = allNearbyListings.filter(listing => 
        listing.category.toLowerCase() === selectedCategory.toLowerCase()
      );
      
      setFeaturedListings(filteredFeatured);
      setNearbyListings(filteredNearby);
    }
  }, [selectedCategory]);
  
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
                />
              </div>
              <div className="relative flex-grow">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input 
                  className="pl-10 h-12 text-gray-800" 
                  placeholder="Location"
                />
              </div>
              <Button size="lg" className="h-12" onClick={() => window.location.href = '/explore'}>
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
              {featuredListings.length === 0 && selectedCategory && (
                <span className="text-sm font-normal ml-2 text-gray-500">
                  (No items found)
                </span>
              )}
            </h2>
            <Link to="/explore" className="text-brand-purple hover:underline">
              View all
            </Link>
          </div>
          {featuredListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredListings.map(listing => (
                <ListingCard key={listing.id} {...listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No featured items found in this category.
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
              {nearbyListings.length === 0 && selectedCategory && (
                <span className="text-sm font-normal ml-2 text-gray-500">
                  (No items found)
                </span>
              )}
            </h2>
            <Link to="/explore" className="text-brand-purple hover:underline">
              View all
            </Link>
          </div>
          {nearbyListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {nearbyListings.map(listing => (
                <ListingCard key={listing.id} {...listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No nearby items found in this category.
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
          <Button className="mt-12" size="lg" onClick={() => window.location.href = '/explore'}>
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
