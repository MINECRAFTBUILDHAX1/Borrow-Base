
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, User } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import BorrowBaseLogo from "./BorrowBaseLogo";

const Navbar = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <BorrowBaseLogo size="sm" />
          </Link>
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </nav>
    );
  }
  
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center">
              <BorrowBaseLogo />
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/explore" className="text-gray-600 hover:text-brand-purple transition-colors">
                Explore
              </Link>
              <Link to="/create-listing" className="text-gray-600 hover:text-brand-purple transition-colors">
                List Your Item
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="py-2 pl-10 pr-4 border border-gray-300 rounded-full w-[240px] focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-transparent"
                placeholder="Search for items..."
              />
            </div>
            <Button variant="outline">Log in</Button>
            <Button>Sign up</Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
