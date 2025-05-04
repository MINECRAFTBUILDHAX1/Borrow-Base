
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, MessageCircle, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactSeller: () => void;
  listingTitle: string;
  rentalCode?: string;
}

const PaymentSuccessDialog = ({
  open,
  onOpenChange,
  onContactSeller,
  listingTitle,
  rentalCode
}: PaymentSuccessDialogProps) => {
  const { toast } = useToast();
  
  const copyToClipboard = () => {
    if (rentalCode) {
      navigator.clipboard.writeText(rentalCode);
      toast({
        title: "Copied to clipboard",
        description: "Rental code has been copied to your clipboard",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-2">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <DialogTitle className="text-center">Payment Initiated!</DialogTitle>
          <DialogDescription className="text-center">
            Your payment for "{listingTitle}" has been initiated through PayPal.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
            <p className="font-medium text-amber-800 mb-2">Important:</p>
            <p className="text-amber-700 mb-2">
              Please include your rental code in your PayPal payment note:
            </p>
            {rentalCode && (
              <div className="flex items-center justify-center bg-white p-2 rounded border border-amber-200">
                <span className="font-mono font-bold text-lg">{rentalCode}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyToClipboard} 
                  className="ml-2 h-8 w-8 p-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
            <p className="text-amber-700 mt-2 text-sm">
              Your rental will be confirmed once the payment is verified.
            </p>
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button 
            onClick={onContactSeller} 
            className="w-full sm:w-auto flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Contact Seller Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentSuccessDialog;
