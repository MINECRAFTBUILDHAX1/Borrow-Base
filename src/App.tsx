
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import ListingDetails from "./pages/ListingDetails";
import Profile from "./pages/Profile";
import CreateListing from "./pages/CreateListing";
import Explore from "./pages/Explore";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import AdminDashboard from "./pages/AdminDashboard";
import Layout from "./components/Layout";
import ProfileComplete from "./components/ProfileComplete";
import Messages from "./pages/Messages"; // Add the Messages page import

// Import footer page routes
import AboutUs from "./pages/AboutUs";
import HowItWorks from "./pages/HowItWorks";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import HelpCenter from "./pages/HelpCenter";
import SafetyInfo from "./pages/SafetyInfo";
import Cancellation from "./pages/Cancellation";
import Insurance from "./pages/Insurance";
import CookiePolicy from "./pages/CookiePolicy";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ProfileComplete />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/listing/:id" element={<ListingDetails />} />
              <Route path="/profile/:id" element={<Profile />} />
              <Route path="/create-listing" element={<CreateListing />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/messages" element={<Messages />} /> {/* Add the Messages route */}
              
              {/* Footer Pages */}
              <Route path="/about" element={<AboutUs />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/press" element={<Press />} />
              <Route path="/help-center" element={<HelpCenter />} />
              <Route path="/safety" element={<SafetyInfo />} />
              <Route path="/cancellation" element={<Cancellation />} />
              <Route path="/insurance" element={<Insurance />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
