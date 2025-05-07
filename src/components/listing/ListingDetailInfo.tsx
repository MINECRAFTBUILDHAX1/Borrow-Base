
import { MapPin, Tag, User } from "lucide-react";

interface ListingDetailInfoProps {
  listing: {
    title: string;
    location: string;
    category: string;
    description: string;
  };
  sellerProfile: {
    username?: string;
    full_name?: string;
  } | null;
}

const ListingDetailInfo = ({ listing, sellerProfile }: ListingDetailInfoProps) => {
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">{listing.title}</h1>
        <p className="text-gray-500 flex items-center mt-1">
          <MapPin className="h-4 w-4 mr-1" /> 
          {listing.location}
        </p>
        <p className="flex items-center mt-1 text-sm">
          <User className="h-4 w-4 mr-1" /> 
          Listed by {sellerProfile?.username || "Unknown"}
        </p>
      </div>
      
      <div className="flex items-center space-x-2">
        <Tag className="h-4 w-4" />
        <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
          {listing.category}
        </span>
      </div>
      
      <div>
        <h2 className="font-semibold text-lg">Description</h2>
        <p className="mt-2 text-gray-600">{listing.description}</p>
      </div>
    </>
  );
};

export default ListingDetailInfo;
