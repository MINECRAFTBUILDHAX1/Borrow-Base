
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsItem, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for analytics
const monthlyData = [
  { name: "Jan", views: 65, revenue: 130, ratings: 4.5 },
  { name: "Feb", views: 80, revenue: 160, ratings: 4.7 },
  { name: "Mar", views: 95, revenue: 190, ratings: 4.6 },
  { name: "Apr", views: 110, revenue: 220, ratings: 4.8 },
  { name: "May", views: 125, revenue: 250, ratings: 4.9 },
  { name: "Jun", views: 140, revenue: 280, ratings: 4.7 },
  { name: "Jul", views: 130, revenue: 260, ratings: 4.8 },
  { name: "Aug", views: 115, revenue: 230, ratings: 4.6 },
  { name: "Sep", views: 135, revenue: 270, ratings: 4.7 },
  { name: "Oct", views: 155, revenue: 310, ratings: 4.8 },
  { name: "Nov", views: 170, revenue: 340, ratings: 4.9 },
  { name: "Dec", views: 190, revenue: 380, ratings: 4.8 },
];

const weeklyData = [
  { name: "Mon", views: 25, revenue: 50, ratings: 4.7 },
  { name: "Tue", views: 30, revenue: 60, ratings: 4.8 },
  { name: "Wed", views: 35, revenue: 70, ratings: 4.9 },
  { name: "Thu", views: 33, revenue: 66, ratings: 4.7 },
  { name: "Fri", views: 40, revenue: 80, ratings: 4.8 },
  { name: "Sat", views: 50, revenue: 100, ratings: 4.9 },
  { name: "Sun", views: 45, revenue: 90, ratings: 4.8 },
];

const dailyData = [
  { name: "00:00", views: 5, revenue: 10, ratings: 0 },
  { name: "03:00", views: 2, revenue: 4, ratings: 0 },
  { name: "06:00", views: 3, revenue: 6, ratings: 4.5 },
  { name: "09:00", views: 10, revenue: 20, ratings: 4.6 },
  { name: "12:00", views: 15, revenue: 30, ratings: 4.7 },
  { name: "15:00", views: 12, revenue: 24, ratings: 4.8 },
  { name: "18:00", views: 18, revenue: 36, ratings: 4.9 },
  { name: "21:00", views: 8, revenue: 16, ratings: 4.7 },
];

// Top listing data
const topListings = [
  {
    id: "1",
    title: "Professional DSLR Camera",
    views: 420,
    revenue: 840,
    rating: 4.9,
  },
  {
    id: "2",
    title: "Mountain Bike",
    views: 380,
    revenue: 760,
    rating: 4.7,
  },
  {
    id: "3",
    title: "Premium Power Drill Set",
    views: 340,
    revenue: 680,
    rating: 4.8,
  },
  {
    id: "4",
    title: "Camping Tent (4 Person)",
    views: 320,
    revenue: 640,
    rating: 4.6,
  },
  {
    id: "5",
    title: "Projector for Home Cinema",
    views: 300,
    revenue: 600,
    rating: 4.5,
  },
];

const Analytics = () => {
  const [timeFrame, setTimeFrame] = useState("monthly");
  
  const getTimeFrameData = () => {
    switch(timeFrame) {
      case "daily":
        return dailyData;
      case "weekly":
        return weeklyData;
      case "monthly":
      default:
        return monthlyData;
    }
  };

  const data = getTimeFrameData();
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
      
      <div className="flex justify-end mb-4">
        <Select value={timeFrame} onValueChange={setTimeFrame}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Time Frame" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">Daily</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Views</CardTitle>
            <CardDescription>Total item views</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Revenue</CardTitle>
            <CardDescription>Earnings from rentals ($)</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Ratings</CardTitle>
            <CardDescription>Average rating score</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Line type="monotone" dataKey="ratings" stroke="#FFA726" activeDot={{ r: 8 }} strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Listings</CardTitle>
          <CardDescription>Your most popular items</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue ($)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topListings.map((listing) => (
                  <tr key={listing.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{listing.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{listing.views}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${listing.revenue}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{listing.rating.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
