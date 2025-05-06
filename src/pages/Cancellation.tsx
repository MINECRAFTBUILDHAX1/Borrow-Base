
const Cancellation = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Cancellation Options</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            We understand that plans can change. Here's how our cancellation policy works for both lenders and borrowers.
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">For Borrowers</h2>
            <p className="mb-4">
              If you need to cancel a rental, the refund you'll receive depends on how far in advance you cancel:
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-medium mb-3">Refund Schedule</h3>
              <ul className="list-disc pl-6">
                <li className="mb-2">
                  <strong>More than 7 days before rental start:</strong> 100% refund
                </li>
                <li className="mb-2">
                  <strong>3-7 days before rental start:</strong> 75% refund
                </li>
                <li className="mb-2">
                  <strong>1-2 days before rental start:</strong> 50% refund
                </li>
                <li className="mb-2">
                  <strong>Less than 24 hours before rental start:</strong> No refund
                </li>
              </ul>
            </div>
            
            <p>
              To cancel a reservation, go to your Rentals dashboard, find the rental you wish to cancel, and click the "Cancel Rental" button.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">For Lenders</h2>
            <p className="mb-4">
              As a lender, your reliability is crucial to our platform. If you need to cancel a rental:
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-medium mb-3">Cancellation Consequences</h3>
              <ul className="list-disc pl-6">
                <li className="mb-2">
                  <strong>First cancellation:</strong> Warning
                </li>
                <li className="mb-2">
                  <strong>Second cancellation:</strong> 5% penalty fee on your next 3 rentals
                </li>
                <li className="mb-2">
                  <strong>Frequent cancellations:</strong> Your account may be temporarily limited or suspended
                </li>
              </ul>
            </div>
            
            <p className="mb-4">
              We understand that emergencies happen. If you need to cancel due to extenuating circumstances, please contact our support team with relevant documentation.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Extenuating Circumstances</h2>
            <p className="mb-4">
              Our Extenuating Circumstances Policy may apply in rare cases such as:
            </p>
            <ul className="list-disc pl-6">
              <li className="mb-2">Serious illness or injury</li>
              <li className="mb-2">Death in the immediate family</li>
              <li className="mb-2">Natural disasters or severe weather events</li>
              <li className="mb-2">Urgent government-mandated obligations</li>
            </ul>
            <p>
              If you believe your situation qualifies, please contact support@borrowbase.co.uk with relevant documentation.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
            <p>
              If you have questions about our cancellation policy or need assistance with cancelling a rental, please contact our support team at support@borrowbase.co.uk.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Cancellation;
