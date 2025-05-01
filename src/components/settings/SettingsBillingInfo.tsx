
import { Separator } from "@/components/ui/separator";

const SettingsBillingInfo = () => {
  return (
    <div className="space-y-4">
      <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
        <h3 className="font-medium text-amber-800">Service Fee Information</h3>
        <p className="text-amber-700 mt-1">BorrowBase charges a 15% commission fee on all completed rentals. This fee helps us maintain the platform and provide secure transactions.</p>
      </div>
      
      <div>
        <h3 className="font-medium mb-2">Fee Structure</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>BorrowBase collects a <strong>15% commission</strong> from each rental transaction</li>
          <li>The remaining 85% goes directly to the item owner</li>
          <li>Transaction fees cover payment processing, insurance and platform maintenance</li>
          <li>There are no fees to list your items on the platform</li>
        </ul>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="font-medium mb-2">Example Calculation</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <p>Item rental price: <strong>$100</strong></p>
          <p>BorrowBase fee (15%): <strong>$15</strong></p>
          <p>Owner receives: <strong>$85</strong></p>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-2">Payment Processing</h3>
        <p className="text-gray-700">BorrowBase uses Stripe for secure payment processing. When a rental is completed, payments are transferred to your account.</p>
        <div className="flex items-center mt-2">
          <img src="https://cdn.sanity.io/images/6g712gwd/production/fba390709c48f6aa563e966dd12b93209494ceee-184x42.svg" alt="Stripe" className="h-8" />
        </div>
      </div>
    </div>
  );
};

export default SettingsBillingInfo;
