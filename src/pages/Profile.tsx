
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
        // In a real app, fetch user data from Supabase based on ID
        // For now, we'll use the actual user metadata from Supabase Auth
        
        // This would be replaced with a real API call to fetch complete profile data
        const mockUserData: UserData = {
          id: user?.id || "user123",
          name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || "User",
          image: user?.user_metadata?.avatar_url || "https://randomuser.me/api/portraits/men/32.jpg",
          bio: user?.user_metadata?.bio || "Sharing enthusiast and community member.",
          location: user?.user_metadata?.location || "New York, NY",
          memberSince: user?.user_metadata?.memberSince || new Date(user?.created_at || Date.now()).toLocaleDateString('en-US', {month: 'long', year: 'numeric'}),
          rating: 4.9,
          reviewCount: 42,
          verified: true,
          listings: [
            {
              id: "1",
              title: "Professional DSLR Camera",
              price: 35,
              priceUnit: "day",
              imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Y2FtZXJhfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
              location: user?.user_metadata?.location || "Brooklyn, NY",
              rating: 4.9,
              reviewCount: 23,
              category: "Electronics"
            },
            {
              id: "5",
              title: "Projector for Home Cinema",
              price: 20,
              priceUnit: "day",
              imageUrl: "https://images.unsplash.com/photo-1585504198199-20277a781a1d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cHJvamVjdG9yfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80",
              location: user?.user_metadata?.location || "Brooklyn, NY",
              rating: 4.5,
              reviewCount: 12,
              category: "Electronics"
            },
            {
              id: "12",
              title: "Professional Drone",
              price: 45,
              priceUnit: "day",
              imageUrl: "https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8ZHJvbmV8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
              location: user?.user_metadata?.location || "Brooklyn, NY",
              rating: 4.8,
              reviewCount: 22,
              category: "Electronics"
            }
          ],
          rentals: [
            {
              id: "2",
              title: "Mountain Bike",
              price: 25,
              priceUnit: "day",
              imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YmljeWNsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80",
              location: "Queens, NY",
              rating: 4.7,
              reviewCount: 18,
              category: "Sports"
            },
            {
              id: "7",
              title: "Portable Grill",
              price: 15,
              priceUnit: "day",
              imageUrl: "https://images.unsplash.com/photo-1523897530436-6e6748f1bdd7?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Z3JpbGx8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80",
              location: "Queens, NY",
              rating: 4.6,
              reviewCount: 15,
              category: "Outdoor"
            }
          ],
          reviews: [
            {
              id: "rev1",
              user: {
                name: "Sarah Johnson",
                image: "https://randomuser.me/api/portraits/women/44.jpg",
              },
              rating: 5,
              date: "August 2023",
              comment: "Great experience renting from this user. Would definitely recommend!"
            },
            {
              id: "rev2",
              user: {
                name: "David Wilson",
                image: "https://randomuser.me/api/portraits/men/67.jpg",
              },
              rating: 5,
              date: "July 2023",
              comment: "Very accommodating with pickup and drop-off times."
            },
            {
              id: "rev3",
              user: {
                name: "Lisa Brooks",
                image: "https://randomuser.me/api/portraits/women/17.jpg",
              },
              rating: 5,
              date: "June 2023",
              comment: "A reliable person to rent from and the item was exactly as described!"
            }
          ]
        };

        setUserData(mockUserData);
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

    if (user || id !== "me") {
      fetchUserData();
    }
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
