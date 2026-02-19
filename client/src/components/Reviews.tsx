import { Star } from "lucide-react";

const reviewGallery = [
  {
    src: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=320&q=80",
    name: "Ritika & Aman",
    city: "Pune",
  },
  {
    src: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?auto=format&fit=crop&w=320&q=80",
    name: "Chef Ananya",
    city: "Mumbai",
  },
  {
    src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=320&q=80",
    name: "Bhaskar",
    city: "Indore",
  },
  {
    src: "https://images.unsplash.com/photo-1522770179533-24471fcdba45?auto=format&fit=crop&w=320&q=80",
    name: "Tanishka",
    city: "Bengaluru",
  },
];

const Reviews = () => {
  return (
    <section id="reviews" className="py-24">
      <div className="container mx-auto px-6 space-y-24">
        {/* Reviews carousel */}
        <div className="space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            <div>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.5em] text-secondary/50">Voices Of Trust</p>
              <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold text-secondary">
                Reviews
              </h2>
            </div>
            <p className="max-w-2xl text-secondary/70 text-sm sm:text-base">
              Families across India are choosing Banarasi Thekua for their festive platters. Here are a few of them sharing the joy of mithai done right.
            </p>
          </div>
          <div className="relative">
            <div className="flex overflow-x-auto gap-8 pb-6 lg:pb-4 snap-x snap-mandatory">
              {reviewGallery.map((review, index) => (
                <figure key={`${review.name}-${index}`} className="min-w-[240px] snap-start">
                  <div className="rounded-[28px] overflow-hidden border border-border/60 bg-white shadow-[0_30px_50px_rgba(84,48,33,0.14)]">
                    <div className="relative h-64 group">
                      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-neutral-200/60 to-neutral-300/40 dark:from-neutral-700/40 dark:to-neutral-600/30" aria-hidden="true" />
                      <img
                        src={review.src}
                        alt={`${review.name} from ${review.city}`}
                        className="h-full w-full object-cover opacity-0 transition-opacity duration-500"
                        onLoad={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '1'; (e.currentTarget.previousElementSibling as HTMLElement)?.remove(); }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/600x800?text=Review';
                          (e.currentTarget as HTMLImageElement).style.opacity = '1';
                        }}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-secondary/90 via-secondary/60 to-transparent p-5 text-white">
                        <p className="text-base font-semibold">{review.name}</p>
                        <p className="text-xs tracking-[0.35em] uppercase">{review.city}</p>
                      </div>
                    </div>
                  </div>
                </figure>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <TeamSection />
      </div>
    </section>
  );
      </div>
    </section