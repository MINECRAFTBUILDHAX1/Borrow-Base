
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Calendar as CalendarIcon, MessageCircle, Mail, ShieldCheck } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";

interface RentalSectionProps {
  listing: {
    price_per_day: number;
    security_deposit: number | null;
    title: string;
  };
  email: string | null;
  startDate: Date | null;
  endDate: Date | null;
  totalPrice: number | null;
  handleDateSelect: (date: Date | undefined) => void;
  isDateDisabled: (date: Date) => boolean;
  handlePaymentInitiate: () => void;
  rentalCode?: string | null;
}

const RentalSection = ({
  listing,
  email,
  startDate,
  endDate,
  totalPrice,
  handleDateSelect,
  isDateDisabled,
  handlePaymentInitiate,
  rentalCode
}: RentalSectionProps) => {
  // Add safety check for listing
  if (!listing) {
    return (
      <div className="sticky top-20">
        <Card>
          <CardContent className="p-6">
            <p>Loading listing details...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const days = startDate && endDate ? 
    Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1 : 0;

  

  return (
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
                      onSelect={handleDateSelect}
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
                      onSelect={handleDateSelect}
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
                {days > 0 && (
                  <p className="text-xs text-gray-500">
                    For {days} days
                  </p>
                )}
                {rentalCode && (
                  <p className="mt-2 text-sm font-medium text-center text-brand-purple">
                    Your rental code: {rentalCode}
                  </p>
                )}
              </div>
            )}
            
            {listing.security_deposit && listing.security_deposit > 0 && (
              <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">£{listing.security_deposit} security deposit</p>
                  <p className="text-xs text-gray-600">Will be refunded after successful return</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Contact Lender button - always visible */}
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 mb-3" 
            onClick={handleContactOwner}
          >
            <Mail className="h-4 w-4" />
            Contact Lender via Email
          </Button>
          
          {/* Payment link - only show if dates are selected */}
          {startDate && endDate && totalPrice ? (
            <div className="mb-3">
              {rentalCode ? (
                <a 
                  href={`https://paypal.me/1millionjourney/${totalPrice}`}
                  className="bg-[#0070BA] hover:bg-[#003087] text-white font-medium py-2 px-4 rounded flex items-center justify-center"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <img 
                    src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png" 
                    alt="PayPal" 
                    className="h-5 mr-2"
                  />
                  Pay with PayPal (GBP {totalPrice.toFixed(2)})
                  <span className="ml-2 text-sm bg-white/20 px-1 rounded">{rentalCode}</span>
                </a>
              ) : (
                <Button 
                  className="w-full bg-[#0070BA] hover:bg-[#003087] text-white"
                  onClick={handlePaymentInitiate}
                >
                  <img 
                    src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png" 
                    alt="PayPal" 
                    className="h-5 mr-2"
                  />
                  Reserve Now (GBP {totalPrice.toFixed(2)})
                </Button>
              )}
            </div>
          ) : (
            <div className="mb-3 text-center p-2 bg-amber-50 text-amber-700 rounded-lg text-sm">
              Please select start and end dates to proceed with payment
            </div>
          )}
          
          <p className="text-xs text-center mt-4 text-gray-500">
            85% of the payment goes to the lender within 2 days of rental start
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RentalSection;
