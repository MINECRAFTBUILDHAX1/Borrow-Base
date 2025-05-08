
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

interface RentalDateRange {
  start: Date;
  end: Date;
}

interface ListingDetailInfoProps {
  description: string;
  features: string[];
  rules: string[];
  bookedRanges: RentalDateRange[];
}

const ListingDetailInfo = ({ 
  description, 
  features, 
  rules, 
  bookedRanges 
}: ListingDetailInfoProps) => {
  return (
    <>
      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold mb-3">About this item</h2>
        <p className="text-gray-700">{description}</p>
      </div>
      
      {/* Features */}
      {features && features.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Features</h2>
          <ul className="grid grid-cols-2 gap-2">
            {features.map((feature: string, index: number) => (
              <li key={index} className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-purple mr-2"></div>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Rules */}
      {rules && rules.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Rules</h2>
          <ul className="space-y-2">
            {rules.map((rule: string, index: number) => (
              <li key={index} className="flex items-center">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-purple mr-2"></div>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Booked dates */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Availability</h2>
        {bookedRanges.length > 0 ? (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Booked Dates:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {bookedRanges.map((range, index) => (
                <div key={index} className="bg-red-50 text-red-600 px-2 py-1 rounded text-sm">
                  {format(range.start, 'MMM dd')} - {format(range.end, 'MMM dd, yyyy')}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-green-600">All dates currently available!</p>
        )}
      </div>
    </>
  );
};

export default ListingDetailInfo;
