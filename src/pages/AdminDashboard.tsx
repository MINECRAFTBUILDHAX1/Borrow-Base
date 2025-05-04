
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

interface Rental {
  id: string;
  rental_code: string;
  renter_id: string;
  seller_id: string;
  listing_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  currency: string;
  status: string;
  payment_note: string | null;
  created_at: string;
}

const AdminDashboard = () => {
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Check if the current user is an admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('user_id')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error("Error checking admin status:", error);
          setIsAdmin(false);
        } else {
          setIsAdmin(Boolean(data));
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  // Fetch rentals data
  useEffect(() => {
    if (isAdmin) {
      fetchRentals();
    }
  }, [isAdmin]);

  const fetchRentals = async () => {
    try {
      let query = supabase
        .from('rentals')
        .select(`
          *,
          listing:listing_id (title),
          renter:renter_id (email),
          seller:seller_id (email)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }

      if (searchQuery) {
        query = query.ilike('rental_code', `%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setRentals(data as any);
    } catch (error) {
      console.error("Error fetching rentals:", error);
      toast({
        title: "Error",
        description: "Failed to load rental data",
        variant: "destructive",
      });
    }
  };

  const updateRentalStatus = async (rentalId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('rentals')
        .update({ status: newStatus })
        .eq('id', rentalId);

      if (error) throw error;

      setRentals(rentals.map(rental => 
        rental.id === rentalId 
          ? { ...rental, status: newStatus }
          : rental
      ));

      toast({
        title: "Status updated",
        description: `Rental ${rentalId} status updated to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating rental status:", error);
      toast({
        title: "Update failed",
        description: "Failed to update rental status",
        variant: "destructive",
      });
    }
  };

  const handleSearch = () => {
    fetchRentals();
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

  if (isLoading) {
    return <div className="container mx-auto py-8 px-4 text-center">Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="mb-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Rental Management</h2>
        
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <div className="flex gap-2">
              <Input
                placeholder="Search by rental code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-1" />
                Search
              </Button>
            </div>
          </div>
          
          <div className="md:w-64">
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setTimeout(() => fetchRentals(), 100);
              }}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>{statusFilter || 'Filter by status'}</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All statuses</SelectItem>
                <SelectItem value="waiting_for_payment">Awaiting Payment</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rental Code</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Renter</TableHead>
                <TableHead>Lender</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rentals.length > 0 ? (
                rentals.map((rental) => (
                  <TableRow key={rental.id}>
                    <TableCell className="font-medium">{rental.rental_code}</TableCell>
                    <TableCell>{(rental as any).listing?.title || 'Unknown'}</TableCell>
                    <TableCell>{(rental as any).renter?.email || rental.renter_id}</TableCell>
                    <TableCell>{(rental as any).seller?.email || rental.seller_id}</TableCell>
                    <TableCell>
                      {new Date(rental.start_date).toLocaleDateString()} to {new Date(rental.end_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {rental.currency} {rental.total_price}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(rental.status)}
                    </TableCell>
                    <TableCell>
                      {new Date(rental.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={rental.status}
                        onValueChange={(value) => updateRentalStatus(rental.id, value)}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="waiting_for_payment">Awaiting Payment</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="canceled">Canceled</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    No rentals found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
