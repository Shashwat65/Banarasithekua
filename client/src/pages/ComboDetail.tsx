import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { combosAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const ComboDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem } = useCart();
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["combo", slug],
    enabled: Boolean(slug),
    queryFn: async () => {
      const res = await combosAPI.getById(slug as string);
      return res.data?.data || null;
    },
  });

  const combo = data;

  const ensureAuth = (redirect?: string) => {
    if (user) return true;
    toast("Please sign in to continue", {
      description: "Login or create an account to add items to your cart.",
    });
    const target = redirect || `${location.pathname}${location.search}`;
    navigate("/login", { state: { from: target } });
    return false;
  };

  const handleAdd = () => {
    if (!combo) return;
    if (!ensureAuth()) return;
    const id = combo._id || combo.id;
    addItem({
      id,
      slug: combo.slug || id,
      name: combo.name || "Combo",
      price: Number(combo.price || 0),
      image: combo.image || combo.products?.[0]?.image || combo.products?.[0]?.images?.[0]?.url || undefined,
      quantity: 1,
    });
    toast("Combo added to cart", { description: combo.name });
  };

  const handleBuy = () => {
    if (!combo) return;
    if (!ensureAuth("/checkout")) return;
    handleAdd();
    navigate("/checkout");
  };

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">Loading...</div>;
  }

  if (!combo) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4">
        <p className="text-muted-foreground">Combo not found.</p>
        <Button asChild variant="outline"><Link to="/combos">Back to combos</Link></Button>
      </div>
    );
  }

  const image = combo.image || combo.products?.[0]?.image || combo.products?.[0]?.images?.[0]?.url;
  const price = Number(combo.price || 0);
  const originalPrice = combo.originalPrice ? Number(combo.originalPrice) : null;

  return (
    <div className="min-h-screen bg-muted/10 py-16">
      <div className="container mx-auto px-6">
        <div className="mb-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:underline">Home</Link> / <Link to="/combos" className="hover:underline">Combos</Link> / {combo.name}
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            {image ? (
              <div className="rounded-3xl overflow-hidden bg-white shadow">
                <img src={image} alt={combo.name} className="w-full h-[460px] object-cover" />
              </div>
            ) : (
              <div className="rounded-3xl bg-muted h-[460px] flex items-center justify-center text-muted-foreground">No image</div>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.4em] text-secondary/60">COMBO</p>
              <h1 className="text-4xl font-semibold text-secondary">{combo.name}</h1>
              <p className="text-secondary/70">{combo.description || "A curated combo of our best sellers."}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-semibold text-primary">₹{price.toFixed(0)}</span>
              {originalPrice && originalPrice > price && (
                <span className="text-sm line-through text-secondary/40">₹{originalPrice.toFixed(0)}</span>
              )}
            </div>

            <Separator />

            {Array.isArray(combo.products) && combo.products.length > 0 && (
              <div className="rounded-2xl bg-card p-4">
                <p className="text-sm font-medium text-secondary mb-3">Included Items</p>
                <ul className="space-y-2 text-sm text-secondary/70">
                  {combo.products.map((item: any, idx: number) => (
                    <li key={idx} className="flex items-center justify-between">
                      <span>{item.name || item.title || "Item"}</span>
                      <span className="text-muted-foreground">{item.weight || item.packSize || "500g"}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1" onClick={handleAdd}>Add to Cart</Button>
              <Button className="flex-1" variant="secondary" onClick={handleBuy}>Buy Now</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboDetail;
