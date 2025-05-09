
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export interface PaymentSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rentalCode: string;
  rentalId: string;
}

const PaymentSuccessDialog = ({
  open,
  onOpenChange,
  rentalCode,
  rentalId,
}: PaymentSuccessDialogProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(rentalCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto">
            <CheckCircle className="h-12 w-12 text-green-500" strokeWidth={1.5} />
          </div>
          <DialogTitle className="text-center text-xl">Payment Initiated</DialogTitle>
          <DialogDescription className="text-center">
            Your booking has been created successfully. Please complete the payment to secure the rental.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <div className="text-center">
            <p className="font-medium text-gray-700">Your rental code</p>
            <div className="mt-1 flex items-center justify-center gap-2">
              <span className="text-2xl font-bold text-brand-purple">{rentalCode}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={copyToClipboard}
                className={copied ? "text-green-500" : ""}
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Please keep this code for reference. You'll need it when collecting the item.
            </p>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-center gap-2">
          <Button 
            asChild
            variant="default"
            className="w-full sm:w-auto"
          >
            <a 
              href={`https://paypal.me/1millionjourney/${rentalCode}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <img 
                src="https://www.paypalobjects.com/webstatic/en_US/i/buttons/PP_logo_h_100x26.png" 
                alt="PayPal" 
                className="h-5"
              />
              Make Payment Now
            </a>
          </Button>
          <Button 
            asChild
            variant="outline"
            className="w-full sm:w-auto"
          >
            <Link to="/messages">View Messages</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSuccessDialog;
