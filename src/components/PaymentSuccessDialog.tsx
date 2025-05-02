
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
import { CheckCircle2, MessageCircle } from "lucide-react";

interface PaymentSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContactSeller: () => void;
  listingTitle: string;
}

const PaymentSuccessDialog = ({
  open,
  onOpenChange,
  onContactSeller,
  listingTitle
}: PaymentSuccessDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-2">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <DialogTitle className="text-center">Payment Successful!</DialogTitle>
          <DialogDescription className="text-center">
            Your payment for "{listingTitle}" has been processed successfully.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
            <p className="font-medium text-amber-800 mb-2">Next Steps:</p>
            <p className="text-amber-700">
              Please contact the seller now to arrange pickup or delivery details for your rental.
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
