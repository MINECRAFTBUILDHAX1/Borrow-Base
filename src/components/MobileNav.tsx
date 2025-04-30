
import { Link, useLocation } from "react-router-dom";
import { Home, Search, PlusCircle, MessageCircle, User } from "lucide-react";

const MobileNav = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
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
          }`}
        >
          <MessageCircle className="h-5 w-5" />
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
