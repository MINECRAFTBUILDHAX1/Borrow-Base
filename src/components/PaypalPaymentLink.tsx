
import { useEffect, useState } from "react";

interface PaypalPaymentLinkProps {
  amount: number;
  currency?: "GBP" | "USD" | "EUR";
  rentalCode?: string;
}

const PaypalPaymentLink = ({ amount, currency = "GBP", rentalCode }: PaypalPaymentLinkProps) => {
  const [paymentUrl, setPaymentUrl] = useState("");
  
  useEffect(() => {
    // Format amount to ensure it has 2 decimal places
    const formattedAmount = amount.toFixed(2);
    setPaymentUrl(`https://paypal.me/1millionjourney/${formattedAmount}`);
  }, [amount]);

  return (
    <a 
      href={paymentUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="bg-[#0070BA] hover:bg-[#003087] text-white font-medium py-2 px-4 rounded flex items-center justify-center"
    >
      <img 
        src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png" 
        alt="PayPal" 
        className="h-5 mr-2"
      />
      Pay with PayPal ({currency} {amount.toFixed(2)})
      {rentalCode && <span className="ml-2 text-sm bg-white/20 px-1 rounded">{rentalCode}</span>}
    </a>
  );
};

export default PaypalPaymentLink;
