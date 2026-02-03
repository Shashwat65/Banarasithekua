const About = () => {
  return (
    <div className="min-h-screen bg-muted/10 py-16">
      <div className="container mx-auto px-6 max-w-4xl space-y-10">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-secondary/50">Our Story</p>
          <h1 className="text-4xl font-semibold text-secondary">Banarasi Thekua</h1>
          <p className="text-secondary/70">Traditional sweets crafted with recipes passed through generations in Varanasi.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="text-xl font-semibold text-secondary">Heritage</h2>
            <p className="text-muted-foreground mt-2">We combine local ingredients, time-honoured processes, and fresh preparation every day.</p>
          </div>
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="text-xl font-semibold text-secondary">Quality</h2>
            <p className="text-muted-foreground mt-2">Every batch is tested for taste, texture, and the warmth of homemade sweets.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
