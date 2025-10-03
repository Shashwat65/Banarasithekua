import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

// Generic Carousel for images or custom slides
// Props:
// - items: array of any
// - renderItem: (item, index) => ReactNode
// - autoPlayMs?: number
// - className?: string
// - controls?: boolean
// - perView?: number (for product slider)
export default function Carousel({
  items = [],
  renderItem,
  autoPlayMs = 6000,
  className = "",
  controls = true,
  perView = 1,
}) {
  const [index, setIndex] = useState(0);
  const total = items.length;
  const intervalRef = useRef(null);

  const maxIndex = useMemo(() => {
    if (perView <= 1) return total - 1;
    return Math.max(0, total - perView);
  }, [total, perView]);

  const next = () => setIndex((v) => (v >= maxIndex ? 0 : v + 1));
  const prev = () => setIndex((v) => (v <= 0 ? maxIndex : v - 1));

  useEffect(() => {
    if (!autoPlayMs || total <= 1) return;
    intervalRef.current = setInterval(next, autoPlayMs);
    return () => clearInterval(intervalRef.current);
  }, [autoPlayMs, total, maxIndex]);

  if (!items || total === 0) return null;

  // For perView>1 we render a horizontal list and translate
  return (
    <div className={`relative w-full ${className}`}>
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-${(index * 100) / perView}%)`,
            width: `${(100 * total) / perView}%`,
          }}
        >
          {items.map((item, i) => (
            <div key={i} style={{ width: `${100 / total}%` }} className="px-2">
              {renderItem(item, i)}
            </div>
          ))}
        </div>
      </div>
      {controls && total > perView ? (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={prev}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/80"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={next}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/80"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </Button>
        </>
      ) : null}
    </div>
  );
}
