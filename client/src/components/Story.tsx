const Story = () => {
  return (
    <section id="story" className="py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto text-center space-y-5">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.5em] text-secondary/50">
            Origins
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-secondary">
            The Banarasi Thekua Story
          </h2>
          <p className="text-base text-secondary/70 max-w-3xl mx-auto">
            A Maruti Nagar family kitchen determined to put Banaras on India&apos;s mithai map, one mindful batch of thekua at a time.
          </p>
        </div>

        <div className="mt-16 grid lg:grid-cols-[0.6fr_1.4fr] gap-12 items-start">
          <div className="space-y-6 lg:sticky lg:top-28">
            <article className="rounded-[24px] border border-secondary/20 bg-white/70 backdrop-blur-sm px-8 py-10 shadow-[0_24px_48px_rgba(84,48,33,0.12)] text-left">
              <h3 className="text-xl sm:text-2xl font-semibold text-secondary mb-4">Our Mission</h3>
              <p className="text-sm sm:text-base text-secondary/70 leading-relaxed">
                To be India&apos;s most trusted festive brand by reimagining Banarasi classics with uncompromised hygiene, traceable sourcing, and an unwavering love for tradition.
              </p>
            </article>

            <div className="rounded-[24px] border border-secondary/15 bg-white/60 px-8 py-8 text-left shadow-sm">
              <h4 className="text-base sm:text-lg font-semibold text-secondary mb-3">From A Kitchen Mishap</h4>
              <p className="text-sm text-secondary/70 leading-relaxed">
                The spark came when our founder fell ill after a market-bought thekua. Determined to fix what was broken, the family perfected a recipe that honoured dadi&apos;s craft yet met modern safety.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[28px] border border-secondary/10 bg-white/90 h-full min-h-[420px] p-8 shadow-sm">
              <p className="text-sm uppercase tracking-[0.55em] text-secondary/50">Brand Chronicle</p>
              <h3 className="mt-4 text-2xl sm:text-3xl font-serif font-semibold text-secondary">Our Story & Craft</h3>
              <p className="mt-4 text-sm sm:text-base text-secondary/70 max-w-xl">
                Banarasi Thekua began as a small family kitchen in Maruti Nagar. Guided by a decades‑old recipe, we set out to preserve the authentic texture and warm, caramelised flavour of thekua while bringing modern food safety and consistent batches to every table.
              </p>

              <div className="mt-6 grid gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">1998</div>
                  <div className="text-sm text-secondary/70">
                    Roots: a grandmother’s time-tested thekua recipe became a family tradition.
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">2018</div>
                  <div className="text-sm text-secondary/70">Micro‑batch production &amp; hygienic packing introduced for consistent quality.</div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium">2024</div>
                  <div className="text-sm text-secondary/70">Pan‑India dispatch and curated gift hampers launched—perfect for celebrations.</div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <a href="/about" className="inline-block rounded-full bg-primary text-primary-foreground px-5 py-3 text-sm font-semibold shadow hover:bg-primary/95">Learn more about our journey</a>
                <span className="text-sm text-secondary/60">• Crafted with traceable ingredients &amp; pure ghee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;