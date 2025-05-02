
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const StripeConnectButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleStripeConnect = async () => {
    if (!user) {
      toast({
        title: "Not logged in",
        description: "You must be logged in to connect your Stripe account",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke(
        'create-stripe-account',
        {
          body: { user_id: user.id }
        }
      );

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No URL returned from Stripe");
      }
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to Stripe. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleStripeConnect} 
      variant="default"
      className="bg-[#635bff] hover:bg-[#4e45f3] text-white"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Connecting...
        </>
      ) : (
        <>
          <ExternalLink className="mr-2 h-4 w-4" />
          Connect with Stripe
        </>
      )}
    </Button>
  );
};

export default StripeConnectButton;
