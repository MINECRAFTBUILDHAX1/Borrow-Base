
const Insurance = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Insurance & Protection</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            Learn about the protections in place when using BorrowBase to rent or lend items.
          </p>
          
          <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold text-amber-800 mb-2">Important Notice</h2>
            <p className="text-amber-800">
              BorrowBase is currently in beta. While we provide guidance on protecting items during rentals, our full insurance program is under development and will be launched soon.
            </p>
          </div>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Current Protection Measures</h2>
            <p className="mb-4">
              While our full insurance program is in development, we have several measures in place to protect users:
            </p>
            <ul className="list-disc pl-6">
              <li className="mb-2">
                <strong>User Verification:</strong> We verify user identities to ensure accountability.
              </li>
              <li className="mb-2">
                <strong>Secure Payments:</strong> All payments are processed securely through our platform.
              </li>
              <li className="mb-2">
                <strong>User Ratings:</strong> Our review system helps identify reliable users.
              </li>
              <li className="mb-2">
                <strong>Dispute Resolution:</strong> Our support team is available to help resolve issues between users.
              </li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Recommendations for Lenders</h2>
            <p className="mb-4">
              Until our insurance program launches, we recommend lenders take the following precautions:
            </p>
            <ul className="list-disc pl-6">
              <li className="mb-2">Document the condition of your item with photos before lending it out.</li>
              <li className="mb-2">Check if your home or renters insurance covers items while being rented out.</li>
              <li className="mb-2">Consider requiring a security deposit for high-value items (you can arrange this directly with the borrower).</li>
              <li className="mb-2">Provide clear instructions on proper use to prevent damage.</li>
              <li className="mb-2">Verify the borrower's identity before handing over valuable items.</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Recommendations for Borrowers</h2>
            <p className="mb-4">
              To ensure a smooth rental experience and avoid potential issues:
            </p>
            <ul className="list-disc pl-6">
              <li className="mb-2">Inspect items thoroughly before accepting them and document any existing damage.</li>
              <li className="mb-2">Follow all usage guidelines provided by the lender.</li>
              <li className="mb-2">Handle items with care and return them in the same condition you received them.</li>
              <li className="mb-2">Consider obtaining temporary insurance for high-value rentals if appropriate.</li>
            </ul>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Coming Soon: BorrowBase Protection Plan</h2>
            <p className="mb-4">
              We're working on a comprehensive insurance program that will provide:
            </p>
            <ul className="list-disc pl-6">
              <li className="mb-2">Coverage for accidental damage to rented items</li>
              <li className="mb-2">Protection against theft during the rental period</li>
              <li className="mb-2">Liability coverage for certain types of equipment</li>
              <li className="mb-2">Simplified claims process managed through our platform</li>
            </ul>
            <p className="mt-4">
              Sign up for our newsletter to be notified when our full insurance program launches.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Insurance;
