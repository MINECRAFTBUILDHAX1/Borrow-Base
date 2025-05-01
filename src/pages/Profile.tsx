
import { useParams, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { UserData } from "@/types/user";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  // Check if we're viewing our own profile
  const isOwnProfile = id === "me" || id === user?.id;
  
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        if (!user && id === "me") {
          return;
        }
        
        const userId = id === "me" ? user?.id : id;
        
        // Build user data from auth metadata since we don't have a profiles table yet
        const userData: UserData = {
          id: userId || "",
          name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User",
          image: user?.user_metadata?.avatar_url || "",
          bio: user?.user_metadata?.bio || "",
          location: user?.user_metadata?.location || "",
          memberSince: new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', {month: 'long', year: 'numeric'}),
          rating: 0,
          reviewCount: 0,
          verified: Boolean(user?.email_confirmed_at),
          listings: [],
          rentals: [],
          reviews: []
        };

        setUserData(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [id, user, toast]);
  
  // Redirect to auth page if trying to access "me" profile while not logged in
  if (id === "me" && !user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <p>Loading user profile...</p>
      </div>
    );
  }
  
  if (!userData) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <p>User not found</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <ProfileHeader userData={userData} isOwnProfile={isOwnProfile} />
      <ProfileTabs userData={userData} isOwnProfile={isOwnProfile} />
    </div>
  );
};

export default Profile;
