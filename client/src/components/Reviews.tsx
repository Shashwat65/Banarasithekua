const reviewGallery = [
  {
    src: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=320&q=80",
    name: "Ritika & Aman",
    city: "Pune",
  },
  {
    src: "https://images.unsplash.com/photo-1542293787938-4d2226c12e77?auto=format&fit=crop&w=320&q=80",
    name: "Kavya",
    city: "Delhi NCR",
  },
  {
    src: "https://images.unsplash.com/photo-1530023367847-a683933f4175?auto=format&fit=crop&w=320&q=80",
    name: "The Goyal Family",
    city: "Lucknow",
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
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 mb-12">
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
              <figure
                key={`${review.name}-${index}`}
                className="min-w-[240px] snap-start"
              >
                <div className="rounded-[28px] overflow-hidden border border-border/60 bg-white shadow-[0_30px_50px_rgba(84,48,33,0.14)]">
                  <div className="relative h-64">
                    <img
                      src={review.src}
                      alt={`${review.name} from ${review.city}`}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-secondary/90 via-secondary/60 to-transparent p-5 text-white">
                      <p className="text-base font-semibold">
                        {review.name}
                      </p>
                      <p className="text-xs tracking-[0.35em] uppercase">
                        {review.city}
                      </p>
                    </div>
                  </div>
                </div>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;