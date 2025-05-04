
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Admin login credentials - hardcoded for now, in a real app these would be in a database
const ADMIN_EMAIL = "admin@borrowbase.com";
const ADMIN_PASSWORD = "admin123";

const AdminDashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [rentals, setRentals] = useState<any[]>([]);
  const [filteredRentals, setFilteredRentals] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchCode, setSearchCode] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if the user is an admin when component mounts
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('admin_users')
        .select()
        .eq('user_id', user.id)
        .single();
      
      if (data) {
        setIsAdmin(true);
        setIsLoggedIn(true); // Auto-login for admin users
        fetchRentals();
      }
    };
    
    checkAdminStatus();
  }, [user]);
  
  const handleLogin = () => {
    setLoading(true);
    
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      fetchRentals();
      toast({
        title: "Admin logged in",
        description: "Welcome to the admin dashboard",
      });
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
    
    setLoading(false);
  };
  
  const fetchRentals = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('rentals')
        .select(`
          *,
          listing:listing_id (title, price_per_day, images),
          renter:renter_id (email, user_metadata),
          seller:seller_id (email, user_metadata)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setRentals(data);
        setFilteredRentals(data);
      }
    } catch (error) {
      console.error("Error fetching rentals:", error);
      toast({
        title: "Error",
        description: "Failed to load rentals data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleFilter = (status: string) => {
    setFilterStatus(status);
    
    if (status === 'all') {
      setFilteredRentals(rentals);
    } else {
      const filtered = rentals.filter(rental => rental.status === status);
      setFilteredRentals(filtered);
    }
  };
  
  const handleSearch = () => {
    if (!searchCode.trim()) {
      setFilteredRentals(rentals);
      return;
    }
    
    const filtered = rentals.filter(rental => 
      rental.rental_code.toLowerCase().includes(searchCode.toLowerCase())
    );
    setFilteredRentals(filtered);
  };
  
  const updateRentalStatus = async (rentalId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('rentals')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', rentalId);
      
      if (error) throw error;
      
      // Update local state
      const updatedRentals = rentals.map(rental => 
        rental.id === rentalId ? { ...rental, status: newStatus } : rental
      );
      setRentals(updatedRentals);
      
      // Apply current filters
      handleFilter(filterStatus);
      
      toast({
        title: "Status updated",
        description: `Rental status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating rental status:", error);
      toast({
        title: "Error",
        description: "Failed to update rental status",
        variant: "destructive",
      });
    }
  };
  
  if (!isLoggedIn) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@borrowbase.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
              
              <Alert className="mt-4">
                <AlertTitle>Demo Credentials</AlertTitle>
                <AlertDescription>
                  Email: admin@borrowbase.com<br/>
                  Password: admin123
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Rentals Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-md text-center">
                <p className="text-sm text-gray-500">Total Rentals</p>
                <p className="text-2xl font-bold">{rentals.length}</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-md text-center">
                <p className="text-sm text-amber-600">Awaiting Payment</p>
                <p className="text-2xl font-bold text-amber-600">
                  {rentals.filter(r => r.status === 'waiting_for_payment').length}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-md text-center">
                <p className="text-sm text-green-600">Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  {rentals.filter(r => r.status === 'paid').length}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-md text-center">
                <p className="text-sm text-blue-600">Completed</p>
                <p className="text-2xl font-bold text-blue-600">
                  {rentals.filter(r => r.status === 'completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:max-w-xs">
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Total Revenue (Paid)</p>
                <p className="text-2xl font-bold">
                  £{rentals
                    .filter(r => r.status === 'paid' || r.status === 'completed')
                    .reduce((sum, rental) => sum + Number(rental.total_price), 0)
                    .toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Platform Fees (15%)</p>
                <p className="text-xl font-medium">
                  £{(rentals
                    .filter(r => r.status === 'paid' || r.status === 'completed')
                    .reduce((sum, rental) => sum + Number(rental.total_price), 0) * 0.15)
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Manage Rentals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Button 
                  variant={filterStatus === "all" ? "default" : "outline"}
                  onClick={() => handleFilter('all')}
                >
                  All
                </Button>
                <Button 
                  variant={filterStatus === "waiting_for_payment" ? "default" : "outline"}
                  onClick={() => handleFilter('waiting_for_payment')}
                  className="bg-amber-500 hover:bg-amber-600"
                >
                  Awaiting Payment
                </Button>
                <Button 
                  variant={filterStatus === "paid" ? "default" : "outline"}
                  onClick={() => handleFilter('paid')}
                  className="bg-green-500 hover:bg-green-600"
                >
                  Paid
                </Button>
                <Button 
                  variant={filterStatus === "completed" ? "default" : "outline"}
                  onClick={() => handleFilter('completed')}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Completed
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Search by rental code"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
              />
              <Button onClick={handleSearch}>Search</Button>
            </div>
            
            <Button onClick={fetchRentals} variant="outline">
              Refresh
            </Button>
          </div>
          
          <div className="border rounded-md overflow-auto">
            <Table>
              <TableCaption>List of all rentals</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Rental Code</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead>Renter</TableHead>
                  <TableHead>Lender</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRentals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">No rentals found</TableCell>
                  </TableRow>
                ) : (
                  filteredRentals.map((rental) => (
                    <TableRow key={rental.id}>
                      <TableCell className="font-medium">{rental.rental_code}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {rental.listing?.images?.[0] && (
                            <img 
                              src={rental.listing.images[0]} 
                              alt={rental.listing.title} 
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          <span>{rental.listing?.title || "Unknown Item"}</span>
                        </div>
                      </TableCell>
                      <TableCell>{rental.renter?.email || "Unknown"}</TableCell>
                      <TableCell>{rental.seller?.email || "Unknown"}</TableCell>
                      <TableCell>
                        {new Date(rental.start_date).toLocaleDateString()} - 
                        {new Date(rental.end_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>£{rental.total_price}</TableCell>
                      <TableCell>
                        {rental.status === 'waiting_for_payment' && (
                          <Badge className="bg-amber-500">Awaiting Payment</Badge>
                        )}
                        {rental.status === 'paid' && (
                          <Badge className="bg-green-500">Paid</Badge>
                        )}
                        {rental.status === 'completed' && (
                          <Badge className="bg-blue-500">Completed</Badge>
                        )}
                        {rental.status === 'canceled' && (
                          <Badge className="bg-red-500">Canceled</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {rental.status === 'waiting_for_payment' && (
                            <Button 
                              size="sm" 
                              className="bg-green-500 hover:bg-green-600"
                              onClick={() => updateRentalStatus(rental.id, 'paid')}
                            >
                              Mark Paid
                            </Button>
                          )}
                          {rental.status === 'paid' && (
                            <Button 
                              size="sm" 
                              className="bg-blue-500 hover:bg-blue-600"
                              onClick={() => updateRentalStatus(rental.id, 'completed')}
                            >
                              Mark Completed
                            </Button>
                          )}
                          {rental.status !== 'canceled' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="text-red-500 border-red-300 hover:bg-red-50"
                              onClick={() => updateRentalStatus(rental.id, 'canceled')}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
