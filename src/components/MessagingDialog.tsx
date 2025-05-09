
import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Send } from 'lucide-react';
import { format } from 'date-fns';

interface MessagingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipientId: string;
  recipientName: string;
  recipientImage?: string;
  listingId?: string;
  listingTitle?: string;
  rentalId?: string;
  afterMessageSent?: () => void;
}

interface Message {
  id: string;
  sender_id: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

const MessagingDialog = ({
  open,
  onOpenChange,
  recipientId,
  recipientName,
  recipientImage,
  listingId,
  listingTitle,
  rentalId,
  afterMessageSent
}: MessagingDialogProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (open && user) {
      setIsLoading(true);
      
      // Determine if we're using a rental or listing conversation
      if (rentalId) {
        fetchRentalMessages(rentalId);
      } else if (listingId) {
        // Check if a conversation already exists
        findOrCreateConversation();
      }
    }
  }, [open, user, recipientId, listingId, rentalId]);
  
  // Set up real-time subscription for new messages
  useEffect(() => {
    let messageSubscription: any = null;
    
    if (open && user) {
      if (rentalId) {
        // Subscribe to messages for this rental
        messageSubscription = supabase
          .channel(`rental-messages-${rentalId}`)
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `rental_id=eq.${rentalId}`
          }, handleNewMessage)
          .subscribe();
      } else if (currentConversationId) {
        // Subscribe to messages for this conversation
        messageSubscription = supabase
          .channel(`conversation-messages-${currentConversationId}`)
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${currentConversationId}`
          }, handleNewMessage)
          .subscribe();
      }
      
      // Mark messages as read when the dialog opens
      markMessagesAsRead();
    }
    
    return () => {
      if (messageSubscription) {
        supabase.removeChannel(messageSubscription);
      }
    };
  }, [open, user, currentConversationId, rentalId]);
  
  const handleNewMessage = (payload: any) => {
    const newMessage = payload.new;
    
    // Add new message to the chat
    setMessages(prev => [...prev, newMessage]);
    
    // Mark the message as read if it's from the other person
    if (newMessage.sender_id !== user?.id && !newMessage.is_read) {
      markMessageAsRead(newMessage.id);
    }
    
    // Call the callback if provided
    if (afterMessageSent) {
      afterMessageSent();
    }
  };

  const findOrCreateConversation = async () => {
    try {
      if (!user || !recipientId || !listingId) return;
      
      // Check if a conversation already exists between these users for this listing
      const { data: existingConvs, error: findError } = await supabase
        .from('conversations')
        .select('*')
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${user.id})`)
        .eq('listing_id', listingId);
      
      if (findError) throw findError;
      
      if (existingConvs && existingConvs.length > 0) {
        // Use the existing conversation
        const conversationId = existingConvs[0].id;
        setCurrentConversationId(conversationId);
        fetchConversationMessages(conversationId);
      } else {
        // Create a new conversation
        const { data: newConv, error: createError } = await supabase
          .from('conversations')
          .insert({
            sender_id: user.id,
            recipient_id: recipientId,
            listing_id: listingId
          })
          .select()
          .single();
          
        if (createError) throw createError;
        
        if (newConv) {
          setCurrentConversationId(newConv.id);
          setMessages([]);
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('Error finding/creating conversation:', error);
      toast({
        title: "Error",
        description: "Could not load or create conversation",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const fetchRentalMessages = async (rentalId: string) => {
    try {
      // Get all messages for this rental
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .eq('rental_id', rentalId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      if (messagesData) {
        setMessages(messagesData);
        
        // Mark unread messages as read
        markMessagesAsRead();
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching rental messages:', error);
      toast({
        title: "Error",
        description: "Could not load messages",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const fetchConversationMessages = async (conversationId: string) => {
    try {
      // Get all messages for this conversation
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      
      if (messagesData) {
        setMessages(messagesData);
        
        // Mark unread messages as read
        markMessagesAsRead();
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
      toast({
        title: "Error",
        description: "Could not load messages",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      if (!user) return;
      
      let updateQuery;
      
      if (rentalId) {
        updateQuery = supabase
          .from('messages')
          .update({ is_read: true })
          .eq('rental_id', rentalId)
          .eq('is_read', false)
          .neq('sender_id', user.id);
      } else if (currentConversationId) {
        updateQuery = supabase
          .from('messages')
          .update({ is_read: true })
          .eq('conversation_id', currentConversationId)
          .eq('is_read', false)
          .neq('sender_id', user.id);
      }
      
      if (updateQuery) {
        const { error } = await updateQuery;
        
        if (error) {
          console.error('Error marking messages as read:', error);
        } else {
          // Update local message state to mark messages as read
          setMessages(prev => prev.map(msg => 
            msg.sender_id !== user.id ? { ...msg, is_read: true } : msg
          ));
        }
      }
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('id', messageId);
        
      if (error) {
        console.error('Error marking message as read:', error);
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !user) return;
    
    setIsSending(true);
    
    try {
      let messageData;
      
      // Create the message for either rental or conversation
      if (rentalId) {
        messageData = {
          rental_id: rentalId,
          sender_id: user.id,
          message: messageText,
          is_read: false
        };
      } else if (currentConversationId) {
        messageData = {
          conversation_id: currentConversationId,
          sender_id: user.id,
          message: messageText,
          is_read: false
        };
      } else {
        throw new Error("No conversation or rental ID available");
      }
      
      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select();
        
      if (error) throw error;
      
      // Update conversation last message if using a conversation
      if (currentConversationId) {
        const { error: updateError } = await supabase
          .from('conversations')
          .update({
            last_message: messageText,
            last_message_at: new Date().toISOString()
          })
          .eq('id', currentConversationId);
          
        if (updateError) {
          console.error('Error updating conversation:', updateError);
        }
      }
      
      setMessageText('');
      
      if (afterMessageSent) {
        afterMessageSent();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      
      // If it's today, just show the time
      const today = new Date();
      if (date.toDateString() === today.toDateString()) {
        return format(date, 'h:mm a');
      }
      
      // Otherwise show the date and time
      return format(date, 'MMM d, h:mm a');
    } catch (error) {
      return '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="sr-only">Chat with {recipientName}</DialogTitle>
          <DialogDescription className="sr-only">
            Send and receive messages with {recipientName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center gap-3 pb-3 border-b">
          <Avatar className="h-10 w-10">
            <AvatarImage src={recipientImage} />
            <AvatarFallback>{recipientName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{recipientName}</p>
            {listingTitle && <p className="text-sm text-gray-500">Re: {listingTitle}</p>}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 min-h-[300px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <p>Loading messages...</p>
            </div>
          ) : messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`flex flex-col ${message.sender_id === user?.id ? 'items-end' : 'items-start'}`}
                >
                  <div 
                    className={`max-w-[70%] px-4 py-2 rounded-lg ${
                      message.sender_id === user?.id 
                        ? 'bg-brand-purple text-white rounded-br-none' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <p>{message.message}</p>
                  </div>
                  <span className="text-xs text-gray-500 mt-1">
                    {formatMessageTime(message.created_at)}
                    {message.sender_id === user?.id && (
                      <span className="ml-1">{message.is_read ? '• Read' : ''}</span>
                    )}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex justify-center items-center h-full">
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 pt-3 mt-auto">
          <Textarea 
            placeholder="Type a message..." 
            className="resize-none"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isSending || !messageText.trim()} 
            onClick={handleSendMessage}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessagingDialog;
