
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileNav from "./MobileNav";

const Layout = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pb-20">
        <Outlet />
      </main>
      <Footer />
      {isMobile && <MobileNav />}
    </div>
  );
};

export default Layout;
