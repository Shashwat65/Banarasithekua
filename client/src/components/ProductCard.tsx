import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  name: string;
  image?: string | null;
  price: number;
  originalPrice?: number | null;
  isOnSale?: boolean;
  isSoldOut?: boolean;
  description?: string;
  weight?: string | null;
  slug?: string | null;
  category?: string | null;
}

const ProductCard = ({ 
  id,
  name, 
  image, 
  price, 
  originalPrice, 
  isOnSale, 
  isSoldOut,
  description,
  weight,
  slug,
  category,
}: ProductCardProps) => {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const detailPath = slug ? `/products/${slug}` : `/products/${id}`;
  const blurb = description?.trim() || "A wholesome mithai crafted fresh every morning.";

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
    if (!ensureAuth()) return;
    addItem({ id, name, price, slug: slug || id, image: image || undefined, quantity: 1 });
    toast(`${name} added to cart`);
  };

  const handleBuy = () => {
    if (!ensureAuth("/checkout")) return;
    addItem({ id, name, price, slug: slug || id, image: image || undefined, quantity: 1 });
    navigate("/checkout");
  };

  return (
    <article className="group bg-card rounded-[28px] overflow-hidden shadow-card hover:shadow-2xl transition-all duration-300 border border-border/70">
      {/* Product Image */}
      <Link to={detailPath} className="block">
        <div className="aspect-[4/5] bg-gradient-to-br from-[#f8e4c6] via-[#fff8ee] to-white p-5 relative">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover rounded-2xl shadow-inner transition-transform duration-300 group-hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full rounded-2xl bg-muted flex items-center justify-center text-muted-foreground text-xs">
              No image
            </div>
          )}
          {isOnSale && (
            <Badge className="absolute top-5 left-5 bg-accent text-accent-foreground shadow">
              Festive Offer
            </Badge>
          )}
          {isSoldOut && (
            <Badge variant="secondary" className="absolute top-5 left-5 bg-secondary text-secondary-foreground">
              Sold Out
            </Badge>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-6 space-y-4">
        <header className="space-y-1">
          <p className="text-[11px] uppercase tracking-[0.45em] text-secondary/60">
            {category ? `${category}`.toUpperCase() : "Banarasi Thekua Collection"}
          </p>
          <Link to={detailPath} className="font-semibold text-2xl text-secondary leading-tight hover:underline">
            {name}
          </Link>
        </header>

        <p className="text-sm leading-relaxed text-secondary/70">
          {blurb.length > 160 ? `${blurb.slice(0, 157)}…` : blurb}
        </p>

        {/* Pricing */}
        <div className="flex items-baseline gap-3">
          <span className="text-2xl font-semibold text-primary">
            ₹{price.toFixed(0)}
          </span>
          {originalPrice && (
            <span className="text-sm text-secondary/50 line-through">
              ₹{originalPrice.toFixed(0)}
            </span>
          )}
          {weight && (
            <span className="text-xs uppercase tracking-[0.35em] text-secondary/50">
              {weight}
            </span>
          )}
        </div>

        {/* Unit Price */}
        <p className="text-xs text-secondary/60 uppercase tracking-[0.3em]">
          Inclusive of all taxes
        </p>

        {/* Action Button */}
        <div className="flex gap-3 pt-2">
          <Button
            asChild
            variant="outline"
            className="flex-1 border-secondary/30 text-secondary hover:bg-secondary/10"
          >
            <Link to={detailPath}>View Details</Link>
          </Button>
          <Button
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30"
            disabled={isSoldOut}
            onClick={handleAdd}
          >
            {isSoldOut ? "Notify Me" : "Add to Cart"}
          </Button>
        </div>
        <div className="flex gap-3">
          <Button
            className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
            disabled={isSoldOut}
            onClick={handleBuy}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;