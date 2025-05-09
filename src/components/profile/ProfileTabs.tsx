
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ListingsTab from "./ListingsTab";
import { ListingProps } from "@/components/ListingCard";

interface Review {
  id: string;
  user: {
    name: string;
    image: string;
  };
  rating: number;
  date: string;
  comment: string;
}

interface ProfileTabsProps {
  userData: {
    id: string;
    name: string;
    listings: ListingProps[];
    rentals: ListingProps[];
    reviews: Review[];
  };
  isOwnProfile: boolean;
}

const ProfileTabs = ({ userData, isOwnProfile }: ProfileTabsProps) => {
  return (
    <Tabs defaultValue="listings" className="mt-6">
      <TabsList className="grid w-full grid-cols-3 max-w-md mb-6">
        <TabsTrigger value="listings">Listings</TabsTrigger>
        <TabsTrigger value="rentals">Rentals</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
      </TabsList>
      
      <TabsContent value="listings">
        <ListingsTab 
          listings={userData.listings} 
          userName={userData.name} 
          isOwnProfile={isOwnProfile} 
          userId={userData.id}
        />
      </TabsContent>
      
     
    </Tabs>
  );
};

export default ProfileTabs;
