import { useEffect, useState } from 'react';
import { combosAPI } from '@/services/api';
import ProductCard from '@/components/ProductCard';

interface Combo {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  image?: string;
  products?: any[];
}

const ComboGrid = () => {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
  const res = await combosAPI.getAllPublic();
        setCombos(res.data.data || []);
      } catch (e) {
        // ignore
      } finally { setLoading(false); }
    })();
  }, []);
  if (loading && combos.length === 0) return <div className="py-16 text-center text-sm text-muted-foreground">Loading combos...</div>;
  if (combos.length === 0) return null;

  const fallbackImages = [
    'https://images.unsplash.com/photo-1604908554200-6ec9a1822d5c?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606756790138-261f08b9b001?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1601054773570-1781993159d7?q=80&w=800&auto=format&fit=crop'
  ];
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <p className="text-xs uppercase tracking-[0.5em] text-secondary/50">Curated Bundles</p>
          <h2 className="text-4xl md:text-5xl font-semibold text-secondary">Combo Products</h2>
          <p className="text-base text-secondary/70">Hand-picked assortments combining our most loved flavours for gifting & celebrations.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {combos.map((combo, idx) => {
            const img = combo.image || fallbackImages[idx % fallbackImages.length];
            return (
              <div key={combo._id}>
                <ProductCard
                  id={combo._id}
                  name={combo.name}
                  image={img}
                  price={typeof combo.price === 'number' ? combo.price : (combo.price ? Number(combo.price) : 0)}
                  originalPrice={combo.originalPrice ? Number(combo.originalPrice) : undefined}
                  isOnSale={Boolean(combo.originalPrice && combo.price && combo.originalPrice > combo.price)}
                  isSoldOut={false}
                  description={combo.description}
                  slug={combo.slug}
                  category="Combo"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ComboGrid;
