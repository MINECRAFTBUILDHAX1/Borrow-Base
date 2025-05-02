
import { useState } from "react";
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

interface MessagingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientId: string;
  recipientName: string;
  recipientImage?: string;
  listingTitle: string;
  afterMessageSent?: () => void;
}

const MessagingDialog = ({
  open,
  onOpenChange,
  recipientId,
  recipientName,
  recipientImage,
  listingTitle,
  afterMessageSent
}: MessagingDialogProps) => {
  const [messageText, setMessageText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

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

    setIsSending(true);

    try {
      // In a real app, this would send the message to the backend
      // For now we'll simulate a successful message
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Message sent",
        description: `Your message has been sent to ${recipientName}. They will respond soon.`,
      });
      
      setMessageText("");
      if (afterMessageSent) {
        afterMessageSent();
      }
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Failed to send message",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Message about "{listingTitle}"</DialogTitle>
          <DialogDescription>
            Send a message to arrange pickup/delivery and details about the rental
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
              <p className="text-sm text-gray-500">Item owner</p>
            </div>
          </div>
          <Textarea 
            placeholder="Hi, I'm interested in renting your item. When and where can I pick it up?" 
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
