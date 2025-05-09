
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, Settings, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface UserData {
  id: string;
  name: string;
  image: string;
  bio: string;
  location: string;
  memberSince: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
}

interface ProfileHeaderProps {
  userData: UserData;
  isOwnProfile: boolean;
}

const ProfileHeader = ({ userData, isOwnProfile }: ProfileHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleEditProfile = () => {
    navigate('/settings');
  };
  
  const handleMessage = () => {
    navigate('/messages');
  };
  
  return (
    <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
      <Avatar className="h-20 w-20 md:h-32 md:w-32">
        <AvatarImage src={userData.image} alt={userData.name} />
        <AvatarFallback>{userData.name.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">{userData.name}</h1>
            <div className="flex items-center text-gray-600 mb-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span>{userData.rating}</span>
              <span className="ml-1">({userData.reviewCount} reviews)</span>
              {userData.verified && (
                <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                  Verified
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm">Member since {userData.memberSince} • {userData.location}</p>
          </div>
          
          {isOwnProfile ? (
            <Button variant="outline" className="flex items-center gap-2" onClick={handleEditProfile}>
              <Settings className="h-4 w-4" />
              Edit Profile
            </Button>
          ) : (
            <Button className="flex items-center gap-2" onClick={handleMessage}>
              <MessageCircle className="h-4 w-4" />
              Message
            </Button>
          )}
        </div>
        
        {userData.bio && (
          <div className="mt-4">
            <h2 className="font-medium mb-1">About</h2>
            <p className="text-gray-700">{userData.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
