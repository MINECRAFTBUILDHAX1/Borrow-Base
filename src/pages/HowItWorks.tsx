
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">How BorrowBase Works</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-8">
            BorrowBase makes borrowing and lending simple, secure, and convenient. Here's how our platform works for both lenders and borrowers.
          </p>
          
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-6">For Borrowers</h2>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-purple text-white flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="text-xl font-medium">Search for Items</h3>
                  <p className="text-gray-600">Browse our extensive catalog to find the item you need. Filter by category, location, and availability to narrow down your options.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-purple text-white flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="text-xl font-medium">Request to Borrow</h3>
                  <p className="text-gray-600">Select your rental dates and submit a request to the lender. You can communicate directly to ask questions or discuss details.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-purple text-white flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="text-xl font-medium">Pay Securely</h3>
                  <p className="text-gray-600">Once your request is approved, make a secure payment through our platform. Your payment is held safely until the rental is complete.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-purple text-white flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 className="text-xl font-medium">Arrange Collection</h3>
                  <p className="text-gray-600">Coordinate with the lender to collect the item. Check that everything is as described before taking it home.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-purple text-white flex items-center justify-center font-bold">5</div>
                <div>
                  <h3 className="text-xl font-medium">Return & Review</h3>
                  <p className="text-gray-600">Return the item in the same condition as you received it. Leave a review about your experience to help the community.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-6">For Lenders</h2>
            
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="text-xl font-medium">List Your Items</h3>
                  <p className="text-gray-600">Create detailed listings with photos, descriptions, and pricing for the items you want to rent out.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="text-xl font-medium">Approve Requests</h3>
                  <p className="text-gray-600">Review rental requests and communicate with potential borrowers. Accept requests from users you feel comfortable lending to.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="text-xl font-medium">Arrange Handover</h3>
                  <p className="text-gray-600">Coordinate the collection of your item and provide any necessary instructions on its use.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 className="text-xl font-medium">Get Paid</h3>
                  <p className="text-gray-600">Once the rental period is complete and the item is returned in good condition, the payment is released to your account.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <h3 className="text-xl font-semibold mb-4">Ready to get started?</h3>
            <div className="flex justify-center gap-4">
              <Link to="/explore">
                <Button>
                  Find Items to Borrow
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              
              <Link to="/create-listing">
                <Button variant="outline">
                  List Your Item
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
