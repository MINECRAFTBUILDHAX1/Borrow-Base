
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const SettingsBillingInfo = () => {
  return (
    <div className="space-y-4">
      <Alert className="bg-amber-50 border-amber-200">
        <AlertCircle className="h-5 w-5 text-amber-800" />
        <AlertTitle className="text-amber-800 font-medium">Payment Information</AlertTitle>
        <AlertDescription className="text-amber-700">
          BorrowBase uses PayPal for all rental payments. You'll receive 85% of the rental amount 
          within 2 days after the item is successfully rented.
        </AlertDescription>
      </Alert>
      
      <div>
        <h3 className="font-medium mb-2">Fee Structure</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>BorrowBase takes a <strong>15% commission</strong> on each rental transaction</li>
          <li><strong>85% of the rental amount</strong> is sent to your PayPal account</li>
          <li>Payments are processed via PayPal.me/1millionjourney</li>
          <li>Payments are processed in <strong>GBP</strong> by default</li>
          <li>There are no fees to list your items on the platform</li>
        </ul>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="font-medium mb-2">Example Calculation</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p>Item rental price: <strong>£100</strong></p>
          <p>BorrowBase fee (15%): <strong>£15</strong></p>
          <p>You receive: <strong>£85</strong></p>
          <p className="text-sm text-muted-foreground mt-2">Payment will be sent to your PayPal email address within 2 days of completed rental.</p>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-2">Payment Processing</h3>
        <p className="text-gray-700">Make sure you've added your PayPal email address in your profile settings to receive payments.</p>
        <div className="flex items-center mt-3">
          <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg" alt="PayPal" className="h-8" />
        </div>
      </div>
    </div>
  );
};

export default SettingsBillingInfo;
