import { useEffect, useState } from 'react';
import { combosAPI } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <p className="text-xs uppercase tracking-[0.5em] text-secondary/50">Curated Bundles</p>
          <h2 className="text-4xl md:text-5xl font-semibold text-secondary">Combo Products</h2>
          <p className="text-base text-secondary/70">Hand-picked assortments combining our most loved flavours for gifting & celebrations.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {combos.map(combo => {
            const onSale = combo.originalPrice && combo.price && combo.originalPrice > combo.price;
            return (
              <Card key={combo._id} className="group overflow-hidden border-border/60">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{combo.name}</span>
                    {onSale && <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded-full">Save {Math.round(((combo.originalPrice!-combo.price!)/combo.originalPrice!)*100)}%</span>}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {combo.description && <p className="text-sm text-secondary/70 line-clamp-3">{combo.description}</p>}
                  <div className="flex items-baseline gap-3">
                    {combo.price !== undefined && <span className="text-lg font-semibold">₹{combo.price.toFixed(2)}</span>}
                    {onSale && <span className="text-sm line-through text-secondary/40">₹{combo.originalPrice?.toFixed(2)}</span>}
                  </div>
                  <Button size="sm" variant="outline" className="rounded-full">View Details</Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ComboGrid;
