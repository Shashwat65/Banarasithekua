const FAQ = () => {
  const faqs = [
    { q: "Where do you ship?", a: "We ship across India." },
    { q: "How long does delivery take?", a: "Typically 3-7 business days depending on location." },
    { q: "Do you accept returns?", a: "Due to perishability, returns are not accepted. Contact us for any issues." },
    { q: "Are your products vegetarian?", a: "Yes, all our products are vegetarian." },
  ];

  return (
    <div className="min-h-screen bg-muted/10 py-16">
      <div className="container mx-auto px-6 max-w-3xl space-y-8">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-secondary/50">Support</p>
          <h1 className="text-3xl font-semibold text-secondary">Frequently Asked Questions</h1>
          <p className="text-secondary/70">Answers to the most common questions about our products and services.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((item, idx) => (
            <div key={idx} className="rounded-2xl border bg-card p-5">
              <h3 className="font-medium text-secondary">{item.q}</h3>
              <p className="text-sm text-muted-foreground mt-2">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
