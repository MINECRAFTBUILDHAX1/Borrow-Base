
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
        // Determine which user ID to fetch
        let userId = id;
        
        // If "me" and logged in, use logged-in user's ID
        if (id === "me" && user) {
          userId = user.id;
        } else if (id === "me" && !user) {
          // If "me" and not logged in, we'll handle this with a redirect
          return;
        }
        
        // Try to fetch user profile from profiles table
        let profile = null;
        if (userId) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
            
          if (!profileError && profileData) {
            profile = profileData;
          }
        }
        
        // If viewing someone else's profile, we need to use their data only
        const isViewingOtherProfile = user && userId !== user.id;
        
        // Build user data from profile or auth metadata
        const userData: UserData = {
          id: userId || "",
          name: profile?.username || 
                profile?.full_name || 
                (isViewingOtherProfile ? "User" : user?.user_metadata?.full_name) || 
                (isViewingOtherProfile ? "" : user?.email?.split('@')[0]) || 
                "User",
          image: profile?.avatar_url || 
                (isViewingOtherProfile ? "" : user?.user_metadata?.avatar_url) || 
                 "",
          bio: profile?.bio || 
               (isViewingOtherProfile ? "" : user?.user_metadata?.bio) || 
               "",
          location: isViewingOtherProfile ? "" : user?.user_metadata?.location || "",
          memberSince: new Date(profile?.created_at || (isViewingOtherProfile ? Date.now() : user?.created_at || Date.now())).toLocaleDateString('en-US', {month: 'long', year: 'numeric'}),
          rating: 0,
          reviewCount: 0,
          verified: isViewingOtherProfile ? false : Boolean(user?.email_confirmed_at),
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
