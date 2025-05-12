
const SafetyInfo = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Safety Information</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            At BorrowBase, your safety is our top priority. Here are some guidelines and tips to ensure a safe and positive experience on our platform.
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">For All Users</h2>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">
                <strong>Verify profiles and reviews:</strong> Check user profiles and reviews before arranging rentals.
              </li>
              <li className="mb-2">
                <strong>Communicate through our platform:</strong> Keep all communication on BorrowBase for a record of your conversations.
              </li>
              <li className="mb-2">
                <strong>Meet in safe, public places:</strong> When arranging item pickup or dropoff, meet in well-lit, public locations.
              </li>
              <li className="mb-2">
                <strong>Document item condition:</strong> Take photos before and after the rental period to document the item's condition.
              </li>
              <li className="mb-2">
                <strong>Trust your instincts:</strong> If something feels wrong or too good to be true, it probably is.
              </li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">For Lenders</h2>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">
                <strong>Provide clear instructions:</strong> Include detailed usage instructions with your items to prevent misuse.
              </li>
              <li className="mb-2">
                <strong>Set clear expectations:</strong> Clearly communicate your expectations regarding item care and return.
              </li>
              <li className="mb-2">
                <strong>Check ID:</strong> Consider verifying the borrower's identity before handing over valuable items.
              </li>
              <li className="mb-2">
                <strong>Inspect items upon return:</strong> Promptly check items when they're returned to identify any damage.
              </li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">For Borrowers</h2>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-2">
                <strong>Inspect before accepting:</strong> Check items thoroughly before accepting them to ensure they match the listing description and are in good condition.
              </li>
              <li className="mb-2">
                <strong>Follow usage guidelines:</strong> Use items only as intended and follow any instructions provided by the lender.
              </li>
              <li className="mb-2">
                <strong>Return on time:</strong> Always return items at the agreed-upon time and in the same condition you received them.
              </li>
              <li className="mb-2">
                <strong>Report issues promptly:</strong> If you encounter any problems with a rented item, inform our support team immediately at: support@borrowbase.co.uk 
              </li>
            </ul>
          </section>
          
          <section className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold mb-4">Reporting Safety Concerns</h2>
            <p className="mb-4">
              If you ever feel unsafe or encounter suspicious behavior on our platform, please report it immediately. We take all safety concerns seriously and will investigate promptly.
            </p>
            <p>
              Contact our safety team at support@borrowbase.co.uk
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SafetyInfo;
