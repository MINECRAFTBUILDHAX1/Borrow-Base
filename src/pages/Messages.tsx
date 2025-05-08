import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import MessagingDialog from "@/components/MessagingDialog";

interface Conversation {
  id: string;
  listing_id: string;
  sender_id: string;
  recipient_id: string;
  last_message?: string;
  last_message_at?: string;
  created_at: string;
  unread_count?: number;
  other_user?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  listing?: {
    id: string;
    title: string;
    images?: string[];
  };
}

interface Rental {
  id: string;
  listing_id: string;
  renter_id: string;
  seller_id: string;
  rental_code: string;
  listing: {
    id: string;
    title: string;
    images?: string[];
  };
  other_user?: {
    id: string;
    name: string;
    avatar_url?: string;
  };
  unread_count?: number;
}

const Messages = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [activeTab, setActiveTab] = useState("conversations");
  const [isLoading, setIsLoading] = useState(true);
  
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);

  useEffect(() => {
    if (user) {
      fetchConversations();
      fetchRentals();
    }
  }, [user]);

  const fetchConversations = async () => {
    try {
      setIsLoading(true);
      
      // First get all conversations where the user is either sender or recipient
      const { data: conversationsData, error: conversationsError } = await supabase
        .from('conversations')
        .select('*')
        .or(`sender_id.eq.${user?.id},recipient_id.eq.${user?.id}`)
        .order('last_message_at', { ascending: false });
      
      if (conversationsError) throw conversationsError;
      
      if (conversationsData) {
        // For each conversation, we need to get:
        // 1. The other user's details (not the current user)
        // 2. The listing details
        // 3. The unread message count
        
        const conversationsWithDetails = await Promise.all(conversationsData.map(async (conv) => {
          // Determine which user is the "other" user
          const otherId = conv.sender_id === user?.id ? conv.recipient_id : conv.sender_id;
          
          // Get the other user's profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .eq('id', otherId)
            .single();
            
          // Get the listing details
          const { data: listingData } = await supabase
            .from('listings')
            .select('id, title, images')
            .eq('id', conv.listing_id)
            .single();
            
          // Get unread message count
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('sender_id', otherId)
            .eq('is_read', false);
            
          return {
            ...conv,
            unread_count: unreadCount || 0,
            other_user: {
              id: otherId,
              name: profileData?.username || profileData?.full_name || 'User',
              avatar_url: profileData?.avatar_url
            },
            listing: listingData || { id: conv.listing_id, title: 'Item' }
          };
        }));
        
        setConversations(conversationsWithDetails);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversation data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRentals = async () => {
    try {
      // Get rentals where user is either the renter or seller
      const { data: rentalsData, error: rentalsError } = await supabase
        .from('rentals')
        .select(`
          id, 
          listing_id, 
          renter_id, 
          seller_id,
          rental_code,
          status,
          listing:listing_id (
            id, title, images
          )
        `)
        .or(`renter_id.eq.${user?.id},seller_id.eq.${user?.id}`)
        .order('created_at', { ascending: false });
        
      if (rentalsError) throw rentalsError;
      
      if (rentalsData) {
        const rentalsWithDetails = await Promise.all(rentalsData.map(async (rental) => {
          // Determine which user is the "other" user
          const otherId = rental.renter_id === user?.id ? rental.seller_id : rental.renter_id;
          
          // Get the other user's profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .eq('id', otherId)
            .single();
            
          // Get unread message count
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('rental_id', rental.id)
            .eq('sender_id', otherId)
            .eq('is_read', false);
            
          return {
            ...rental,
            unread_count: unreadCount || 0,
            other_user: {
              id: otherId,
              name: profileData?.username || profileData?.full_name || 'User',
              avatar_url: profileData?.avatar_url
            }
          };
        }));
        
        setRentals(rentalsWithDetails);
      }
    } catch (error) {
      console.error('Error fetching rentals:', error);
    }
  };

  const handleOpenMessageDialog = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setSelectedRental(null);
    setMessageDialogOpen(true);
  };

  const handleOpenRentalMessageDialog = (rental: Rental) => {
    setSelectedRental(rental);
    setSelectedConversation(null);
    setMessageDialogOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    
    // If it's today, just show the time
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If it's less than 7 days ago, show the day name
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    if (date > oneWeekAgo) {
      return date.toLocaleDateString([], { weekday: 'short' });
    }
    
    // Otherwise show the date
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-semibold mb-4">Sign in to view your messages</h2>
        <p className="mb-6">You need to be logged in to access this page.</p>
        <Button asChild>
          <Link to="/auth">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="conversations" className="flex gap-2">
            Conversations
            {conversations.reduce((count, conv) => count + (conv.unread_count || 0), 0) > 0 && (
              <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center rounded-full">
                {conversations.reduce((count, conv) => count + (conv.unread_count || 0), 0)}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rentals" className="flex gap-2">
            Rentals
            {rentals.reduce((count, rental) => count + (rental.unread_count || 0), 0) > 0 && (
              <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center rounded-full">
                {rentals.reduce((count, rental) => count + (rental.unread_count || 0), 0)}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="conversations" className="space-y-4">
          {isLoading ? (
            <p className="text-center py-8">Loading conversations...</p>
          ) : conversations.length > 0 ? (
            conversations.map((conversation) => (
              <Card key={conversation.id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleOpenMessageDialog(conversation)}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.other_user?.avatar_url} />
                      <AvatarFallback>{conversation.other_user?.name?.charAt(0) || '?'}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium truncate">{conversation.other_user?.name}</h3>
                        <span className="text-xs text-gray-500">{formatDate(conversation.last_message_at)}</span>
                      </div>
                      
                      <p className="text-sm text-gray-700 truncate mb-1">
                        RE: {conversation.listing?.title || 'Item'}
                      </p>
                      
                      <p className="text-sm text-gray-500 truncate flex items-center gap-1">
                        {conversation.last_message || 'Start the conversation!'}
                        {conversation.unread_count ? (
                          <Badge variant="destructive" className="ml-1">{conversation.unread_count} new</Badge>
                        ) : null}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium">No conversations yet</h3>
              <p className="mt-1 text-gray-500 mb-6">You don't have any active conversations</p>
              <Button asChild>
                <Link to="/explore">Browse Items</Link>
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rentals" className="space-y-4">
          {rentals.length > 0 ? (
            rentals.map((rental) => (
              <Card key={rental.id} className="cursor-pointer hover:bg-gray-50" onClick={() => handleOpenRentalMessageDialog(rental)}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 flex-shrink-0 rounded-md overflow-hidden">
                      {rental.listing?.images?.[0] ? (
                        <img 
                          src={rental.listing.images[0]} 
                          alt={rental.listing.title}
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <div className="bg-gray-200 h-full w-full flex items-center justify-center text-gray-500 text-sm">
                          No image
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium truncate">{rental.listing?.title || 'Item'}</h3>
                        {rental.unread_count ? (
                          <Badge variant="destructive">{rental.unread_count} new</Badge>
                        ) : null}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-700">
                          {user.id === rental.renter_id ? 'Lender' : 'Renter'}: {rental.other_user?.name}
                        </p>
                        <p className="text-xs font-medium text-brand-purple">
                          Code: {rental.rental_code}
                        </p>
                      </div>
                      
                      <div className="mt-1 flex justify-between">
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={(e) => {
                          e.stopPropagation();
                          handleOpenRentalMessageDialog(rental);
                        }}>
                          <MessageCircle className="h-3 w-3 mr-1" />
                          Message
                        </Button>
                        
                        <Button size="sm" variant="outline" className="h-7 text-xs" asChild onClick={(e) => e.stopPropagation()}>
                          <Link to={`/listing/${rental.listing_id}`}>View Listing</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="mx-auto h-12 w-12 text-gray-300" />
              <h3 className="mt-4 text-lg font-medium">No rentals yet</h3>
              <p className="mt-1 text-gray-500 mb-6">You don't have any active rentals</p>
              <Button asChild>
                <Link to="/explore">Browse Items</Link>
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {messageDialogOpen && ((selectedConversation && (
        <MessagingDialog
          open={messageDialogOpen}
          onOpenChange={setMessageDialogOpen}
          recipientId={selectedConversation.other_user?.id || ''}
          recipientName={selectedConversation.other_user?.name || 'User'}
          recipientImage={selectedConversation.other_user?.avatar_url}
          listingTitle={selectedConversation.listing?.title || 'Item'}
          listingId={selectedConversation.listing_id}
          afterMessageSent={() => {
            // Refresh conversations
            fetchConversations();
          }}
        />
      )) || (selectedRental && (
        <MessagingDialog
          open={messageDialogOpen}
          onOpenChange={setMessageDialogOpen}
          recipientId={selectedRental.other_user?.id || ''}
          recipientName={selectedRental.other_user?.name || 'User'}
          recipientImage={selectedRental.other_user?.avatar_url}
          listingTitle={selectedRental.listing?.title || 'Item'}
          rentalId={selectedRental.id}
          afterMessageSent={() => {
            // Refresh rentals
            fetchRentals();
          }}
        />
      )))}
    </div>
  );
};

export default Messages;
