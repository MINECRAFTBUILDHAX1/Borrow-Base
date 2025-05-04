
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon, ChevronLeft, MapPin, Star, Clock, ShieldCheck, MessageCircle } from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PaypalPaymentLink from "@/components/PaypalPaymentLink";
import MessagingDialog from "@/components/MessagingDialog";
import PaymentSuccessDialog from "@/components/PaymentSuccessDialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, addDays } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ListingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [paymentSuccessOpen, setPaymentSuccessOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listing, setListing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookedDates, setBookedDates] = useState<Date[]>([]);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  
  // Calculate total price when dates are selected
  useEffect(() => {
    if (startDate && endDate && listing) {
      const msPerDay = 1000 * 60 * 60 * 24;
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / msPerDay) + 1;
      setTotalPrice(days * listing.price);
    } else {
      setTotalPrice(null);
    }
  }, [startDate, endDate, listing]);
  
  // Fetch listing from Supabase
  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
          
        if (data) {
          // Format Supabase data to match our listing structure
          const listingData = {
            id: data.id,
            title: data.title,
            description: data.description,
            price: data.price_per_day,
            priceUnit: "day",
            deposit: data.security_deposit || 0,
            images: data.images || [],
            location: data.location,
            distance: "Available for pickup",
            features: data.features || [],
            rules: data.rules || [],
            userId: data.user_id,
            owner: {
              id: data.user_id,
              name: "Owner", // We'll update this later
              image: "", // We'll update this later
              rating: data.average_rating || 4.5,
              reviewCount: data.review_count || 0,
              responseTime: "Usually responds quickly",
              memberSince: "2023"
            },
            reviews: [], // For now, we don't have reviews
            bookedDates: [] // Will be populated with booked dates
          };
          
          // Fetch user data for the owner
          const { data: userData } = await supabase.auth.admin.getUserById(data.user_id);
          if (userData && userData.user) {
            listingData.owner = {
              ...listingData.owner,
              name: userData.user.user_metadata?.full_name || "Lender",
              image: userData.user.user_metadata?.avatar_url || "",
            };
          }
          
          // Fetch booked dates for this listing (this would be from a 'rentals' table)
          // This is just placeholder code - would need a real rentals table implementation
          // const { data: rentalsData } = await supabase
          //   .from('rentals')
          //   .select('start_date, end_date')
          //   .eq('listing_id', id);
          
          // if (rentalsData) {
          //   const unavailableDates = [];
          //   for (const rental of rentalsData) {
          //     const start = new Date(rental.start_date);
          //     const end = new Date(rental.end_date);
          //     // Add all dates between start and end to unavailableDates
          //     for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
          //       unavailableDates.push(new Date(d));
          //     }
          //   }
          //   listingData.bookedDates = unavailableDates;
          // }
          
          setListing(listingData);
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
        toast({
          title: "Error",
          description: "Unable to load listing details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchListing();
  }, [id, toast]);
  
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

  const handlePaymentSuccess = () => {
    setPaymentSuccessOpen(true);
  };
  
  const handleContactSeller = () => {
    setPaymentSuccessOpen(false);
    setContactModalOpen(true);
  };
  
  const handleSubmitReview = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to submit a review",
      });
      navigate("/auth");
      return;
    }
    
    // Here you would submit the review to your database
    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!",
    });
    
    setShowReviewDialog(false);
    setReviewText("");
  };
  
  const isDateBooked = (date: Date) => {
    return bookedDates.some(bookedDate => 
      bookedDate.getFullYear() === date.getFullYear() &&
      bookedDate.getMonth() === date.getMonth() &&
      bookedDate.getDate() === date.getDate()
    );
  };
  
  // Determine if a date should be disabled (either it's booked or in the past)
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || isDateBooked(date);
  };
  
  // Handle date selection with validation
  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    if (!startDate || (startDate && endDate)) {
      // If no start date is selected or both dates are selected, set the start date
      setStartDate(date);
      setEndDate(null);
    } else {
      // If only start date is selected, set the end date (if valid)
      if (date < startDate) {
        // If selected date is before start date, swap them
        setEndDate(startDate);
        setStartDate(date);
      } else {
        // Check if any date in the range is booked
        let isRangeValid = true;
        const tempDate = new Date(startDate);
        while (tempDate <= date) {
          if (isDateBooked(tempDate)) {
            isRangeValid = false;
            break;
          }
          tempDate.setDate(tempDate.getDate() + 1);
        }
        
        if (isRangeValid) {
          setEndDate(date);
        } else {
          toast({
            title: "Invalid date range",
            description: "Some dates in this range are already booked.",
            variant: "destructive",
          });
        }
      }
    }
  };
  
  // If loading, show loading state
  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <p>Loading listing details...</p>
      </div>
    );
  }

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
  const isOwner = user && user.id === listing.userId;
  
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
          <span className="text-gray-500 ml-1">({listing.owner.reviewCount} reviews)</span>
        </div>
      </div>
      
      {/* Images carousel */}
      <div className="mb-8">
        <Carousel className="w-full">
          <CarouselContent>
            {listing.images.map((image: string, index: number) => (
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
                <h3 className="font-medium">Listed by {listing.owner.name}</h3>
                <p className="text-sm text-gray-600">Member since {listing.owner.memberSince}</p>
              </div>
            </div>
            <Link to={`/profile/${listing.userId}`}>
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
              {listing.features.map((feature: string, index: number) => (
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
              {listing.rules.map((rule: string, index: number) => (
                <li key={index} className="flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-brand-purple mr-2"></div>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Booked dates */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Availability</h2>
            {bookedDates.length > 0 ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Booked Dates:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {bookedDates.map((date, index) => (
                    <div key={index} className="bg-red-50 text-red-600 px-2 py-1 rounded text-sm">
                      {format(date, 'MMM dd, yyyy')}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-green-600">All dates currently available!</p>
            )}
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
            
            {listing.reviews && listing.reviews.length > 0 ? (
              <div className="space-y-4">
                {displayedReviews.map((review: any) => (
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
                
                {listing.reviews.length > 3 && (
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={() => setShowAllReviews(!showAllReviews)}
                  >
                    {showAllReviews ? "Show less" : "View all reviews"}
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">No reviews yet.</p>
                {!isOwner && (
                  <Button onClick={() => setShowReviewDialog(true)}>
                    Be the first to review
                  </Button>
                )}
              </div>
            )}
            
            {!isOwner && listing.reviews && listing.reviews.length > 0 && (
              <div className="mt-4">
                <Button onClick={() => setShowReviewDialog(true)}>
                  Add a review
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Right column - Booking card */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-2xl font-semibold">
                    £{listing.price}<span className="text-base font-normal text-gray-600">/{listing.priceUnit}</span>
                  </p>
                  <Badge variant="outline" className="bg-brand-pastel-green text-gray-800 font-normal">
                    Available Now
                  </Badge>
                </div>
                
                {/* Date selection */}
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="font-medium mb-2">Select dates</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "MMM dd") : "Start date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate ?? undefined}
                            onSelect={(date) => handleDateSelect(date)}
                            disabled={isDateDisabled}
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "MMM dd") : "End date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate ?? undefined}
                            onSelect={(date) => handleDateSelect(date)}
                            disabled={(date) => {
                              if (!startDate) return true;
                              return date < startDate || isDateDisabled(date);
                            }}
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  
                  {startDate && endDate && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between mb-2">
                        <span>Total</span>
                        <span className="font-semibold">£{totalPrice}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        For {Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                      </p>
                    </div>
                  )}
                  
                  <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">£{listing.deposit} security deposit</p>
                      <p className="text-xs text-gray-600">Will be refunded after successful return</p>
                    </div>
                  </div>
                </div>
                
                {/* Payment link - only show if dates are selected */}
                {startDate && endDate && totalPrice ? (
                  <div 
                    onClick={handlePaymentSuccess}
                    className="mb-3"
                  >
                    <PaypalPaymentLink amount={totalPrice} currency="GBP" />
                  </div>
                ) : (
                  <div className="mb-3 text-center p-2 bg-amber-50 text-amber-700 rounded-lg text-sm">
                    Please select start and end dates to proceed with payment
                  </div>
                )}
                
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2" 
                  onClick={handleContactOwner}
                >
                  <MessageCircle className="h-4 w-4" />
                  Contact Lender
                </Button>
                
                <p className="text-xs text-center mt-4 text-gray-500">
                  85% of the payment goes to the lender within 2 days of rental start
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Review Dialog */}
      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your experience with this item and help others make informed decisions.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="flex justify-center mb-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Star 
                  key={rating}
                  className={`h-8 w-8 cursor-pointer ${
                    rating <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                  onClick={() => setReviewRating(rating)}
                />
              ))}
            </div>
            
            <Textarea
              placeholder="Write your review here..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={5}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewDialog(false)}>Cancel</Button>
            <Button onClick={handleSubmitReview}>Submit Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Owner Modal */}
      <MessagingDialog
        open={contactModalOpen}
        onOpenChange={setContactModalOpen}
        recipientId={listing.userId}
        recipientName={listing.owner.name}
        recipientImage={listing.owner.image}
        listingTitle={listing.title}
        afterMessageSent={() => {
          toast({
            title: "Message sent",
            description: `Your message has been sent to ${listing.owner.name}. They will respond soon.`,
          });
        }}
      />

      {/* Payment Success Dialog */}
      <PaymentSuccessDialog
        open={paymentSuccessOpen}
        onOpenChange={setPaymentSuccessOpen}
        onContactSeller={handleContactSeller}
        listingTitle={listing.title}
      />
    </div>
  );
};

export default ListingDetails;
