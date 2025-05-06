
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarIcon, Mail, Star } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Commission from "@/components/Commission";
import PaypalPaymentLink from "@/components/PaypalPaymentLink";
import { DateRange } from "react-day-picker";

interface ListingData {
  id: string;
  title: string;
  description: string;
  price_per_day: number;
  images: string[];
  location: string;
  category: string;
  user_id: string;
}

interface LenderData {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  created_at: string;
}

const ListingDetails = () => {
  const [listingData, setListingData] = useState<ListingData | null>(null);
  const [lenderData, setLenderData] = useState<LenderData | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingRental, setIsCreatingRental] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [rentalCode, setRentalCode] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [lenderRating, setLenderRating] = useState(0);
  const [lenderReviewCount, setLenderReviewCount] = useState(0);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!id) {
      toast({
        title: "Error",
        description: "Listing ID is missing.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    fetchListingDetails(id);
  }, [id, navigate, toast]);

  const fetchListingDetails = async (listingId: string) => {
    setIsLoading(true);
    try {
      const { data: listing, error: listingError } = await supabase
        .from('listings')
        .select('*')
        .eq('id', listingId)
        .single();

      if (listingError) throw listingError;
      if (!listing) {
        toast({
          title: "Error",
          description: "Listing not found.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setListingData(listing);

      // Fetch lender details
      if (listing.user_id) {
        const { data: userData, error: userError } = await supabase.auth.admin.getUserById(listing.user_id);
        
        if (userError) {
          console.error("Error fetching user details:", userError);
        } else if (userData) {
          setLenderData(userData.user);
          
          // Fetch lender ratings from a reviews table if it exists
          try {
            // Note: This assumes you have a reviews table - if you don't, this will be handled in the catch block
            const { data: reviews, error: reviewsError } = await supabase
              .from('reviews')
              .select('rating')
              .eq('reviewee_id', listing.user_id);
            
            if (!reviewsError && reviews && reviews.length > 0) {
              const totalRating = reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
              const averageRating = totalRating / reviews.length;
              setLenderRating(averageRating);
              setLenderReviewCount(reviews.length);
            }
          } catch (error) {
            console.error("Error fetching reviews:", error);
            // If there's no reviews table or other error, we'll just use the default values (0)
          }
        }
      }
    } catch (error: any) {
      console.error("Error fetching listing details:", error);
      toast({
        title: "Error",
        description: "Failed to load listing details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (dateRange.from && dateRange.to && listingData) {
      const timeDiff = dateRange.to.getTime() - dateRange.from.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setTotalPrice(daysDiff * listingData.price_per_day);
    } else {
      setTotalPrice(0);
    }
  }, [dateRange, listingData]);

  const handleContactOwner = () => {
    if (!lenderData?.email) {
      toast({
        title: "Error",
        description: "Could not retrieve owner's email.",
        variant: "destructive",
      });
      return;
    }

    window.location.href = `mailto:${lenderData.email}?subject=Enquiry about ${listingData?.title}`;
  };

  const createRental = async () => {
    if (!user || !listingData || !dateRange.from || !dateRange.to) return;

    setIsCreatingRental(true);
    
    try {
      // The rental_code will be auto-generated by the database trigger
      const { data: rentalData, error } = await supabase
        .from('rentals')
        .insert({
          listing_id: listingData.id,
          renter_id: user.id,
          seller_id: listingData.user_id,
          start_date: dateRange.from.toISOString(),
          end_date: dateRange.to.toISOString(),
          total_price: totalPrice,
          currency: "GBP",
          status: "waiting_for_payment"
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Get the auto-generated rental code from the response
      if (rentalData && rentalData.rental_code) {
        setRentalCode(rentalData.rental_code);
        setShowPaymentDialog(true);
      } else {
        throw new Error("Failed to get rental code");
      }
      
    } catch (error: any) {
      console.error("Error creating rental:", error);
      toast({
        title: "Error",
        description: "Failed to create rental. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingRental(false);
    }
  };

  const getUserInitials = (userData: any) => {
    if (!userData) return "?";
    const fullName = userData.user_metadata?.full_name || "";
    if (!fullName) return userData.email?.substring(0, 1).toUpperCase() || "?";
    
    const nameParts = fullName.split(" ");
    if (nameParts.length > 1) {
      return `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase();
    }
    return fullName.substring(0, 1).toUpperCase();
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (!listingData) {
    return <div className="container mx-auto p-4">Listing not found.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{listingData.title}</CardTitle>
          <CardDescription>{listingData.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="aspect-w-4 aspect-h-3">
              <img
                src={listingData.images[0]}
                alt={listingData.title}
                className="object-cover rounded-md"
              />
            </div>
            <div className="space-y-2">
              <p>
                <strong>Category:</strong> {listingData.category}
              </p>
              <p>
                <strong>Location:</strong> {listingData.location}
              </p>
              <p>
                <strong>Price per day:</strong> £{listingData.price_per_day}
              </p>
              
              <Commission listingPrice={listingData.price_per_day} />
            </div>
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList>
              <TabsTrigger value="details" onClick={() => setActiveTab("details")}>Details</TabsTrigger>
              {user && <TabsTrigger value="payment" onClick={() => setActiveTab("payment")}>Payment</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="details">
              <div className="space-y-4">
                <Card>
                  <CardContent>
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="from">Select Dates</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[240px] justify-start text-left font-normal",
                                !dateRange.from && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {dateRange.from ? (
                                dateRange.to ? (
                                  `${dateRange.from?.toLocaleDateString()} - ${dateRange.to?.toLocaleDateString()}`
                                ) : (
                                  dateRange.from?.toLocaleDateString()
                                )
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="center" side="bottom">
                            <Calendar
                              mode="range"
                              defaultMonth={dateRange.from ? dateRange.from : new Date()}
                              selected={dateRange}
                              onSelect={(range) => setDateRange(range || { from: undefined, to: undefined })}
                              numberOfMonths={2}
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      {dateRange.from && dateRange.to && (
                        <div>
                          <Label>Total Price</Label>
                          <Input
                            value={`£${totalPrice.toFixed(2)}`}
                            readOnly
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {lenderData && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Listed by {lenderData.user_metadata?.full_name || "Owner"}</h3>
                    <div className="flex items-center">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={lenderData.user_metadata?.avatar_url} />
                        <AvatarFallback>{getUserInitials(lenderData)}</AvatarFallback>
                      </Avatar>
                      <div className="ml-4">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{lenderRating.toFixed(1)}</span>
                          <span className="text-gray-500">({lenderReviewCount} reviews)</span>
                        </div>
                        <p className="text-sm text-gray-500">Member since {new Date(lenderData.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="payment">
              {showPaymentDialog ? (
                <Card className="bg-green-100 border-green-400">
                  <CardHeader>
                    <CardTitle className="text-green-800">Rental Request Sent!</CardTitle>
                    <CardDescription className="text-green-700">
                      Your rental request has been sent to the lender. Please complete the payment to confirm your booking.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
                        <p className="text-amber-800 font-medium">Important Instructions:</p>
                        <p className="text-amber-700 mt-1 text-sm">
                          1. Click the PayPal button below to make your payment.
                          <br />
                          2. <strong>Include your rental code {rentalCode} in the payment notes.</strong>
                          <br />
                          3. After payment, contact the lender to arrange collection.
                        </p>
                      </div>
                      
                      <div className="flex flex-col gap-4">
                        <PaypalPaymentLink 
                          amount={totalPrice} 
                          currency="GBP"
                          rentalCode={rentalCode}
                        />
                        
                        <Button 
                          variant="outline" 
                          className="flex items-center justify-center gap-2"
                          onClick={handleContactOwner}
                        >
                          <Mail className="h-4 w-4" />
                          Contact {lenderData?.user_metadata?.full_name || "Owner"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Confirm Rental Details</CardTitle>
                    <CardDescription>Please confirm the rental dates and total price before proceeding.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>
                      <strong>Item:</strong> {listingData.title}
                    </p>
                    <p>
                      <strong>Rental Dates:</strong>{" "}
                      {dateRange.from?.toLocaleDateString()} - {dateRange.to?.toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Total Price:</strong> £{totalPrice.toFixed(2)}
                    </p>
                    <Button
                      onClick={createRental}
                      disabled={isCreatingRental || !dateRange.from || !dateRange.to}
                    >
                      {isCreatingRental ? "Creating Rental..." : "Rent This Item"}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ListingDetails;
