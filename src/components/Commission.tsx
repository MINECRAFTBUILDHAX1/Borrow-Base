
import React from 'react';

interface CommissionProps {
  listingPrice: number;
}

const Commission: React.FC<CommissionProps> = ({ listingPrice }) => {
  const serviceFee = listingPrice * 0.15;
  const earnings = listingPrice - serviceFee;

  return (
    <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mt-3">
      <p className="font-medium text-sm mb-2">
        BorrowBase charges a 15% service fee on all completed rentals.
      </p>
      <div className="text-sm">
        <div className="flex justify-between mb-1">
          <span>You'll earn:</span>
          <span className="font-medium">£{earnings.toFixed(2)}/day</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Service fee:</span>
          <span>£{serviceFee.toFixed(2)}/day</span>
        </div>
      </div>
    </div>
  );
};

export default Commission;
