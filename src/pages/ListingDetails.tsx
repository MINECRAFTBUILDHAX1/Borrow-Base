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
import { format, addDays, isSameDay, isWithinInterval } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface RentalDateRange {
  start: Date;
  end: Date;
}

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
  const [bookedRanges, setBookedRanges] = useState<RentalDateRange[]>([]);
  const [rentalId, setRentalId] = useState<string | null>(null);
  const [rentalCode, setRentalCode] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [listing, setListing] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [owner, setOwner] = useState<any | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  
  // Calculate total price when dates are selected
  useEffect(() => {
    if (startDate && endDate && listing) {
      const msPerDay = 1000 * 60 * 60 * 24;
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / msPerDay) + 1;
      setTotalPrice(days * listing.price_per_day);
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
            price_per_day: data.price_per_day,
            security_deposit: data.security_deposit || 0,
            images: data.images || [],
            location: data.location,
            features: data.features || [],
            rules: data.rules || [],
            userId: data.user_id,
            category: data.category,
            average_rating: data.average_rating || 0,
            review_count: data.review_count || 0
          };
          
          setListing(listingData);
          
          // Fetch owner data separately
          fetchOwnerData(data.user_id);
          
          // Fetch booked dates for this listing
          fetchBookedDates(data.id);
          
          // Fetch reviews for this listing (would be from a 'reviews' table if we had one)
          // For now, we'll use mock reviews
          setReviews([]);
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
  
  const fetchOwnerData = async (ownerId: string) => {
    if (!ownerId) return;
    
    try {
      const { data: userData } = await supabase.auth.admin.getUserById(ownerId);
      if (userData && userData.user) {
        setOwner({
          id: ownerId,
          name: userData.user.user_metadata?.full_name || 
                userData.user.email?.split('@')[0] || 
                "Lender",
          email: userData.user.email,
          image: userData.user.user_metadata?.avatar_url || "",
          createdAt: userData.user.created_at
        });
      }
    } catch (error) {
      console.error("Error fetching owner data:", error);
    }
  };
  
  const fetchBookedDates = async (listingId: string) => {
    try {
      const { data, error } = await supabase
        .from('rentals')
        .select('start_date, end_date')
        .eq('listing_id', listingId)
        .in('status', ['paid', 'waiting_for_payment']);
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const ranges = data.map(rental => ({
          start: new Date(rental.start_date),
          end: new Date(rental.end_date)
        }));
        setBookedRanges(ranges);
      }
    } catch (error) {
      console.error("Error fetching booked dates:", error);
    }
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

  const handlePaymentInitiate = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to rent this item",
      });
      navigate("/auth");
      return;
    }
    
    if (!startDate || !endDate || !totalPrice) {
      toast({
        title: "Select dates",
        description: "Please select your rental dates first",
        variant: "destructive"
      });
      return;
    }
    
    if (user.id === listing.userId) {
      toast({
        title: "Can't rent your own item",
        description: "You cannot rent an item that you've listed",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Create a new rental record in the database with the required rental_code field
      // The rental_code will be set by the trigger we created
      const { data: rentalData, error } = await supabase
        .from('rentals')
        .insert({
          listing_id: listing.id,
          renter_id: user.id,
          seller_id: listing.userId,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          total_price: totalPrice,
          currency: 'GBP',
          status: 'waiting_for_payment'
        })
        .select();
        
      if (error) throw error;
      
      if (rentalData && rentalData[0]) {
        // Store the rental ID and code for use in the success dialog
        setRentalId(rentalData[0].id);
        setRentalCode(rentalData[0].rental_code);
        setPaymentSuccessOpen(true);
      }
    } catch (error) {
      console.error("Error creating rental:", error);
      toast({
        title: "Error",
        description: "Failed to create rental. Please try again.",
        variant: "destructive"
      });
    }
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
    // For now, we just show a success message since we don't have a reviews table
    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!",
    });
    
    setShowReviewDialog(false);
    setReviewText("");
  };
  
  // Check if a date is already booked
  const isDateBooked = (date: Date): boolean => {
    return bookedRanges.some(range => 
      isWithinInterval(date, { start: range.start, end: range.end })
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
        const tempDate = new Date(startDate.getTime());
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
  
  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);
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
        </div>
        <div className="flex items-center">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
          <span>{listing.average_rating.toFixed(1)}</span>
          <span className="text-gray-500 ml-1">({listing.review_count} reviews)</span>
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
                <AvatarImage src={owner?.image} alt={owner?.name} />
                <AvatarFallback>{owner?.name?.charAt(0) || 'L'}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">Listed by {owner?.name || 'Lender'}</h3>
                <p className="text-sm text-gray-600">
                  Member since {owner?.createdAt 
                    ? new Date(owner.createdAt).toLocaleDateString('en-US', {month: 'long', year: 'numeric'})
                    : 'recently'}
                </p>
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
          {listing.features && listing.features.length > 0 && (
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
          )}
          
          {/* Rules */}
          {listing.rules && listing.rules.length > 0 && (
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
          )}
          
          {/* Booked dates */}
          <div>
            <h2 className="text-xl font-semibold mb-3">Availability</h2>
            {bookedRanges.length > 0 ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Booked Dates:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {bookedRanges.map((range, index) => (
                    <div key={index} className="bg-red-50 text-red-600 px-2 py-1 rounded text-sm">
                      {format(range.start, 'MMM dd')} - {format(range.end, 'MMM dd, yyyy')}
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
                <span>{listing.average_rating.toFixed(1)}</span>
                <span className="text-gray-600 ml-1">({listing.review_count} reviews)</span>
              </div>
            </div>
            
            {reviews.length > 0 ? (
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
                
                {reviews.length > 3 && (
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
            
          
        
        {/* Right column - Booking card */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-2xl font-semibold">
                    £{listing.price_per_day}<span className="text-base font-normal text-gray-600">/day</span>
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
                  
                  {listing.security_deposit > 0 && (
                    <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                      <ShieldCheck className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">£{listing.security_deposit} security deposit</p>
                        <p className="text-xs text-gray-600">Will be refunded after successful return</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Payment link - only show if dates are selected */}
                {startDate && endDate && totalPrice ? (
                  <div 
                    onClick={handlePaymentInitiate}
                    className="mb-3"
                  >
                    <PaypalPaymentLink 
                      amount={totalPrice} 
                      currency="GBP" 
                      rentalCode={rentalCode || undefined}
                    />
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
        recipientName={owner?.name || "Lender"}
        recipientImage={owner?.image}
        listingTitle={listing.title}
        rentalId={rentalId || undefined}
        afterMessageSent={() => {
          toast({
            title: "Message sent",
            description: `Your message has been sent to ${owner?.name || 'the lender'}. They will respond soon.`,
          });
        }}
      />

      {/* Payment Success Dialog */}
      <PaymentSuccessDialog
        open={paymentSuccessOpen}
        onOpenChange={setPaymentSuccessOpen}
        onContactSeller={handleContactSeller}
        listingTitle={listing.title}
        rentalCode={rentalCode || undefined}
      />
    </div>
  );
};

export default ListingDetails;
