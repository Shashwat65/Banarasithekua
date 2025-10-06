import AnnouncementBanner from "@/components/AnnouncementBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ReactNode } from "react";

interface LayoutProps { children: ReactNode }

// Site-wide layout wrapper to provide consistent header & footer across pages
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AnnouncementBanner />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
