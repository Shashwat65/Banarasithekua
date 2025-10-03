import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import Footer from "./footer";
import AnnouncementBar from "./announcement-bar";

function ShoppingLayout() {
  return (
    <div className="flex flex-col bg-white overflow-hidden">
  {/* Promo bar and header */}
  <AnnouncementBar />
      <ShoppingHeader />
      <main className="flex flex-col w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default ShoppingLayout;
