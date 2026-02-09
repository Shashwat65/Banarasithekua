import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ganeshaMark from "@/assets/ganesha-mark.svg";
import traditionalThekua from "@/assets/traditional-thekua.jpg";
import jaggeryThekua from "@/assets/jaggery-thekua.jpg";
import coconutThekua from "@/assets/coconut-thekua.jpg";
import premiumMixedThekua from "@/assets/premium-mixed-thekua.jpg";
import { sliderAPI } from "@/services/api";
import { useQuery } from "@tanstack/react-query";

// Default images if database is empty
const defaultImages = [traditionalThekua, jaggeryThekua, coconutThekua, premiumMixedThekua];

const HERO_INTERVAL = 5000;

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch slider images from database
  const { data: sliderData } = useQuery({
    queryKey: ["sliders", "homepage"],
    queryFn: async () => {
      try {
        const res = await sliderAPI.getAllPublic();
        return Array.isArray(res.data?.data) ? res.data.data : [];
      } catch {
        return [];
      }
    },
  });

  // Use database images or fallback to defaults
  const slides = sliderData && sliderData.length > 0 
    ? sliderData.filter((x: any) => x && x.url).map((img: any) => img.url)
    : defaultImages;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, HERO_INTERVAL);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const currentImage = slides[currentSlide];

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-r from-[#f6e9d0] via-[#fef6e9] to-[#f8e4c6]"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-35 mix-blend-multiply"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd' opacity='0.35'%3E%3Cg fill='%23d3b27a'%3E%3Cpath d='M90 87a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z'/%3E%3Cpath d='M30 27a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z'/%3E%3Cpath d='M150 147a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute -top-16 -left-24 w-[320px] h-[320px] bg-gradient-primary rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-[-80px] right-[-120px] w-[380px] h-[380px] bg-gradient-primary rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 py-16 sm:py-24 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 bg-secondary/10 text-secondary px-4 py-2 rounded-full shadow-sm">
              <img src={ganeshaMark} alt="Banarasi Thekua ganesha badge" className="w-7 h-7 sm:w-8 sm:h-8" />
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.4em] uppercase">FEATURED</span>
            </div>

            <div className="max-w-2xl space-y-6">
              <div className="flex flex-wrap items-baseline gap-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[56px] leading-tight font-semibold text-secondary text-pretty">
                  Banarasi Thekua – Handcrafted Fresh Daily
                </h1>
                <span className="inline-flex items-center bg-accent text-accent-foreground font-bold text-sm sm:text-base px-4 py-1 rounded-full shadow">
                  Fresh Batch
                </span>
              </div>
              <p className="text-base sm:text-lg text-secondary/80 max-w-xl text-pretty">
                Discover our hand-crafted thekua collection. Pure ingredients, small-batch, delivered fast.
              </p>
              <div className="flex flex-wrap items-center gap-4 select-none">
                <div
                  className="px-6 py-4 text-sm sm:text-base font-semibold rounded-full shadow-xl shadow-primary/20 bg-primary text-primary-foreground pointer-events-none cursor-default"
                  aria-hidden="true"
                >
                  Shop Now
                </div>
                <div
                  className="px-4 py-2 rounded-full border border-primary/30 bg-white/60 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-secondary font-medium pointer-events-none cursor-default"
                  aria-hidden="true"
                >
                  Use Code SHUDDH
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-secondary/70">
                <span className="inline-flex h-2 w-2 rounded-full bg-secondary/60" />
                Made with pure ghee
              </div>
            </div>
          </div>

          {/* Full-width Slider Image */}
          <div className="relative">
            <div className="absolute inset-0 rounded-[32px] sm:rounded-[40px] bg-white/70 backdrop-blur-sm border border-white/50 shadow-[0_28px_48px_rgba(84,48,33,0.16)]" />
            <div className="relative overflow-hidden rounded-[32px] sm:rounded-[40px]">
              {/* Slider Images */}
              <div className="relative aspect-[4/3] sm:aspect-[16/10]">
                {slides.map((image: string, index: number) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      index === currentSlide ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Banarasi Thekua ${index + 1}`}
                      className="w-full h-full object-cover rounded-[28px] sm:rounded-[36px]"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
              {/* Overlay text */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent p-6 rounded-b-[28px] sm:rounded-b-[36px]">
                <p className="text-white text-sm sm:text-base font-semibold tracking-[0.3em] uppercase text-center">
                  Banarasi Thekua
                </p>
              </div>
            </div>
            <div className="absolute -top-8 -right-10 w-40 sm:w-52 opacity-60 rotate-12 pointer-events-none">
              <img src={ganeshaMark} alt="ganesha watermark" className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Carousel controls */}
      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-6 sm:bottom-8 flex items-center justify-between px-6 sm:px-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevSlide}
            className="hidden md:flex h-11 w-11 rounded-full bg-white/80 hover:bg-white shadow-lg text-secondary"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="mx-auto flex gap-2">
            {slides.map((_: any, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "w-10 bg-secondary" : "w-3 bg-secondary/40"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={nextSlide}
            className="hidden md:flex h-11 w-11 rounded-full bg-white/80 hover:bg-white shadow-lg text-secondary"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}
    </section>
  );
};

export default HeroCarousel;