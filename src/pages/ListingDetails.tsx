
// Add this function at the beginning of your file where you're handling the rental creation
const generateRentalCode = () => {
  // Generate a random 6-character alphanumeric code
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

// Then in your handleRentNow function, add the rental_code field:
const handleRentNow = async () => {
  if (!user) {
    toast({
      title: "Login required",
      description: "Please login to rent this item",
      variant: "destructive"
    });
    navigate("/auth?redirect=" + encodeURIComponent(location.pathname));
    return;
  }

  if (!listing) return;

  // Calculate the total price
  const totalPrice = calculateTotalPrice();

  try {
    // Create a rental record
    const { data: rental, error } = await supabase
      .from('rentals')
      .insert({
        listing_id: listing.id,
        renter_id: user.id,
        seller_id: listing.user_id,
        start_date: startDate,
        end_date: endDate,
        total_price: totalPrice,
        currency: "GBP",
        status: "waiting_for_payment",
        rental_code: generateRentalCode() // Add the rental code
      })
      .select('id')
      .single();

    if (error) throw error;

    // Open the payment dialog
    setPaymentDialog({
      open: true,
      rentalId: rental.id,
      amount: totalPrice,
    });

  } catch (error) {
    console.error("Error creating rental:", error);
    toast({
      title: "Error",
      description: "Failed to create rental. Please try again.",
      variant: "destructive"
    });
  }
};
