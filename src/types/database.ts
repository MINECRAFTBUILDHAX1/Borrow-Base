
// Database types for Supabase tables

export interface ListingTable {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  price_per_day: number;
  security_deposit: number | null;
  location: string;
  location_details: any;
  features: string[];
  rules: string[];
  images: string[];
  status: string;
  average_rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface PaymentAccount {
  id: string;
  user_id: string;
  stripe_account_id: string | null;
  stripe_customer_id: string | null;
  is_onboarded: boolean;
  created_at: string;
  updated_at: string;
}

export interface Rental {
  id: string;
  listing_id: string;
  borrower_id: string;
  lender_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  platform_fee: number;
  lender_payout: number;
  status: 'pending' | 'active' | 'completed' | 'canceled';
  payment_intent_id: string | null;
  created_at: string;
}

export interface Payout {
  id: string;
  rental_id: string;
  user_id: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  stripe_transfer_id: string | null;
  created_at: string;
  updated_at: string;
}
