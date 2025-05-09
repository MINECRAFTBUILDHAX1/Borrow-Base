
import { Button } from "@/components/ui/button";
import ListingCard, { ListingProps } from "@/components/ListingCard";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ListingsTabProps {
  listings: ListingProps[];
  userName: string;
  isOwnProfile: boolean;
  userId: string;
}

const ListingsTab = ({ listings: initialListings, userName, isOwnProfile, userId }: ListingsTabProps) => {
  const [listings, setListings] = useState<ListingProps[]>(initialListings);
  const { toast } = useToast();
  
  // Fetch listings from Supabase for this specific user
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('user_id', userId);
          
        if (error) throw error;
        
        if (data) {
          const formattedListings = data.map(item => ({
            id: item.id,
            title: item.title,
            price: item.price_per_day,
            priceUnit: 'day' as const,
            imageUrl: item.images?.[0] || 'https://via.placeholder.com/300',
            location: item.location,
            category: item.category,
            userId: item.user_id
          }));
          
          setListings(formattedListings);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
        toast({
          title: "Error",
          description: "Failed to load listings data",
          variant: "destructive",
        });
      }
    };

    if (userId) {
      fetchListings();
    }
  }, [userId, toast]);

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
            userId={userId}
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
