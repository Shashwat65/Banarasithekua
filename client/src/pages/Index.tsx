import HeroCarousel from "@/components/HeroCarousel";
import ProductGrid from "@/components/ProductGrid";
import CoreValues from "@/components/CoreValues";
import Story from "@/components/Story";
import VideoReviews from "@/components/VideoReviews";
import BannerDisplay from "@/components/BannerDisplay";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();

  useEffect(() => {
    const state = location.state as any;
    if (state?.scrollTarget) {
      const target = state.scrollTarget as string;
      history.replaceState({ ...history.state, usr: { ...history.state?.usr, scrollTarget: undefined } }, "");
      setTimeout(() => {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  }, [location]);

  useEffect(() => {
    const hash = location.hash ? location.hash.replace("#", "") : "";
    if (!hash) return;
    const el = document.getElementById(hash);
    if (!el) return;
    setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-background">
      <section id="hero">
        <HeroCarousel />
      </section>
      <BannerDisplay position="header" className="container mx-auto px-6 py-4" />
      <section id="products">
        <ProductGrid />
      </section>
      <BannerDisplay position="main" className="container mx-auto px-6 py-8" />
      <section id="videos">
        <VideoReviews />
      </section>
      <section id="values">
        <CoreValues />
      </section>
      <section id="story">
        <Story />
      </section>
      <BannerDisplay position="footer" className="container mx-auto px-6 py-8" />
    </div>
  );
};

export default Index;
