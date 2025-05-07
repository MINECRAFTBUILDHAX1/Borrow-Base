
import { useState, useEffect } from "react";
import ListingCard, { ListingProps } from "@/components/ListingCard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import MessagingDialog from "@/components/MessagingDialog";
import { Link } from "react-router-dom";

interface Rental {
  id: string;
  listing_id: string;
  renter_id: string;
  seller_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: string;
  rental_code: string;
  listing: any;
  seller: any;
  seller_profile: {
    username: string;
    full_name?: string;
  };
}

interface RentalsTabProps {
  rentals: ListingProps[];
  userId: string;
}

const RentalsTab = ({ rentals: initialRentals, userId }: RentalsTabProps) => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        if (!user) return;
        
        const { data, error } = await supabase
          .from('rentals')
          .select(`
            *,
            listing:listing_id (
              id, title, images, category, price_per_day, location
            ),
            seller_profile:seller_id (username, full_name)
          `)
          .or(`renter_id.eq.${user.id},seller_id.eq.${user.id}`)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          setRentals(data as any);
        }
      } catch (error) {
        console.error("Error fetching rentals:", error);
        toast({
          title: "Error",
          description: "Failed to load rental history",
          variant: "destructive",
        });
      }
    };

    fetchRentals();
  }, [user, toast]);

  const handleContact = (rental: Rental) => {
    setSelectedRental(rental);
    setContactModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'waiting_for_payment':
        return <Badge className="bg-amber-500">Awaiting Payment</Badge>;
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500">Completed</Badge>;
      case 'canceled':
        return <Badge className="bg-red-500">Canceled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (rentals.length === 0) {
    return <h2 className="text-xl font-semibold mb-4">No rental history yet</h2>;
  }
  
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">
        Rental History ({rentals.length})
      </h2>
      
      <div className="space-y-4">
        {rentals.map((rental) => (
          <div key={rental.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/4">
                {rental.listing?.images?.[0] && (
                  <img 
                    src={rental.listing.images[0]} 
                    alt={rental.listing.title}
                    className="w-full h-40 object-cover rounded-md"
                  />
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-semibold text-lg">{rental.listing?.title}</h3>
                  {getStatusBadge(rental.status)}
                </div>
                <p className="text-sm text-gray-500 mt-1">{rental.listing?.location}</p>
                <div className="mt-2 text-sm">
                  <p><span className="font-medium">Listed by:</span> {rental.seller_profile?.username || "Unknown user"}</p>
                  <p><span className="font-medium">Rental Code:</span> {rental.rental_code}</p>
                  <p><span className="font-medium">Dates:</span> {new Date(rental.start_date).toLocaleDateString()} - {new Date(rental.end_date).toLocaleDateString()}</p>
                  <p><span className="font-medium">Total:</span> £{rental.total_price}</p>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => handleContact(rental)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    {user?.id === rental.renter_id ? 'Contact Lender' : 'Contact Renter'}
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link to={`/listing/${rental.listing_id}`}>View Listing</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selectedRental && (
        <MessagingDialog
          open={contactModalOpen}
          onOpenChange={setContactModalOpen}
          recipientId={user?.id === selectedRental.renter_id ? selectedRental.seller_id : selectedRental.renter_id}
          recipientName={user?.id === selectedRental.renter_id ? selectedRental.seller_profile?.username || "Lender" : "Renter"}
          listingTitle={selectedRental.listing?.title || "Item"}
          afterMessageSent={() => {
            toast({
              title: "Message sent",
              description: "Your message has been sent successfully.",
            });
          }}
          rentalId={selectedRental.id}
        />
      )}
    </>
  );
};

export default RentalsTab;
