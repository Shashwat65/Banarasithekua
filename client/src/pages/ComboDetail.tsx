import { useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { toast } from "sonner";
import { combosAPI } from "@/services/api";

const fetchCombo = async (idOrSlug: string) => {
  try {
    const res = await combosAPI.getById(idOrSlug);
    return res.data?.data ?? null;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export default function ComboDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const { data, isLoading } = useQuery({
    queryKey: ["combo", slug],
    queryFn: () => fetchCombo(slug || ""),
    enabled: Boolean(slug),
    retry: false,
  });

  const combo = useMemo(() => {
    if (!data) return null;
    const id = data._id || data.id;
    const image = data.image || data.images?.[0]?.url || data.productIds?.[0]?.image;
    return {
      ...data,
      id,
      image,
      slug: data.slug || id,
      name: data.name || "Combo",
      price: typeof data.price === "number" ? data.price : Number(data.price || 0),
      originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
      items: Array.isArray(data.productIds) ? data.productIds : Array.isArray(data.products) ? data.products : [],
    };
  }, [data]);

  const handleAddToCart = () => {
    if (!combo) return;
    addItem({
      id: combo.id,
      slug: combo.slug,
      name: combo.name,
      price: combo.price,
      quantity: 1,
      image: combo.image,
    });
    toast(`${combo.name} added to cart`);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }

  if (!combo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center px-4">
        <p className="text-lg font-semibold">Combo not found.</p>
        <Link to="/products">
          <Button>Back to catalog</Button>
        </Link>
      </div>
    );
  }

  const savings = combo.originalPrice
    ? Math.max(0, combo.originalPrice - combo.price)
    : 0;

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-6 py-16 grid gap-12 lg:grid-cols-2">
        <div className="lg:col-span-2 mb-4 flex justify-between items-center">
          <Button
            variant="ghost"
            className="px-3"
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/products"))}
          >
            ← Back
          </Button>
          <Link to="/cart" className="text-sm underline text-secondary/70 hover:text-secondary">View Cart</Link>
        </div>
        <div className="relative">
          {combo.image ? (
            <img
              src={combo.image}
              alt={combo.name}
              className="w-full rounded-3xl shadow-xl"
            />
          ) : (
            <div className="h-[480px] rounded-3xl bg-muted flex items-center justify-center">
              No image available
            </div>
          )}
          {combo.originalPrice && combo.originalPrice > combo.price ? (
            <Badge className="absolute top-6 left-6 bg-accent text-accent-foreground">
              Save ₹{savings}
            </Badge>
          ) : null}
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Link to="/products" className="text-sm text-secondary/60 hover:text-secondary">
              ← Back to all products
            </Link>
            <h1 className="text-4xl font-semibold text-secondary">{combo.name}</h1>
            <p className="text-secondary/70 leading-relaxed text-base">
              {combo.description || "Curated combo featuring our most loved thekua flavours."}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-end gap-4">
              <span className="text-3xl font-semibold text-primary">₹{combo.price.toFixed(2)}</span>
              {combo.originalPrice && combo.originalPrice > combo.price ? (
                <span className="text-lg text-secondary/50 line-through">
                  ₹{combo.originalPrice.toFixed(2)}
                </span>
              ) : null}
            </div>
            <p className="text-sm uppercase tracking-[0.35em] text-secondary/60">Combo Pack</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleAddToCart}
            >
              Add Combo to Cart
            </Button>
          </div>

          {combo.items.length > 0 ? (
            <div className="border border-border/60 rounded-2xl p-6 space-y-3 text-sm text-secondary/70">
              <p className="text-xs uppercase tracking-[0.3em] text-secondary/50">Included Items</p>
              <ul className="space-y-2">
                {combo.items.map((item: any) => (
                  <li key={item._id || item.id} className="flex items-center justify-between gap-2">
                    <span className="font-medium text-secondary/80">{item.name || item.title || "Item"}</span>
                    {item.price ? <span>₹{Number(item.price).toFixed(0)}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
