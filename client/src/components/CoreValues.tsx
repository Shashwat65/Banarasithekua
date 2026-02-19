import { Sparkles, ShieldCheck, HeartHandshake, Timer } from "lucide-react";

const CoreValues = () => {
  const values = [
    {
      icon: <ShieldCheck className="w-10 h-10 text-secondary" />,
      title: "Premium Ingredients",
      description: "Only ghee, jaggery, and grains certified by FSSAI partners make it into our mithai."
    },
    {
      icon: <Sparkles className="w-10 h-10 text-secondary" />,
      title: "Handcrafted Fresh",
      description: "Every thekua is shaped by hand in micro-batches, sealed the same day for freshness."
    },
    {
      icon: <HeartHandshake className="w-10 h-10 text-secondary" />,
      title: "Ethical Partnerships",
      description: "We work with women-led self-help groups across Bihar to ensure equitable livelihoods."
    },
    {
      icon: <Timer className="w-10 h-10 text-secondary" />,
      title: "Right On Time",
      description: "Guaranteed dispatch within 24 hours with real-time tracking to your doorstep."
    }
  ];

  return (
    <section id="values" className="py-24 bg-[#f0f0d6]/80">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-16">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.5em] text-secondary/50">Why Banarasi Thekua</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-secondary">
            Our Core Values
          </h2>
          <p className="text-sm sm:text-base text-secondary/70">
            Rooted in the kitchens of North India, our promise blends heritage with modern hygiene standards that every family can trust.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-[24px] border border-secondary/20 bg-white/70 backdrop-blur-sm px-8 py-10 shadow-[0_32px_48px_rgba(84,48,33,0.12)]"
            >
              <div className="mb-6 flex justify-center">
                <span className="inline-flex items-center justify-center rounded-full bg-secondary/10 p-5">
                  {value.icon}
                </span>
              </div>
              <h3 className="text-2xl font-semibold text-secondary text-center mb-4">
                {value.title}
              </h3>
              <p className="text-sm text-secondary/70 leading-relaxed text-center">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValues;