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
            <div className="rounded-[36px] border-2 border-dashed border-secondary/30 bg-white/80 h-full min-h-[420px] flex flex-col items-center justify-center text-secondary/40 text-center px-10 py-16">
              <p className="text-sm uppercase tracking-[0.55em]">Brand Chronicle</p>
              <h3 className="mt-6 text-2xl sm:text-3xl font-semibold text-secondary/60">
                Reserved For Your Storytelling Canvas
              </h3>
              <p className="mt-4 text-sm sm:text-base text-secondary/50 max-w-xl">
                Use this generous space for timelines, founders&apos; portraits, or a manifesto. The airy layout mirrors the original design with breathing room for rich brand copy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;