
import ListingCard, { ListingProps } from "@/components/ListingCard";

interface RentalsTabProps {
  rentals: ListingProps[];
}

const RentalsTab = ({ rentals }: RentalsTabProps) => {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">
        {rentals.length > 0 
          ? `Rental History (${rentals.length})`
          : "No rental history yet"}
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {rentals.map((rental: ListingProps) => (
          <ListingCard key={rental.id} {...rental} />
        ))}
      </div>
    </>
  );
};

export default RentalsTab;
