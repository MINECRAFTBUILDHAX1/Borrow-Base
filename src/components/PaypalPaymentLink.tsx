import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface PaypalPaymentLinkProps {
  amount: number;
  currency: string;
  rentalCode: string;
  disabled?: boolean;
}

const PaypalPaymentLink = ({ amount, currency, rentalCode, disabled = false }: PaypalPaymentLinkProps) => {
  // Ensure amount is properly formatted to 2 decimal places
  const formattedAmount = amount.toFixed(2); // Ensures that we have a value like "9.99" instead of "9.9"

  // PayPal URL: Make sure it's properly formatted
  const paypalDemoUrl = `https://www.paypal.com/paypalme/borrowbase/${formattedAmount}`;

  return (
    <Button 
      variant="outline" 
      className="w-full flex items-center justify-center gap-2 bg-[#0070BA] hover:bg-[#005ea6] text-white hover:text-white"
      onClick={() => window.open(paypalDemoUrl, '_blank')}
      disabled={disabled}
    >
      <span>Pay with PayPal</span>
      <ExternalLink className="h-4 w-4" />
      <span className="ml-1 text-xs">({rentalCode})</span>
    </Button>
  );
};

export default PaypalPaymentLink;
