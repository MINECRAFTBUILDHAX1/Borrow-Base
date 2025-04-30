
import { useState } from "react";
import {
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, ChartBarIcon, TrendingUpIcon, DollarSign, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock data for the charts
const viewsData = [
  { date: "Jan", views: 65 },
  { date: "Feb", views: 59 },
  { date: "Mar", views: 80 },
  { date: "Apr", views: 81 },
  { date: "May", views: 56 },
  { date: "Jun", views: 55 },
  { date: "Jul", views: 40 },
  { date: "Aug", views: 70 },
  { date: "Sep", views: 90 },
  { date: "Oct", views: 110 },
  { date: "Nov", views: 130 },
  { date: "Dec", views: 150 },
];

const revenueData = [
  { date: "Jan", revenue: 650 },
  { date: "Feb", revenue: 590 },
  { date: "Mar", revenue: 800 },
  { date: "Apr", revenue: 810 },
  { date: "May", revenue: 560 },
  { date: "Jun", revenue: 550 },
  { date: "Jul", revenue: 400 },
  { date: "Aug", revenue: 700 },
  { date: "Sep", revenue: 900 },
  { date: "Oct", revenue: 1100 },
  { date: "Nov", revenue: 1300 },
  { date: "Dec", revenue: 1500 },
];

const categoryData = [
  { name: "Electronics", value: 400 },
  { name: "Tools", value: 300 },
  { name: "Furniture", value: 200 },
  { name: "Sports", value: 150 },
  { name: "Outdoor", value: 100 },
];

const ratingData = [
  { rating: "5 Stars", count: 42 },
  { rating: "4 Stars", count: 28 },
  { rating: "3 Stars", count: 15 },
  { rating: "2 Stars", count: 8 },
  { rating: "1 Star", count: 5 },
];

const COLORS = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c"];

const Analytics = () => {
  const [timeframe, setTimeframe] = useState("year");
  const [listingFilter, setListingFilter] = useState("all");

  // Summary stats
  const statsCards = [
    {
      title: "Total Revenue",
      value: "$3,250.00",
      change: "+12.5%",
      trend: "up",
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      title: "Total Views",
      value: "24,500",
      change: "+18.2%",
      trend: "up",
      icon: <Users className="h-4 w-4" />,
    },
    {
      title: "Active Rentals",
      value: "38",
      change: "+5.4%",
      trend: "up",
      icon: <ChartBarIcon className="h-4 w-4" />,
    },
    {
      title: "Average Rating",
      value: "4.8",
      change: "+0.3",
      trend: "up",
      icon: <TrendingUpIcon className="h-4 w-4" />,
    },
  ];
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your listings' performance and revenue</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="quarter">Last 90 days</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={listingFilter} onValueChange={setListingFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All listings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All listings</SelectItem>
              <SelectItem value="active">Active listings</SelectItem>
              <SelectItem value="inactive">Inactive listings</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className="gap-2">
            <CalendarIcon className="h-4 w-4" />
            Custom Range
          </Button>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-full ${stat.trend === 'up' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {stat.icon}
                </div>
              </div>
              <p className={`text-xs mt-2 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} from previous {timeframe}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Charts */}
      <Tabs defaultValue="views" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="views">Views</TabsTrigger>
          <TabsTrigger value="rentals">Rentals</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="views">
          <Card>
            <CardHeader>
              <CardTitle>Views Over Time</CardTitle>
              <CardDescription>Track how many people viewed your listings</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[350px]">
                <ChartContainer config={{
                  views: { label: "Views", color: "#8884d8" },
                }}>
                  <LineChart data={viewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <ChartTooltipContent payload={payload} />
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="views" name="Views" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
              <CardDescription>Track your earnings from rentals</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[350px]">
                <ChartContainer config={{
                  revenue: { label: "Revenue ($)", color: "#82ca9d" },
                }}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <ChartTooltipContent payload={payload} />
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue ($)" fill="#82ca9d" />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Categories Distribution</CardTitle>
              <CardDescription>See which categories are most popular</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[350px] flex justify-center">
                <ChartContainer config={{
                  categories: { label: "Categories", color: "#8884d8" },
                }}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <ChartTooltipContent payload={payload} />
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ratings">
          <Card>
            <CardHeader>
              <CardTitle>Rating Distribution</CardTitle>
              <CardDescription>See how your listings are being rated</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="h-[350px]">
                <ChartContainer config={{
                  count: { label: "Count", color: "#8884d8" },
                }}>
                  <BarChart data={ratingData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="rating" type="category" width={80} />
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <ChartTooltipContent payload={payload} />
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Bar dataKey="count" name="Count" fill="#8884d8" />
                  </BarChart>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="rentals">
          <Card>
            <CardHeader>
              <CardTitle>Rentals Overview</CardTitle>
              <CardDescription>Track your rental activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Recent Rentals</h3>
                  <div className="space-y-2">
                    {Array.from({length: 5}).map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex gap-3 items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-md"></div>
                          <div>
                            <p className="font-medium">Professional DSLR Camera</p>
                            <p className="text-xs text-gray-500">Rented by John D. • Apr {15 + i}, 2025</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${35 + i * 10}.00</p>
                          <p className="text-xs text-gray-500">3 days</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Top Performing Listings</h3>
                  <div className="space-y-2">
                    {['Professional DSLR Camera', 'Mountain Bike', 'Premium Power Drill Set', 'Camping Tent (4 Person)'].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex gap-3 items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-md"></div>
                          <div>
                            <p className="font-medium">{item}</p>
                            <p className="text-xs text-gray-500">{12 - i * 2} rentals • ${(35 - i * 5) * (12 - i * 2)} total revenue</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${35 - i * 5}/day</p>
                          <p className="text-xs text-green-600">+{18 - i * 3}% vs. last {timeframe}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
