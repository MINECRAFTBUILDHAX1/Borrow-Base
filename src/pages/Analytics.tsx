
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Sample data for charts
const viewsData = [
  { name: "Jan", value: 245 },
  { name: "Feb", value: 320 },
  { name: "Mar", value: 278 },
  { name: "Apr", value: 189 },
  { name: "May", value: 356 },
  { name: "Jun", value: 412 },
  { name: "Jul", value: 501 },
];

const revenueData = [
  { name: "Jan", value: 125 },
  { name: "Feb", value: 210 },
  { name: "Mar", value: 190 },
  { name: "Apr", value: 140 },
  { name: "May", value: 280 },
  { name: "Jun", value: 320 },
  { name: "Jul", value: 380 },
];

const ratingsData = [
  { name: "Jan", value: 4.2 },
  { name: "Feb", value: 4.4 },
  { name: "Mar", value: 4.5 },
  { name: "Apr", value: 4.3 },
  { name: "May", value: 4.7 },
  { name: "Jun", value: 4.8 },
  { name: "Jul", value: 4.9 },
];

const Analytics = () => {
  const [activeTab, setActiveTab] = useState("views");
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect to auth if not logged in
  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,301</div>
            <p className="text-xs text-green-500">+12.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,645</div>
            <p className="text-xs text-green-500">+8.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8/5</div>
            <p className="text-xs text-green-500">+0.3 from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>Track how your listings are performing over time</CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="views">Views</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
              <TabsTrigger value="ratings">Ratings</TabsTrigger>
            </TabsList>
            <div className="h-[300px] w-full">
              <TabsContent value="views" className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={viewsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" name="Views" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="revenue" className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={revenueData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" name="Revenue ($)" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="ratings" className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={ratingsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" name="Rating" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Items</CardTitle>
            <CardDescription>Your most viewed and rented items</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span>Professional DSLR Camera</span>
              <span className="font-medium">142 views</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span>Mountain Bike</span>
              <span className="font-medium">98 views</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span>Projector for Home Cinema</span>
              <span className="font-medium">76 views</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest bookings and inquiries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span>New booking: Professional Drone</span>
              <span className="text-gray-500 text-sm">2 hours ago</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span>New inquiry: Mountain Bike</span>
              <span className="text-gray-500 text-sm">5 hours ago</span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 rounded">
              <span>New review received (4.9 stars)</span>
              <span className="text-gray-500 text-sm">Yesterday</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
