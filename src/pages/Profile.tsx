
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Settings, MessageCircle } from "lucide-react";
import ListingCard, { ListingProps } from "@/components/ListingCard";

// Mock user data
const mockUserData = {
  id: "user123",
  name: "Michael Chen",
  image: "https://randomuser.me/api/portraits/men/32.jpg",
  bio: "Photography enthusiast and gadget lover. I enjoy sharing my equipment with others and meeting fellow creatives.",
  location: "Brooklyn, NY",
  memberSince: "June 2022",
  rating: 4.9,
  reviewCount: 42,
  verified: true,
  listings: [
    {
      id: "1",
      title: "Professional DSLR Camera",
      price: 35,
      priceUnit: "day",
      imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtZXJhfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
      location: "Brooklyn, NY",
      rating: 4.9,
      reviewCount: 23,
      category: "Electronics"
    },
    {
      id: "5",
      title: "Projector for Home Cinema",
      price: 20,
      priceUnit: "day",
      imageUrl: "https://images.unsplash.com/photo-1585504198199-20277a781a1d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cHJvamVjdG9yfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
      location: "Brooklyn, NY",
      rating: 4.5,
      reviewCount: 12,
      category: "Electronics"
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
      category: "Electronics"
    }
  ],
  rentals: [
    {
      id: "2",
      title: "Mountain Bike",
      price: 25,
      priceUnit: "day",
      imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YmljeWNsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
      location: "Queens, NY",
      rating: 4.7,
      reviewCount: 18,
      category: "Sports"
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
      category: "Outdoor"
    }
  ],
  reviews: [
    {
      id: "rev1",
      user: {
        name: "Sarah Johnson",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      rating: 5,
      date: "August 2023",
      comment: "Michael's camera was in perfect condition and he was very helpful explaining all the features. Would definitely rent from him again!"
    },
    {
      id: "rev2",
      user: {
        name: "David Wilson",
        image: "https://randomuser.me/api/portraits/men/67.jpg",
      },
      rating: 5,
      date: "July 2023",
      comment: "Great experience! The camera performed flawlessly for our event and Michael was very accommodating with pickup and drop-off times."
    },
    {
      id: "rev3",
      user: {
        name: "Lisa Brooks",
        image: "https://randomuser.me/api/portraits/women/17.jpg",
      },
      rating: 5,
      date: "June 2023",
      comment: "Michael is a reliable lender and the projector was exactly as described. Will definitely rent from him again!"
    }
  ]
};

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const isOwnProfile = id === "me";
  
  // In a real app, fetch user data based on ID
  const userData = mockUserData;
  
  if (!userData) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <p>Loading user profile...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
        <Avatar className="h-20 w-20 md:h-32 md:w-32">
          <AvatarImage src={userData.image} alt={userData.name} />
          <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">{userData.name}</h1>
              <div className="flex items-center text-gray-600 mb-2">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span>{userData.rating}</span>
                <span className="ml-1">({userData.reviewCount} reviews)</span>
                {userData.verified && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm">Member since {userData.memberSince} • {userData.location}</p>
            </div>
            
            {isOwnProfile ? (
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <Button className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Message
              </Button>
            )}
          </div>
          
          {userData.bio && (
            <div className="mt-4">
              <h2 className="font-medium mb-1">About</h2>
              <p className="text-gray-700">{userData.bio}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="listings" className="mt-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md mb-6">
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="rentals">Rentals</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        
        <TabsContent value="listings">
          <h2 className="text-xl font-semibold mb-4">
            {userData.listings.length > 0 
              ? `${userData.name}'s Items (${userData.listings.length})`
              : "No items listed yet"}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {userData.listings.map((listing: ListingProps) => (
              <ListingCard key={listing.id} {...listing} />
            ))}
          </div>
          
          {isOwnProfile && (
            <div className="mt-8 text-center">
              <Button as="a" href="/create-listing">
                + Add New Listing
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rentals">
          <h2 className="text-xl font-semibold mb-4">
            {userData.rentals.length > 0 
              ? `Rental History (${userData.rentals.length})`
              : "No rental history yet"}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {userData.rentals.map((rental: ListingProps) => (
              <ListingCard key={rental.id} {...rental} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="reviews">
          <h2 className="text-xl font-semibold mb-4">
            {userData.reviews.length > 0 
              ? `Reviews (${userData.reviews.length})`
              : "No reviews yet"}
          </h2>
          
          <div className="space-y-6">
            {userData.reviews.map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={review.user.image} alt={review.user.name} />
                    <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{review.user.name}</div>
                    <div className="text-sm text-gray-500">{review.date}</div>
                  </div>
                </div>
                <div className="flex mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
