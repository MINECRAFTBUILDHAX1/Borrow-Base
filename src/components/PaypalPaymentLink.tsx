import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface PaypalPaymentLinkProps {
  amount: number;
  currency: string;
  rentalCode: string;
  disabled?: boolean;
}

const PaypalPaymentLink = ({ amount, currency, rentalCode, disabled = false }: PaypalPaymentLinkProps) => {
  // Generating the PayPal.me link with the rental code as a note
  const paypalUrl = `https://www.paypal.me/borrowbase/${amount}?note=RentalCode:${rentalCode}`;

  return (
    <Button 
      variant="outline" 
      className="w-full flex items-center justify-center gap-2 bg-[#0070BA] hover:bg-[#005ea6] text-white hover:text-white"
      onClick={() => window.open(paypalUrl, '_blank')}
      disabled={disabled}
    >
      <span>Pay with PayPal</span>
      <ExternalLink className="h-4 w-4" />
      <span className="ml-1 text-xs">({rentalCode})</span>
    </Button>
  );
};

export default PaypalPaymentLink;
