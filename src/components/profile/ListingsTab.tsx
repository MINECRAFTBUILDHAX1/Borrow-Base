
import { Button } from "@/components/ui/button";
import ListingCard, { ListingProps } from "@/components/ListingCard";
import { Link } from "react-router-dom";

interface ListingsTabProps {
  listings: ListingProps[];
  userName: string;
  isOwnProfile: boolean;
  userId: string; // Add userId to associate listings with user
}

const ListingsTab = ({ listings, userName, isOwnProfile, userId }: ListingsTabProps) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">
        {listings.length > 0 
          ? `${userName}'s Items (${listings.length})`
          : "No items listed yet"}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {listings.map((listing: ListingProps) => (
          <ListingCard 
            key={listing.id} 
            {...listing}
            userId={userId} // Pass userId to associate with listings
          />
        ))}
      </div>
      
      {isOwnProfile && (
        <div className="mt-8 text-center">
          <Button asChild>
            <Link to="/create-listing">+ Add New Listing</Link>
          </Button>
        </div>
      )}
    </>
  );
};

export default ListingsTab;
