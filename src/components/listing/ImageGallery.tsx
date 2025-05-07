
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageGalleryProps {
  images: string[];
  title: string;
}

const ImageGallery = ({ images, title }: ImageGalleryProps) => {
  return (
    <>
      {images && images.length > 0 ? (
        <div className="aspect-square rounded-lg overflow-hidden">
          <img
            src={images[0]}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
          <p>No image available</p>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
