
import { ListingProps } from "@/components/ListingCard";

export interface Review {
  id: string;
  user: {
    name: string;
    image: string;
  };
  rating: number;
  date: string;
  comment: string;
}

export interface UserData {
  id: string;
  name: string;
  image: string;
  bio: string;
  location: string;
  memberSince: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  listings: ListingProps[];
  rentals: ListingProps[];
  reviews: Review[];
}
