
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export interface ListingProps {
  id: string;
  title: string;
  price: number;
  priceUnit: 'hour' | 'day' | 'week' | 'month';
  imageUrl: string;
  location: string;
  rating: number;
  reviewCount: number;
  category: string;
  distance?: number;
  userId?: string; // Added userId to track ownership
}

const ListingCard = ({ 
  id, 
  title, 
  price, 
  priceUnit, 
  imageUrl, 
  location, 
  rating, 
  reviewCount, 
  category,
  distance,
  userId
}: ListingProps) => {
  return (
    <Link to={`/listing/${id}`}>
      <Card className="overflow-hidden border-none card-shadow h-full">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
          <Badge variant="secondary" className="absolute top-2 left-2 bg-white/80 text-gray-800">
            {category}
          </Badge>
        </div>
        <CardContent className="p-3">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-900 line-clamp-1">{title}</h3>
            <div className="flex items-center gap-1 text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{rating.toFixed(1)}</span>
              <span className="text-gray-500">({reviewCount})</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-1">{location}</p>
          {distance !== undefined && (
            <p className="text-gray-500 text-xs mt-1">{distance < 1 ? `${(distance * 1000).toFixed(0)}m away` : `${distance.toFixed(1)}km away`}</p>
          )}
          <p className="font-semibold mt-2">
            £{price}<span className="font-normal text-gray-500">/{priceUnit}</span>
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ListingCard;
