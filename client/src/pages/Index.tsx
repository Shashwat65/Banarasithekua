import HeroCarousel from "@/components/HeroCarousel";
import ProductGrid from "@/components/ProductGrid";
import CoreValues from "@/components/CoreValues";
import Story from "@/components/Story";
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

  useEffect(() => {
    const hash = location.hash ? location.hash.replace('#', '') : '';
    if (!hash) return;
    const el = document.getElementById(hash);
    if (!el) return;
    setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-background">
      <section id="hero">
        <HeroCarousel />
      </section>
      <section id="products">
        <ProductGrid />
      </section>
      {/* Combo section hidden for now */}
      <section id="values">
        <CoreValues />
      </section>
      <section id="story">
        <Story />
      </section>
      {/* Footer provided globally via Layout */}
    </div>
  );
};

export default Index;
