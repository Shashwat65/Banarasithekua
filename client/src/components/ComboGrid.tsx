import { useEffect, useState } from 'react';
import { combosAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
            const onSale = combo.originalPrice && combo.price && combo.originalPrice > combo.price;
            const img = combo.image || fallbackImages[idx % fallbackImages.length];
            return (
              <Link key={combo._id} to={`/products/${combo.slug}`} className="block focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-xl">
                <Card className="group overflow-hidden border-border/60 h-full">
                  {img && (
                    <div className="relative overflow-hidden">
                      <img src={img} alt={combo.name} className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]" />
                      {onSale && (
                        <span className="absolute top-3 left-3 text-[10px] font-semibold bg-accent text-accent-foreground px-2 py-1 rounded-full tracking-wide shadow">SAVE {Math.round(((combo.originalPrice!-combo.price!)/combo.originalPrice!)*100)}%</span>
                      )}
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-base">
                      <span className="line-clamp-1">{combo.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    {combo.description && <p className="text-sm text-secondary/70 line-clamp-2 min-h-[2.5rem]">{combo.description}</p>}
                    <div className="flex items-baseline gap-3">
                      {combo.price !== undefined && <span className="text-lg font-semibold">₹{combo.price.toFixed(2)}</span>}
                      {onSale && <span className="text-sm line-through text-secondary/40">₹{combo.originalPrice?.toFixed(2)}</span>}
                    </div>
                    <Button size="sm" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 w-full">View Options</Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ComboGrid;
