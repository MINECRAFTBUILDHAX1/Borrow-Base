
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { InfoIcon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SettingsBillingInfo = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const hasPaypalEmail = user?.user_metadata?.paypal_email;
  
  return (
    <div className="space-y-6">
      {!hasPaypalEmail && (
        <Alert variant="destructive" className="mb-4">
          <InfoIcon className="h-4 w-4" />
          <AlertTitle>PayPal Email Required</AlertTitle>
          <AlertDescription>
            You need to add your PayPal email address to receive payments when your items are rented.
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => navigate('/settings?tab=profile')}
            >
              Add PayPal Email Now
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <div>
        <h3 className="text-lg font-medium mb-3">How Payments Work</h3>
        <p className="text-sm text-gray-600 mb-2">
          Our platform connects renters directly to lenders through PayPal. Here's how it works:
        </p>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>Renters pay through our secured PayPal integration</li>
          <li>We automatically forward 85% of the payment to your PayPal email within 2 days</li>
          <li>A 15% commission is retained to maintain and improve the platform</li>
        </ul>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-lg font-medium mb-3">Fee Structure</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Lender Receives:</span>
            <span className="font-medium text-green-600">85% of rental price</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-700">Platform Fee:</span>
            <span className="font-medium">15% of rental price</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Fees help us provide secure payments, insurance options, customer support, and platform maintenance.
        </p>
      </div>
      
      {hasPaypalEmail && (
        <>
          <Separator />
          <div>
            <h3 className="text-lg font-medium mb-3">Your PayPal Information</h3>
            <p className="text-sm flex items-center">
              <span className="font-medium">Registered PayPal email:</span>
              <span className="ml-2 text-gray-600">{user.user_metadata.paypal_email}</span>
              <Button 
                variant="ghost" 
                size="sm"
                className="ml-2 h-6 text-xs"
                onClick={() => navigate('/settings?tab=profile')}
              >
                Edit
              </Button>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              All your rental payments will be sent to this email address via PayPal.
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default SettingsBillingInfo;
