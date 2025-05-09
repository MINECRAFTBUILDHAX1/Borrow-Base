
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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

interface ReviewsTabProps {
  reviews: Review[];
}

const ReviewsTab = ({ reviews }: ReviewsTabProps) => {
  const { toast } = useToast();
  
  const handleWriteReview = () => {
    toast({
      title: "Coming soon",
      description: "Review feature will be available soon",
    });
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {reviews.length > 0 
            ? `Reviews (${reviews.length})`
            : "No reviews yet"}
        </h2>
        
        <Button variant="outline" className="flex items-center gap-2" onClick={handleWriteReview}>
          <PenSquare className="h-4 w-4" />
          Write a Review
        </Button>
      </div>
      
      <div className="space-y-6">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={review.user.image} alt={review.user.name} />
                  <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{review.user.name}</div>
                  <div className="text-sm text-gray-500">{review.date}</div>
                </div>
              </div>
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No reviews yet</p>
            <p className="text-sm text-gray-400 mt-2">Be the first to leave a review</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ReviewsTab;
