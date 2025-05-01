
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Calendar, ChevronLeft, MapPin, Star, Clock, ShieldCheck, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

// Mock listing data collection (would be fetched from API in real app)
const mockListings = {
  "1": {
    id: "1",
    title: "Professional DSLR Camera",
    description: "High-quality Canon 5D Mark IV DSLR camera with 24-70mm lens. Perfect for professional photography, events, or just trying out a professional camera. Includes carrying case, extra battery, memory card, and tripod.",
    price: 35,
    priceUnit: "day",
    deposit: 200,
    images: [
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtZXJhfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
      "https://images.unsplash.com/photo-1580707221190-bd94d9087b7f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y2FtZXJhfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8Y2FtZXJhfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
    ],
    location: "Brooklyn, NY",
    distance: "1.2 km away",
    features: ["24-70mm lens", "Extra battery", "Carrying case", "64GB memory card", "Tripod"],
    rules: ["Valid ID required", "Security deposit required", "Return in original condition", "No international travel"],
    owner: {
      id: "user123",
      name: "Michael Chen",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.9,
      reviewCount: 42,
      responseTime: "Within an hour",
      memberSince: "June 2022"
    },
    reviews: [
      {
        id: "rev1",
        user: {
          name: "Sarah Johnson",
          image: "https://randomuser.me/api/portraits/women/44.jpg",
        },
        rating: 5,
        date: "August 2023",
        comment: "The camera was in perfect condition and Michael was very helpful explaining all the features. Would definitely rent again!"
      },
      {
        id: "rev2",
        user: {
          name: "David Wilson",
          image: "https://randomuser.me/api/portraits/men/67.jpg",
        },
        rating: 5,
        date: "July 2023",
        comment: "Great experience! The camera performed flawlessly for our event."
      },
      {
        id: "rev3",
        user: {
          name: "Lisa Brooks",
          image: "https://randomuser.me/api/portraits/women/17.jpg",
        },
        rating: 4,
        date: "June 2023",
        comment: "Camera was as described. Pick up and drop off was easy and convenient."
      }
    ],
    availability: [
      // Available dates would go here
    ]
  },
  "2": {
    id: "2",
    title: "Mountain Bike",
    description: "High-performance mountain bike, perfect for weekend trails or daily commutes. Features 21-speed gear system, front suspension, and all-terrain tires. Recently serviced and in excellent condition.",
    price: 25,
    priceUnit: "day",
    deposit: 150,
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YmljeWNsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
      "https://images.unsplash.com/photo-1571068316344-75bc76f77890?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmljeWNsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
      "https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YmljeWNsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
    ],
    location: "Queens, NY",
    distance: "2.5 km away",
    features: ["21-speed gears", "Front suspension", "All-terrain tires", "Helmet included", "Lock included"],
    rules: ["Valid ID required", "Security deposit required", "Return clean and dry", "Report any damage"],
    owner: {
      id: "user456",
      name: "Emma Davis",
      image: "https://randomuser.me/api/portraits/women/22.jpg",
      rating: 4.8,
      reviewCount: 28,
      responseTime: "Within a few hours",
      memberSince: "March 2023"
    },
    reviews: [
      {
        id: "rev4",
        user: {
          name: "James Brown",
          image: "https://randomuser.me/api/portraits/men/22.jpg",
        },
        rating: 5,
        date: "September 2023",
        comment: "Great bike in excellent condition. Emma was very helpful and responsive."
      },
      {
        id: "rev5",
        user: {
          name: "Olivia Martin",
          image: "https://randomuser.me/api/portraits/women/32.jpg",
        },
        rating: 4,
        date: "August 2023",
        comment: "Bike was perfect for my weekend trip. Will rent again!"
      }
    ],
    availability: []
  },
  "3": {
    id: "3",
    title: "Premium Power Drill Set",
    description: "Professional-grade power drill set with multiple drill bits, perfect for home improvement projects. Includes rechargeable battery, charger, and carrying case.",
    price: 15,
    priceUnit: "day",
    deposit: 100,
    images: [
      "https://images.unsplash.com/photo-1504148455328-c376907d081c?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZHJpbGx8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
      "https://images.unsplash.com/photo-1623721675403-7cf4c03f6c16?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8ZHJpbGx8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
      "https://images.unsplash.com/photo-1575908673626-a8bae0953d09?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8ZHJpbGx8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
    ],
    location: "Manhattan, NY",
    distance: "0.8 km away",
    features: ["18V cordless", "Multiple drill bits", "Rechargeable battery", "Carrying case", "Extended warranty"],
    rules: ["Experience required", "Security deposit required", "Return in original condition", "No commercial use"],
    owner: {
      id: "user789",
      name: "Daniel Smith",
      image: "https://randomuser.me/api/portraits/men/41.jpg",
      rating: 4.7,
      reviewCount: 35,
      responseTime: "Usually responds within a day",
      memberSince: "January 2022"
    },
    reviews: [
      {
        id: "rev6",
        user: {
          name: "Sophia Chen",
          image: "https://randomuser.me/api/portraits/women/12.jpg",
        },
        rating: 5,
        date: "October 2023",
        comment: "The drill set was perfect for my weekend project. Daniel was very helpful with instructions."
      },
      {
        id: "rev7",
        user: {
          name: "William Jones",
          image: "https://randomuser.me/api/portraits/men/34.jpg",
        },
        rating: 4,
        date: "September 2023",
        comment: "Good quality drill, did exactly what I needed it to do."
      }
    ],
    availability: []
  }
};

const ListingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [showAllReviews, setShowAllReviews] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get the specific listing data based on ID
  const listing = id ? mockListings[id as keyof typeof mockListings] : null;
  
  const handleBookNow = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to book this item",
      });
      navigate("/auth");
      return;
    }
    
    setBookingModalOpen(true);
  };
  
  const handleContactOwner = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to contact the owner",
      });
      navigate("/auth");
      return;
    }
    
    setContactModalOpen(true);
  };
  
  const handleSendMessage = () => {
    if (!messageText.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message to send",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Message sent",
      description: "The owner will respond to your inquiry soon.",
    });
    
    setMessageText("");
    setContactModalOpen(false);
  };
  
  const handleConfirmBooking = () => {
    toast({
      title: "Booking confirmed",
      description: "Your booking has been submitted. You'll receive a confirmation soon.",
    });
    
    setBookingModalOpen(false);
  };
  
  // If listing not found, show appropriate message
  if (!listing) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-semibold mb-4">Listing Not Found</h2>
        <p className="mb-6">The item you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/explore')}>Browse All Listings</Button>
      </div>
    );
  }
  
  const displayedReviews = showAllReviews ? listing.reviews : listing.reviews.slice(0, 3);
  
  return (
    <div className="container mx-auto py-6 px-4">
      {/* Back button */}
      <Link to="/" className="inline-flex items-center mb-4 text-gray-700 hover:text-brand-purple">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to listings
      </Link>
      
      {/* Title */}
      <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
      
      {/* Location and rating */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center text-gray-600">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{listing.location}</span>
          <span className="ml-1 text-gray-500">({listing.distance})</span>
        </div>
        <div className="flex items-center">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
          <span>{listing.owner.rating}</span>
          <span className="text-gray-600 ml-1">({listing.owner.reviewCount} reviews)</span>
        </div>
      </div>
      
      {/* Images carousel */}
      <div className="mb-8">
        <Carousel className="w-full">
          <CarouselContent>
            {listing.images.map((image, index) => (
              <CarouselItem key={index} className="md:basis-2/3 lg:basis-1/2">
                <div className="p-1">
                  <div className="overflow-hidden rounded-lg">
                    <img 
                      src={image} 
                      alt={`${listing.title} - Image ${index + 1}`} 
                      className="w-full aspect-[4/3] object-cover"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Listing details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Host info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={listing.owner.image} alt={listing.owner.name} />
                <AvatarFallback>{listing.owner.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">Owned by {listing.owner.name}</h3>
                <p className="text-sm text-gray-600">Member since {listing.owner.memberSince}</p>
              </div>
            </div>
            <Link to={`/profile/${listing.owner.id}`}>
              <Button variant="outline">View Profile</Button>
            </Link>
          </div>
          
          <Separator />
          
          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-3">About this item</h2>
            <p className="text-gray-700">{listing.description}</p>
          </div>
          
          {/* Features */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Features</h2>
            <ul className="grid grid-cols-2 gap-2">
              {listing.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-brand-purple mr-2"></div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Rules */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Rules</h2>
            <ul className="space-y-2">
              {listing.rules.map((rule, index) => (
                <li key={index} className="flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-brand-purple mr-2"></div>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <Separator />
          
          {/* Reviews */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Reviews</h2>
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span>{listing.owner.rating}</span>
                <span className="text-gray-600 ml-1">({listing.owner.reviewCount} reviews)</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {displayedReviews.map(review => (
                <Card key={review.id} className="border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={review.user.image} alt={review.user.name} />
                        <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{review.user.name}</div>
                        <div className="text-xs text-gray-500">{review.date}</div>
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
                    <p className="text-gray-700 text-sm">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setShowAllReviews(!showAllReviews)}
              >
                {showAllReviews ? "Show less" : "View all reviews"}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Right column - Booking card */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-2xl font-semibold">
                    ${listing.price}<span className="text-base font-normal text-gray-600">/{listing.priceUnit}</span>
                  </p>
                  <Badge variant="outline" className="bg-brand-pastel-green text-gray-800 font-normal">
                    Available Now
                  </Badge>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Select dates</p>
                      <p className="text-xs text-gray-600">Add your rental dates for exact pricing</p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">${listing.deposit} security deposit</p>
                      <p className="text-xs text-gray-600">Will be refunded after successful return</p>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mb-3" onClick={handleBookNow}>Book Now</Button>
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2" 
                  onClick={handleContactOwner}
                >
                  <MessageCircle className="h-4 w-4" />
                  Contact Owner
                </Button>
                
                <p className="text-xs text-center mt-4 text-gray-500">
                  You won't be charged yet
                </p>
              </CardContent>
            </Card>
            
            <div className="mt-4 p-4 bg-brand-pastel-purple rounded-lg flex items-start gap-3">
              <Clock className="h-5 w-5 text-brand-purple mt-0.5" />
              <div>
                <p className="text-sm font-medium">Quick response</p>
                <p className="text-xs text-gray-600">
                  {listing.owner.name} typically responds within {listing.owner.responseTime.toLowerCase()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Owner Modal */}
      <Dialog open={contactModalOpen} onOpenChange={setContactModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Owner</DialogTitle>
            <DialogDescription>
              Send a message to {listing.owner.name} about this item.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={listing.owner.image} alt={listing.owner.name} />
                <AvatarFallback>{listing.owner.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{listing.owner.name}</p>
                <p className="text-sm text-gray-500">Typically responds within {listing.owner.responseTime.toLowerCase()}</p>
              </div>
            </div>
            <Textarea 
              placeholder="Write your message here..." 
              className="min-h-24"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSendMessage}>Send Message</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Book Now Modal */}
      <Dialog open={bookingModalOpen} onOpenChange={setBookingModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book {listing.title}</DialogTitle>
            <DialogDescription>
              Complete your booking details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <div className="font-medium text-sm mb-2">Rental Dates</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
                  <Input type="date" className="w-full" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">End Date</label>
                  <Input type="date" className="w-full" />
                </div>
              </div>
            </div>
            <div>
              <div className="font-medium text-sm mb-2">Payment Details</div>
              <Input type="text" placeholder="Card number" className="mb-2" />
              <div className="grid grid-cols-2 gap-4">
                <Input type="text" placeholder="MM/YY" />
                <Input type="text" placeholder="CVC" />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Your card will be charged ${listing.price} per {listing.priceUnit} plus a refundable security deposit of ${listing.deposit}.
              </p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleConfirmBooking}>Confirm Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ListingDetails;
