
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Analytics = () => {
  const [rentals, setRentals] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRentals = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('rentals')
          .select(`
            *,
            listing:listing_id (title),
            renter:renter_id (email, user_metadata)
          `)
          .or(`seller_id.eq.${user.id},renter_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setRentals(data || []);
      } catch (error) {
        console.error("Error fetching rentals:", error);
      }
    };

    fetchRentals();
  }, [user]);

  // Calculate total revenue (85% of rental price for completed rentals where user is seller)
  const totalRevenue = rentals
    .filter(rental => rental.status === 'completed' && rental.seller_id === user?.id)
    .reduce((sum, rental) => sum + (rental.total_price * 0.85), 0);

  const pendingRevenue = rentals
    .filter(rental => rental.status === 'waiting_for_payment' && rental.seller_id === user?.id)
    .reduce((sum, rental) => sum + (rental.total_price * 0.85), 0);

  const completedRentals = rentals.filter(
    rental => rental.status === 'completed' && rental.seller_id === user?.id
  ).length;
  
  const pendingRentals = rentals.filter(
    rental => rental.status === 'waiting_for_payment' && rental.seller_id === user?.id
  ).length;

  const avgRentalValue = completedRentals > 0 ? totalRevenue / completedRentals : 0;

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card className="bg-green-50">
          <CardContent className="p-4">
            <p className="text-sm text-green-600 font-medium">Total Revenue</p>
            <p className="text-2xl font-bold">£{totalRevenue.toFixed(2)}</p>
            <p className="text-xs text-green-500 mt-2">From {completedRentals} rentals</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50">
          <CardContent className="p-4">
            <p className="text-sm text-blue-600 font-medium">Pending Revenue</p>
            <p className="text-2xl font-bold">£{pendingRevenue.toFixed(2)}</p>
            <p className="text-xs text-blue-500 mt-2">From {pendingRentals} pending rentals</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50">
          <CardContent className="p-4">
            <p className="text-sm text-purple-600 font-medium">Average Rental Value</p>
            <p className="text-2xl font-bold">£{avgRentalValue.toFixed(2)}</p>
            <p className="text-xs text-purple-500 mt-2">Per completed rental</p>
          </CardContent>
        </Card>
      </div>

      <div className="border rounded-md overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rental Code</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Renter</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Your Earnings</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rentals.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">No rentals found</TableCell>
              </TableRow>
            ) : (
              rentals.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell className="font-medium">{rental.rental_code}</TableCell>
                  <TableCell>{rental.listing?.title || "Unknown Item"}</TableCell>
                  <TableCell>{rental.renter?.email || "Unknown"}</TableCell>
                  <TableCell>
                    {new Date(rental.start_date).toLocaleDateString()} -
                    {new Date(rental.end_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>£{rental.total_price.toFixed(2)}</TableCell>
                  <TableCell className="font-medium">
                    {rental.seller_id === user?.id ? 
                      `£${(rental.total_price * 0.85).toFixed(2)}` : 
                      "N/A"}
                  </TableCell>
                  <TableCell>{rental.status}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Analytics;
