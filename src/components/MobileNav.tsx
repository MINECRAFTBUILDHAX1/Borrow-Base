
import { Link, useLocation } from "react-router-dom";
import { Home, Search, PlusCircle, MessageCircle, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const MobileNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      
      // Set up real-time subscription for new messages
      const messageSubscription = supabase
        .channel('public:messages:mobile')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `is_read=eq.false,sender_id=neq.${user.id}`
        }, () => {
          fetchUnreadCount();
        })
        .subscribe();
        
      // Set up subscription for message updates (when messages are read)
      const messageUpdateSubscription = supabase
        .channel('public:messages:updates:mobile')
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `is_read=eq.true`
        }, () => {
          fetchUnreadCount();
        })
        .subscribe();
      
      return () => {
        supabase.removeChannel(messageSubscription);
        supabase.removeChannel(messageUpdateSubscription);
      };
    }
  }, [user]);
  
  const fetchUnreadCount = async () => {
    try {
      if (!user) return;
      
      // Count unread messages where the user is the recipient
      const { count: conversationCount, error: convError } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)
        .neq('sender_id', user.id || '')
        .not('conversation_id', 'is', null);

      const { count: rentalCount, error: rentalError } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)
        .neq('sender_id', user.id || '')
        .not('rental_id', 'is', null);
        
      if (convError || rentalError) {
        console.error("Error fetching unread counts:", convError || rentalError);
        return;
      }
      
      setUnreadCount((conversationCount || 0) + (rentalCount || 0));
    } catch (error) {
      console.error('Error fetching unread messages:', error);
    }
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-5 h-16">
        <Link
          to="/"
          className={`flex flex-col items-center justify-center ${
            isActive("/") ? "text-brand-purple" : "text-gray-500"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link
          to="/explore"
          className={`flex flex-col items-center justify-center ${
            isActive("/explore") ? "text-brand-purple" : "text-gray-500"
          }`}
        >
          <Search className="h-5 w-5" />
          <span className="text-xs mt-1">Explore</span>
        </Link>
        <Link
          to="/create-listing"
          className={`flex flex-col items-center justify-center ${
            isActive("/create-listing") ? "text-brand-purple" : "text-gray-500"
          }`}
        >
          <PlusCircle className="h-5 w-5" />
          <span className="text-xs mt-1">List</span>
        </Link>
        <Link
          to="/messages"
          className={`flex flex-col items-center justify-center ${
            isActive("/messages") ? "text-brand-purple" : "text-gray-500"
          } relative`}
        >
          <MessageCircle className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
          <span className="text-xs mt-1">Messages</span>
        </Link>
        <Link
          to="/profile/me"
          className={`flex flex-col items-center justify-center ${
            isActive("/profile/me") ? "text-brand-purple" : "text-gray-500"
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNav;
