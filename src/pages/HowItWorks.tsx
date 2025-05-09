
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const HowItWorks = () => {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">How It Works</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Borrowing and lending made easy. Follow these simple steps to get started.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-brand-purple">1</span>
              Create an account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Sign up with your email. Verify your account and complete your profile to start using the platform.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-brand-purple">2</span>
              Browse listings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Search for items you need by location, category, and availability. Check reviews and item descriptions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-brand-purple">3</span>
              Contact the lender
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Use the "Contact Lender" button to send an email directly to the item owner. Your default email client will open with a pre-populated message.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-brand-purple">4</span>
              Select dates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Once you've discussed availability with the lender via email, select the dates you want to rent the item for.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-brand-purple">5</span>
              Make payment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Pay securely through our platform. Once payment is confirmed, you'll receive a rental code to share with the lender.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-brand-purple">6</span>
              Meet and exchange
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Meet the lender at the agreed location, verify the item condition, and share your rental code to confirm the exchange.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="max-w-3xl mx-auto bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Listing Your Items</h2>
        <ol className="space-y-4">
          <li className="flex">
            <span className="bg-brand-purple text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">1</span>
            <p>Click the "Create Listing" button in the navigation bar.</p>
          </li>
          <li className="flex">
            <span className="bg-brand-purple text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">2</span>
            <p>Add photos, details, pricing, and availability for your item.</p>
          </li>
          <li className="flex">
            <span className="bg-brand-purple text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">3</span>
            <p>Set any specific rules or requirements for borrowers.</p>
          </li>
          <li className="flex">
            <span className="bg-brand-purple text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">4</span>
            <p>Publish your listing and wait for potential borrowers to contact you via email.</p>
          </li>
          <li className="flex">
            <span className="bg-brand-purple text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">5</span>
            <p>When borrowers contact you, communicate through email to arrange the details.</p>
          </li>
          <li className="flex">
            <span className="bg-brand-purple text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">6</span>
            <p>Meet the borrower, verify their rental code, and hand over your item.</p>
          </li>
        </ol>
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
        <p className="mb-6">Check out our FAQ or contact our support team</p>
        <div className="flex justify-center space-x-4">
          <a href="/help-center" className="bg-brand-purple text-white px-6 py-2 rounded-md hover:bg-brand-purple-dark transition-colors">
            Help Center
          </a>
          <a href="/contact" className="border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-100 transition-colors">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
