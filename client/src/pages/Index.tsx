import AnnouncementBanner from "@/components/AnnouncementBanner";
import Header from "@/components/Header";
import HeroCarousel from "@/components/HeroCarousel";
import ProductGrid from "@/components/ProductGrid";
import Reviews from "@/components/Reviews";
import CoreValues from "@/components/CoreValues";
import Story from "@/components/Story";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    // If navigated with state.scrollTarget from Header, perform delayed scroll
    const state = location.state as any;
    if (state?.scrollTarget) {
      const target = state.scrollTarget as string;
      // Clear the state scroll target to avoid re-scrolling on other navigations
      history.replaceState({ ...history.state, usr: { ...history.state?.usr, scrollTarget: undefined } }, "");
      setTimeout(() => {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBanner />
      <Header />
      <section id="hero">
        <HeroCarousel />
      </section>
      <section id="products">
        <ProductGrid />
      </section>
      <section id="reviews">
        <Reviews />
      </section>
      <section id="values">
        <CoreValues />
      </section>
      <section id="story">
        <Story />
      </section>
      <section id="footer">
        <Footer />
      </section>
    </div>
  );
};

export default Index;
