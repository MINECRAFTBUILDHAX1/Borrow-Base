
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ImageGalleryProps {
  images: string[];
  title?: string;
}

const ImageGallery = ({ images, title = "Item" }: ImageGalleryProps) => {
  return (
    <div className="mb-8">
      <Carousel className="w-full">
        <CarouselContent>
          {images?.map((image: string, index: number) => (
            <CarouselItem key={index} className="md:basis-2/3 lg:basis-1/2">
              <div className="p-1">
                <div className="overflow-hidden rounded-lg">
                  <img 
                    src={image} 
                    alt={`${title} - Image ${index + 1}`} 
                    className="w-full aspect-[4/3] object-cover"
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default ImageGallery;
