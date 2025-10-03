export default function ValuesSection() {
  const items = [
    { title: "Premium Ingredients", body: "Only ghee, jaggery and grains certified by FSSAI partners." },
    { title: "Handcrafted Fresh", body: "Micro-batches shaped by hand, sealed the same day for freshness." },
    { title: "Ethical Partnerships", body: "Women-led self-help groups across Bihar for equitable livelihoods." },
    { title: "Right On Time", body: "Dispatch within 24 hours with doorstep tracking." },
  ];
  return (
    <section className="py-12 bg-accent/30">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Our Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((it, idx) => (
            <div key={idx} className="rounded-lg border bg-card p-4">
              <div className="font-semibold">{it.title}</div>
              <p className="text-sm text-muted-foreground mt-2">{it.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
