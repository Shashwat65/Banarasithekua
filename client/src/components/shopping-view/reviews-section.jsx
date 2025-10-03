export default function ReviewsSection() {
  const people = [
    { name: "Ritika & Aman", city: "Pune", img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=320&q=80" },
    { name: "Kavya", city: "Delhi NCR", img: "https://images.unsplash.com/photo-1542293787938-4d2226c12e77?auto=format&fit=crop&w=320&q=80" },
    { name: "The Goyal Family", city: "Lucknow", img: "https://images.unsplash.com/photo-1530023367847-a683933f4175?auto=format&fit=crop&w=320&q=80" },
  ];
  return (
    <section className="py-12 bg-secondary/40">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Reviews</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {people.map((p, i) => (
            <div key={i} className="rounded-lg border bg-card">
              <img src={p.img} alt={p.name} className="w-full h-40 object-cover rounded-t-lg" />
              <div className="p-4">
                <div className="font-semibold">{p.name}</div>
                <div className="text-xs text-muted-foreground">{p.city.toUpperCase()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
