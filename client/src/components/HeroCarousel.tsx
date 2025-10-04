import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ganeshaMark from "@/assets/ganesha-mark.svg";
import traditionalThekua from "@/assets/traditional-thekua.jpg";
import jaggeryThekua from "@/assets/jaggery-thekua.jpg";
import coconutThekua from "@/assets/coconut-thekua.jpg";
import premiumMixedThekua from "@/assets/premium-mixed-thekua.jpg";

const defaultSlides = [
  {
    id: 1,
    badge: "Ganesh Chaturthi Special",
    title: "Banarasi Thekua For Auspicious Beginnings",
    highlight: "25% OFF",
    copy: "Celebrate Bappa with slow-roasted Banarasi thekua hampers, handcrafted in ghee and delivered pan-India within 24 hours.",
    code: "GANPATI25",
    cta: "Shop Festive Hampers",
    accent: "Freshly packed each morning",
    images: [traditionalThekua, jaggeryThekua, premiumMixedThekua],
  },
  {
    id: 2,
    badge: "Community Favourite",
    title: "Jaggery Classics From Banaras Lanes",
    highlight: "Buy 2 Get 1",
    copy: "Blend your own box with jaggery, coconut, and khoya edits perfected from Maruti Nagar kitchens.",
    code: "SWEETTRADITION",
    cta: "Build Your Box",
    accent: "Ships fresh daily",
    images: [jaggeryThekua, coconutThekua, traditionalThekua],
  },
  {
    id: 3,
    badge: "Limited Release",
    title: "Banarasi Celebration Trunk",
    highlight: "Free Shipping",
    copy: "A keepsake trunk with signature thekua jars, spice sachets, and artisanal decor from Varanasi artisans.",
    code: "CELEBRATE",
    cta: "Pre-Order Now",
    accent: "Dispatch starts 5 Oct",
    images: [premiumMixedThekua, coconutThekua, jaggeryThekua],
  },
];

const HERO_INTERVAL = 7000;

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Read admin-provided slider images from localStorage (set via Admin panel)
  const adminSliderImages = useMemo(() => {
    try {
      const raw = localStorage.getItem("hero_slider_images");
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        return parsed.filter((x) => x && typeof x.url === "string" && x.url.length > 0);
      }
      return [];
    } catch {
      return [];
    }
  }, []);

  // Chunk images into groups of 3 to match the layout
  const chunkedSlides = useMemo(() => {
    if (!adminSliderImages.length) return defaultSlides;
    const chunks: string[][] = [];
    for (let i = 0; i < adminSliderImages.length; i += 3) {
      chunks.push(adminSliderImages.slice(i, i + 3).map((img: any) => img.url));
    }
    // Build slides from chunks with generic copy
    return chunks.map((images, idx) => ({
      id: idx + 1,
      badge: "Featured",
      title: "Banarasi Thekua – Handcrafted Fresh Daily",
      highlight: "Fresh Batch",
      copy: "Discover our hand-crafted thekua collection. Pure ingredients, small-batch, delivered fast.",
      code: "SHUDDH",
      cta: "Shop Now",
      accent: "Made with pure ghee",
      images,
    }));
  }, [adminSliderImages]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % chunkedSlides.length);
    }, HERO_INTERVAL);

    return () => clearInterval(timer);
  }, [chunkedSlides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % chunkedSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + chunkedSlides.length) % chunkedSlides.length);

  const slide = chunkedSlides[currentSlide];

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
              <span className="text-[10px] sm:text-xs font-semibold tracking-[0.4em] uppercase">{slide.badge}</span>
            </div>

            <div className="max-w-2xl space-y-6">
              <div className="flex flex-wrap items-baseline gap-4">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[56px] leading-tight font-semibold text-secondary text-pretty">
                  {slide.title}
                </h1>
                <span className="inline-flex items-center bg-accent text-accent-foreground font-bold text-sm sm:text-base px-4 py-1 rounded-full shadow">
                  {slide.highlight}
                </span>
              </div>
              <p className="text-base sm:text-lg text-secondary/80 max-w-xl text-pretty">
                {slide.copy}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-4 text-sm sm:text-base font-semibold rounded-full shadow-xl shadow-primary/30">
                  {slide.cta}
                </Button>
                <div className="px-4 py-2 rounded-full border border-primary/40 bg-white/70 text-[10px] sm:text-xs uppercase tracking-[0.3em] text-secondary font-medium">
                  Use Code {slide.code}
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-secondary/70">
                <span className="inline-flex h-2 w-2 rounded-full bg-secondary/60" />
                {slide.accent}
              </div>
            </div>
          </div>

          {/* Imagery */}
          <div className="relative">
            <div className="absolute inset-0 rounded-[32px] sm:rounded-[40px] bg-white/70 backdrop-blur-sm border border-white/50 shadow-[0_28px_48px_rgba(84,48,33,0.16)]" />
            <div className="relative grid grid-cols-3 gap-3 sm:gap-4 p-5 sm:p-8">
              {slide.images.map((image: string, index: number) => (
                <div
                  key={`${slide.id}-${index}`}
                  className="bg-white rounded-[20px] sm:rounded-[28px] shadow-card overflow-hidden border border-border/60"
                >
                  <img
                    src={image}
                    alt="Festive thekua packaging"
                    className="h-40 sm:h-48 md:h-52 w-full object-cover"
                    draggable={false}
                  />
                  <div className="px-3 sm:px-4 py-3 text-center">
                    <p className="text-[9px] sm:text-[10px] font-semibold tracking-[0.4em] text-secondary/70 uppercase">
                      Banarasi Thekua
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute -top-8 -right-10 w-40 sm:w-52 opacity-60 rotate-12">
              <img src={ganeshaMark} alt="ganesha watermark" className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Carousel controls */}
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
          {chunkedSlides.map((_, index) => (
            <button
              key={_.id}
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
    </section>
  );
};

export default HeroCarousel;