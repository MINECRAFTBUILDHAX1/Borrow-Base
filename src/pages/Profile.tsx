
import { useParams } from "react-router-dom";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import { UserData } from "@/types/user";

// Mock user data
const mockUserData: UserData = {
  id: "user123",
  name: "Michael Chen",
  image: "https://randomuser.me/api/portraits/men/32.jpg",
  bio: "Photography enthusiast and gadget lover. I enjoy sharing my equipment with others and meeting fellow creatives.",
  location: "Brooklyn, NY",
  memberSince: "June 2022",
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
      location: "Brooklyn, NY",
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
      location: "Brooklyn, NY",
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
      location: "Brooklyn, NY",
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
      comment: "Michael's camera was in perfect condition and he was very helpful explaining all the features. Would definitely rent from him again!"
    },
    {
      id: "rev2",
      user: {
        name: "David Wilson",
        image: "https://randomuser.me/api/portraits/men/67.jpg",
      },
      rating: 5,
      date: "July 2023",
      comment: "Great experience! The camera performed flawlessly for our event and Michael was very accommodating with pickup and drop-off times."
    },
    {
      id: "rev3",
      user: {
        name: "Lisa Brooks",
        image: "https://randomuser.me/api/portraits/women/17.jpg",
      },
      rating: 5,
      date: "June 2023",
      comment: "Michael is a reliable lender and the projector was exactly as described. Will definitely rent from him again!"
    }
  ]
};

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const isOwnProfile = id === "me";
  
  // In a real app, fetch user data based on ID
  const userData = mockUserData;
  
  if (!userData) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <p>Loading user profile...</p>
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
