
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

interface CommissionProps {
  variant?: "full" | "compact";
  listingPrice?: number;
}

const Commission = ({ variant = "full", listingPrice }: CommissionProps) => {
  const [sellerEarnings, setSellerEarnings] = useState<number | null>(null);
  const commissionRate = 0.15; // 15%

  useEffect(() => {
    if (listingPrice) {
      const commission = listingPrice * commissionRate;
      setSellerEarnings(listingPrice - commission);
    } else {
      setSellerEarnings(null);
    }
  }, [listingPrice]);

  if (variant === "compact") {
    return (
      <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
        <p className="text-sm text-amber-800">BorrowBase charges a 15% service fee on all completed rentals.</p>
        
        {listingPrice && (
          <div className="mt-2 pt-2 border-t border-amber-200">
            <p className="text-xs text-amber-800">
              <span className="font-medium">For this price (${listingPrice}/day):</span>
            </p>
            <p className="text-xs text-amber-700">
              • You'll earn: ${sellerEarnings?.toFixed(2)}/day
            </p>
            <p className="text-xs text-amber-700">
              • Service fee: ${(listingPrice * commissionRate).toFixed(2)}/day
            </p>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
      <h3 className="font-medium text-amber-800 mb-1">Service Fee Information</h3>
      <p className="text-amber-700 text-sm mb-4">BorrowBase charges a 15% commission fee on all completed rentals. This fee helps us maintain the platform and provide secure transactions.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-sm mb-1">For Lenders</h4>
          <p className="text-xs text-amber-700">You receive 85% of the rental price directly to your account after the rental is completed.</p>
          
          {listingPrice && (
            <div className="mt-2 p-2 bg-amber-100 rounded-md">
              <p className="text-xs font-medium text-amber-800">
                Example for ${listingPrice}/day:
              </p>
              <p className="text-xs text-amber-700">
                • You'll earn: ${sellerEarnings?.toFixed(2)}/day
              </p>
              <p className="text-xs text-amber-700">
                • Service fee: ${(listingPrice * commissionRate).toFixed(2)}/day
              </p>
            </div>
          )}
        </div>
        
        <div>
          <h4 className="font-medium text-sm mb-1">For Borrowers</h4>
          <p className="text-xs text-amber-700">The price you see is the total price including all fees and services.</p>
        </div>
      </div>
      
      <div className="mt-3">
        <Link to="/settings?tab=billing">
          <Button variant="link" size="sm" className="text-amber-800 p-0 h-auto">
            Learn more about our fees
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Commission;
