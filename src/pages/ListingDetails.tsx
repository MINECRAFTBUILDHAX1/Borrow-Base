
import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, differenceInDays, addDays } from "date-fns";
import { CalendarIcon, MapPin, Tag, Star, Info, User } from "lucide-react";

// Generate a random rental code
const generateRentalCode = () => {
  // Generate a random 6-character alphanumeric code
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

const ListingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [listing, setListing] = useState<any>(null);
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(addDays(new Date(), 3));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [paymentDialog, setPaymentDialog] = useState<{
    open: boolean;
    rentalId: string;
    amount: number;
  }>({
    open: false,
    rentalId: "",
    amount: 0,
  });

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('listings')
          .select(`
            *,
            user_profiles:user_id (
              username, 
              avatar_url,
              full_name
            )
          `)
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setListing(data);
          setSellerProfile(data.user_profiles);
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
        toast({
          title: "Error",
          description: "Failed to load listing details",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchListing();
  }, [id, toast]);
  
  // Calculate total price based on selected dates
  const calculateTotalPrice = () => {
    if (!startDate || !endDate || !listing) return 0;
    
    const days = differenceInDays(endDate, startDate) + 1;
    return days * listing.price_per_day;
  };

  // Handle rental creation
  const handleRentNow = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to rent this item",
        variant: "destructive"
      });
      navigate("/auth?redirect=" + encodeURIComponent(location.pathname));
      return;
    }

    if (!listing) return;

    // Calculate the total price
    const totalPrice = calculateTotalPrice();

    try {
      // Create a rental record
      const rentalCode = generateRentalCode();
      
      const { data: rental, error } = await supabase
        .from('rentals')
        .insert({
          listing_id: listing.id,
          renter_id: user.id,
          seller_id: listing.user_id,
          start_date: startDate?.toISOString(),
          end_date: endDate?.toISOString(),
          total_price: totalPrice,
          currency: "GBP",
          status: "waiting_for_payment",
          rental_code: rentalCode
        })
        .select('id')
        .single();

      if (error) throw error;

      // Open the payment dialog
      setPaymentDialog({
        open: true,
        rentalId: rental.id,
        amount: totalPrice,
      });

    } catch (error) {
      console.error("Error creating rental:", error);
      toast({
        title: "Error",
        description: "Failed to create rental. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <p>Loading listing details...</p>
      </div>
    );
  }
  
  if (!listing) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <p>Listing not found</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image gallery */}
        <div>
          {listing.images && listing.images.length > 0 ? (
            <div className="aspect-square rounded-lg overflow-hidden">
              <img
                src={listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
              <p>No image available</p>
            </div>
          )}
        </div>
        
        {/* Listing details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">{listing.title}</h1>
            <p className="text-gray-500 flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" /> 
              {listing.location}
            </p>
            <p className="flex items-center mt-1 text-sm">
              <User className="h-4 w-4 mr-1" /> 
              Listed by {sellerProfile?.username || "Unknown"}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Tag className="h-4 w-4" />
            <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
              {listing.category}
            </span>
          </div>
          
          <div>
            <h2 className="font-semibold text-lg">Description</h2>
            <p className="mt-2 text-gray-600">{listing.description}</p>
          </div>
          
          <div>
            <h2 className="font-semibold text-lg">Rental Period</h2>
            <div className="flex space-x-4 mt-2">
              <div>
                <p className="text-sm text-gray-500 mb-1">Start Date</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">End Date</p>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => 
                        date < new Date() || 
                        (startDate && date < startDate)
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <p className="font-medium">Price per day</p>
              <p className="font-semibold">£{listing.price_per_day}</p>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <p className="font-medium">Total</p>
              <p className="text-xl font-bold">£{calculateTotalPrice()}</p>
            </div>
            
            <Button 
              className="w-full mt-4" 
              size="lg"
              onClick={handleRentNow}
              disabled={user?.id === listing.user_id}
            >
              {user?.id === listing.user_id ? "You own this item" : "Rent Now"}
            </Button>
            
            {user?.id === listing.user_id && (
              <p className="text-center text-sm text-gray-500 mt-2">
                You cannot rent your own item
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Payment Dialog would be imported and used here */}
      {paymentDialog.open && (
        <div>
          {/* Payment dialog component would be rendered here */}
        </div>
      )}
    </div>
  );
};

export default ListingDetails;
