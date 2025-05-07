
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, differenceInDays, addDays } from "date-fns";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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

interface RentalSectionProps {
  listing: any;
  userId?: string;
}

const RentalSection = ({ listing, userId }: RentalSectionProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(addDays(new Date(), 3));
  const [paymentDialog, setPaymentDialog] = useState<{
    open: boolean;
    rentalId: string;
    amount: number;
  }>({
    open: false,
    rentalId: "",
    amount: 0,
  });

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

  return (
    <div className="space-y-6">
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
          disabled={userId === listing.user_id}
        >
          {userId === listing.user_id ? "You own this item" : "Rent Now"}
        </Button>
        
        {userId === listing.user_id && (
          <p className="text-center text-sm text-gray-500 mt-2">
            You cannot rent your own item
          </p>
        )}
      </div>

      {paymentDialog.open && (
        <div>
          {/* Payment dialog component would be rendered here */}
        </div>
      )}
    </div>
  );
};

export default RentalSection;
