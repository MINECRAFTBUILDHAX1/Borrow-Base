
const HelpCenter = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Help Center</h1>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-xl font-medium mb-2">How does BorrowBase work?</h3>
              <p>
                BorrowBase is a platform that connects people who have items to rent out with those who want to borrow them. Lenders list their items with photos and descriptions, and borrowers can search for items they need and arrange rentals through our secure platform.
              </p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="text-xl font-medium mb-2">How do I list an item?</h3>
              <p>
                To list an item, create an account and click "List Your Item" in the navigation menu. Fill out the listing form with details about your item, upload photos, set your price, and specify availability. Once submitted, your listing will be live on the platform for borrowers to find.
              </p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="text-xl font-medium mb-2">How do payments work?</h3>
              <p>
                When a borrower requests to rent your item, they'll make a payment through our secure payment system. The platform holds the payment until the rental is complete. Once the rental period ends and the item is returned in good condition, the payment (minus our 15% service fee) is released to the lender's account.
              </p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="text-xl font-medium mb-2">What if an item is damaged during rental?</h3>
              <p>
                We recommend that lenders and borrowers thoroughly document the condition of items before and after rental. If an item is damaged, the lender should contact BorrowBase Support at <a href="mailto:support@borrowbase.co.uk?subject=BorrowBase Support Query" className="font-semibold text-blue-600 underline">support@borrowbase.co.uk</a>to resolve the issue. If an agreement can't be reached, contact our support team for assistance.
              </p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="text-xl font-medium mb-2">How do I cancel a rental?</h3>
              <p>
                If you need to cancel a rental, you can do so by emailing support at <a href="mailto:support@borrowbase.co.uk?subject=BorrowBase Support Query" className="font-semibold text-blue-600 underline">support@borrowbase.co.uk</a> (Please note that cancellation policies vary depending on how close to the rental period you cancel. For more information, see our Cancellation Policy page.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
          <p className="mb-4">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="mailto:support@borrowbase.co.uk?subject=BorrowBase Support Query" className="px-4 py-2 bg-brand-purple text-white rounded hover:bg-brand-purple/90">
             Support Email: support@borrowbase.co.uk
            </a>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Support hours: Monday-Friday, 9am-5pm GMT
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
