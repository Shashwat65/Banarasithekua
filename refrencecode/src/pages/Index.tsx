import AnnouncementBanner from "@/components/AnnouncementBanner";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import ProductGrid from "@/components/ProductGrid";
import Reviews from "@/components/Reviews";
import CoreValues from "@/components/CoreValues";
import Story from "@/components/Story";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBanner />
      <Header />
      <HeroCarousel />
      <ProductGrid />
      <Reviews />
      <CoreValues />
      <Story />
      <Footer />
    </div>
  );
};

export default Index;
