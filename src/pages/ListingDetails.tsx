
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ImageGallery from "@/components/listing/ImageGallery";
import RentalSection from "@/components/listing/RentalSection";
import ListingDetailInfo from "@/components/listing/ListingDetailInfo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, User, PenSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import PaymentSuccessDialog from "@/components/PaymentSuccessDialog";

interface Listing {
  id: string;
  title: string;
  description: string;
  price_per_day: number;
  security_deposit: number | null;
  location: string;
  images: string[];
  features: string[];
  rules: string[];
  user_id: string;
  created_at: string;
  updated_at: string;
  category: string;
}

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  email: string | null;
  created_at: string;
}

interface BookedDateRange {
  start: Date;
  end: Date;
}

const ListingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [owner, setOwner] = useState<Profile | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [bookedDateRanges, setBookedDateRanges] = useState<BookedDateRange[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [rentalDays, setRentalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdRentalId, setCreatedRentalId] = useState<string | null>(null);
  const [rentalCode, setRentalCode] = useState<string | null>(null);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!id) return;
    
    const fetchListingData = async () => {
      setLoading(true);
      try {
        // Fetch the listing
        const { data: listingData, error: listingError } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .single();
          
        if (listingError) {
          console.error("Error fetching listing data:", listingError);
          toast({
            title: "Error",
            description: "Failed to load listing details",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        if (listingData) {
          setListing(listingData as Listing);
          
          // Fetch the owner's profile including email
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', listingData.user_id)
            .single();
            
          if (profileError) {
            console.error("Error fetching owner profile:", profileError);
          } else if (profileData) {
            setOwner(profileData as Profile);
            // Make sure we get the email
            console.log("Profile data fetched:", profileData);
            setEmail(profileData.email);
          }
          
          // Fetch booked date ranges
          const { data: rentalsData, error: rentalsError } = await supabase
            .from('rentals')
            .select('start_date, end_date')
            .eq('listing_id', id)
            .in('status', ['waiting_for_payment', 'paid']);
            
          if (rentalsError) {
            console.error("Error fetching rental dates:", rentalsError);
          } else if (rentalsData) {
            const ranges = rentalsData.map(rental => ({
              start: new Date(rental.start_date),
              end: new Date(rental.end_date)
            }));
            setBookedDateRanges(ranges);
          }
        } else {
          toast({
            title: "Listing not found",
            description: "The listing you're trying to view doesn't exist or has been removed.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching listing data:", error);
        toast({
          title: "Error",
          description: "Failed to load listing details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchListingData();
  }, [id, toast]);

  const calculateRentalPrice = (start: Date | null, end: Date | null) => {
    if (!start || !end || !listing) return { days: 0, price: 0 };
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      days,
      price: days * listing.price_per_day
    };
  };

  const handleDateChange = (startDate: Date | null, endDate: Date | null) => {
    setStartDate(startDate);
    setEndDate(endDate);
    
    if (startDate && endDate && listing) {
      const { days, price } = calculateRentalPrice(startDate, endDate);
      setRentalDays(days);
      setTotalPrice(price);
    } else {
      setRentalDays(0);
      setTotalPrice(0);
    }
  };

  const handleBookNow = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to book this item",
      });
      navigate("/auth");
      return;
    }
    
    if (!startDate || !endDate || !listing) {
      toast({
        title: "Date selection required",
        description: "Please select rental start and end dates",
        variant: "destructive",
      });
      return;
    }
    
    // Check if the user is trying to book their own listing
    if (user.id === listing.user_id) {
      toast({
        title: "Cannot book own listing",
        description: "You cannot book an item you have listed",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate a rental code on the client side as temporary solution
      const tempRentalCode = `BBR-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      
      // Create the rental with the temporary code
      const { data: rentalData, error } = await supabase
        .from('rentals')
        .insert({
          listing_id: id,
          renter_id: user.id,
          seller_id: listing.user_id,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          total_price: totalPrice,
          currency: "GBP",
          status: "waiting_for_payment",
          rental_code: tempRentalCode
        })
        .select('id, rental_code')
        .single();
      
      if (error) throw error;
      
      if (rentalData) {
        setCreatedRentalId(rentalData.id);
        setRentalCode(rentalData.rental_code);
        setShowSuccessDialog(true);
      }
    } catch (error) {
      console.error("Error creating rental:", error);
      toast({
        title: "Booking failed",
        description: "There was an error creating your rental. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReview = () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to write a review",
      });
      navigate("/auth");
      return;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <p>Loading listing details...</p>
        </div>
      </div>
    );
  }
  
  if (!listing) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Listing not found</h2>
          <p>The listing you are looking for does not exist or has been removed.</p>
          <Button className="mt-4" asChild>
            <Link to="/explore">Explore other listings</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const ownerDisplayName = owner?.username || owner?.full_name || "User";
  const formattedMemberSince = owner?.created_at ? 
    new Date(owner.created_at).toLocaleDateString('en-US', {month: 'long', year: 'numeric'}) : 
    "Recently joined";
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left column: Images and item details */}
        <div className="w-full lg:w-8/12 space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
            <div className="flex items-center text-gray-600">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className="mx-1">•</span>
              <span className="mx-1">•</span>
              <span>{listing.location}</span>
            </div>
          </div>
          
          <ImageGallery images={listing.images} title={listing.title} />
          
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={owner?.avatar_url || ''} />
                <AvatarFallback>
                  {ownerDisplayName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Listed by {ownerDisplayName}</p>
                <p className="text-sm text-gray-500">Member since {formattedMemberSince}</p>
              </div>
              <div className="ml-auto">
               
              </div>
            </div>
          </Card>
          
          <Separator />
          
          <div className="space-y-8">
            <ListingDetailInfo
              description={listing.description}
              features={listing.features}
              rules={listing.rules}
              bookedRanges={bookedDateRanges}
            />
            
       
        {/* Right column: Booking widget */}
        <div className="w-full lg:w-4/12">
          {listing && (
            <RentalSection
              listing={listing}
              email={email}
              startDate={startDate}
              endDate={endDate}
              totalPrice={totalPrice}
              handleDateSelect={(date) => {
                if (!startDate || (startDate && endDate)) {
                  setStartDate(date || null);
                  setEndDate(null);
                  handleDateChange(date || null, null);
                } else {
                  setEndDate(date || null);
                  handleDateChange(startDate, date || null);
                }
              }}
              isDateDisabled={(date) => {
                return bookedDateRanges.some(range => 
                  date >= range.start && date <= range.end
                );
              }}
              handlePaymentInitiate={handleBookNow}
              rentalCode={rentalCode}
            />
          )}
          
          {listing?.category && (
            <div className="mt-4 p-4 border rounded-lg">
              <p className="text-sm font-medium mb-2">Category</p>
              <Badge variant="outline" className="bg-gray-100">
                {listing.category}
              </Badge>
            </div>
          )}
        </div>
      </div>
      
      {/* Success Dialog */}
      {showSuccessDialog && createdRentalId && (
        <PaymentSuccessDialog
          open={showSuccessDialog}
          onOpenChange={setShowSuccessDialog}
          rentalCode={rentalCode || ""}
          rentalId={createdRentalId || ""}
        />
      )}
    </div>
  );
};

export default ListingDetails;
