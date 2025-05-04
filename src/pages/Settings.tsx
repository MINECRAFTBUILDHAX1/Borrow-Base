
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import SettingsProfileForm from "@/components/settings/SettingsProfileForm";
import SettingsSecurityForm from "@/components/settings/SettingsSecurityForm";
import SettingsBillingInfo from "@/components/settings/SettingsBillingInfo";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Important: React hooks must be called unconditionally at the top level
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab && ['profile', 'security', 'notifications', 'billing'].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

  // Handle navigation if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);
  
  // Return a loading state or null until we know if user is logged in
  if (!user) {
    return null;
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing & Fees</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsProfileForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Update your password</CardDescription>
            </CardHeader>
            <CardContent>
              <SettingsSecurityForm />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage your notification settings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Coming soon! Notification preferences will be available in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Commission Fees</CardTitle>
              <CardDescription>Learn about BorrowBase's fee structure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-amber-50 p-4 border border-amber-200 rounded-md">
                  <h3 className="font-medium text-amber-800 mb-2">Payment Information</h3>
                  <p className="text-amber-700 mb-4">
                    Please ensure your PayPal email is added to your profile to receive payments when users rent your items.
                    85% of the rental fee will be sent to your PayPal account within 2 days of the rental period beginning.
                  </p>
                </div>
                
                <SettingsBillingInfo />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
