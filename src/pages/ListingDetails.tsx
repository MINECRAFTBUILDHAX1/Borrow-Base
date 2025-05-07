
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ImageGallery from "@/components/listing/ImageGallery";
import ListingDetailInfo from "@/components/listing/ListingDetailInfo";
import RentalSection from "@/components/listing/RentalSection";

const ListingDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [listing, setListing] = useState<any>(null);
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        // Remove the join with user_profiles since that relationship doesn't exist
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setListing(data);
          // Since we don't have user_profiles, let's set a default seller profile
          setSellerProfile({ username: "User" });
          console.log("Listing data:", data);
        }
      } catch (error: any) {
        console.error("Error fetching listing:", error);
        toast({
          title: "Error",
          description: "Failed to load listing details",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchListing();
  }, [id, toast]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <p>Loading listing details...</p>
      </div>
    );
  }
  
  if (!listing) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <p>Listing not found</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image gallery */}
        <div>
          <ImageGallery images={listing.images} title={listing.title} />
        </div>
        
        {/* Listing details */}
        <div className="space-y-6">
          <ListingDetailInfo listing={listing} sellerProfile={sellerProfile} />
          <RentalSection listing={listing} userId={user?.id} />
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
