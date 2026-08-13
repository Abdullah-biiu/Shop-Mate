import { Outlet } from "react-router-dom";

import Navbar from "../components/Layout/Navbar";
import Sidebar from "../components/Layout/Sidebar";
import SearchOverlay from "../components/Layout/SearchOverlay";
import CartSidebar from "../components/Layout/CartSidebar";
import ProfilePanel from "../components/Layout/ProfilePanel";
import LoginModal from "../components/Layout/LoginModal";
import Footer from "../components/Layout/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Sidebar />
      <SearchOverlay />
      <CartSidebar />
      <ProfilePanel />
      <LoginModal />

      <Outlet />

      <Footer />
    </div>
  );
};

export default MainLayout;