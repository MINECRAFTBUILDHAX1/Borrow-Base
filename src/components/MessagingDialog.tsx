
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Separator } from "@/components/ui/separator";

interface MessagingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientId: string;
  recipientName: string;
  recipientImage?: string;
  listingTitle: string;
  afterMessageSent?: () => void;
  rentalId?: string;
}

interface Message {
  id: string;
  message: string;
  created_at: string;
  sender_id: string;
  is_read: boolean;
}

const MessagingDialog = ({
  open,
  onOpenChange,
  recipientId,
  recipientName,
  recipientImage,
  listingTitle,
  afterMessageSent,
  rentalId
}: MessagingDialogProps) => {
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [rental, setRental] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch existing messages when the dialog opens
  useEffect(() => {
    if (open && rentalId) {
      fetchMessages();
      fetchRentalDetails();
    }
  }, [open, rentalId]);

  const fetchMessages = async () => {
    if (!rentalId || !user) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('rental_id', rentalId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      if (data) {
        setMessages(data);
        
        // Mark messages as read
        const unreadMessages = data.filter(
          msg => msg.sender_id !== user.id && !msg.is_read
        );
        
        if (unreadMessages.length > 0) {
          const unreadIds = unreadMessages.map(msg => msg.id);
          await supabase
            .from('messages')
            .update({ is_read: true })
            .in('id', unreadIds);
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchRentalDetails = async () => {
    if (!rentalId) return;
    
    try {
      const { data, error } = await supabase
        .from('rentals')
        .select('*, listing:listing_id(title)')
        .eq('id', rentalId)
        .single();
        
      if (error) throw error;
      
      if (data) {
        setRental(data);
      }
    } catch (error) {
      console.error("Error fetching rental details:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a message to send",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to send messages",
        variant: "destructive",
      });
      return;
    }

    if (!rentalId && !rental) {
      // Create a new rental record first
      // This would be for initial contact before booking
      // However, this case is not implemented in the current flow
      toast({
        title: "Unable to send message",
        description: "Missing rental information",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      const currentRentalId = rentalId || rental?.id;
      
      if (!currentRentalId) {
        throw new Error("Missing rental ID");
      }
      
      const { data, error } = await supabase
        .from('messages')
        .insert({
          rental_id: currentRentalId,
          sender_id: user.id,
          message: messageText,
          is_read: false
        })
        .select('*');
        
      if (error) throw error;
      
      if (data) {
        setMessageText("");
        setMessages([...messages, data[0]]);
        if (afterMessageSent) {
          afterMessageSent();
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send message",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Message about "{listingTitle}"</DialogTitle>
          <DialogDescription>
            {rental?.rental_code ? 
              `Rental code: ${rental.rental_code}` :
              "Send a message to arrange pickup/delivery and details about the rental"
            }
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={recipientImage} alt={recipientName} />
              <AvatarFallback>{recipientName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{recipientName}</p>
              <p className="text-sm text-gray-500">{user?.id === rental?.seller_id ? "Renter" : "Lender"}</p>
            </div>
          </div>

          {messages.length > 0 && (
            <div className="max-h-60 overflow-y-auto border rounded-md p-3 mb-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`mb-3 ${message.sender_id === user?.id ? 'text-right' : 'text-left'}`}
                >
                  <div 
                    className={`inline-block max-w-[80%] px-3 py-2 rounded-lg ${
                      message.sender_id === user?.id 
                        ? 'bg-brand-purple text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p>{message.message}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(message.created_at)}
                  </p>
                </div>
              ))}
            </div>
          )}
          
          <Textarea 
            placeholder="Type your message here..." 
            className="min-h-24"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isSending}>Cancel</Button>
          </DialogClose>
          <Button onClick={handleSendMessage} disabled={isSending}>
            {isSending ? "Sending..." : "Send Message"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessagingDialog;
