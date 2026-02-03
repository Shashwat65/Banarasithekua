import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { productsAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem } = useCart();
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["product", slug],
    enabled: Boolean(slug),
    queryFn: async () => {
      const res = await productsAPI.getById(slug as string);
      return res.data?.data || null;
    },
  });

  const product = data;

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
    if (!product) return;
    if (!ensureAuth()) return;
    const id = product._id || product.id;
    addItem({
      id,
      slug: product.slug || id,
      name: product.name || product.title || "Product",
      price: Number(product.price || 0),
      image: product.image || product.images?.[0]?.url || undefined,
      quantity: 1,
    });
    toast("Added to cart", { description: product.name });
  };

  const handleBuy = () => {
    if (!product) return;
    if (!ensureAuth("/checkout")) return;
    handleAdd();
    navigate("/checkout");
  };

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4">
        <p className="text-muted-foreground">Product not found.</p>
        <Button asChild variant="outline"><Link to="/products">Back to products</Link></Button>
      </div>
    );
  }

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images.map((img: any) => img?.url).filter(Boolean)
    : [product.image].filter(Boolean);
  const primaryImage = images[0];
  const price = Number(product.price || 0);
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : null;
  const attributes = product.attributes && typeof product.attributes === "object" ? product.attributes : {};
  const categoryName =
    typeof product.category === "object" && product.category !== null
      ? product.category.name
      : product.categoryName || product.category || "Thekua";

  return (
    <div className="min-h-screen bg-muted/10 py-16">
      <div className="container mx-auto px-6">
        <div className="mb-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:underline">Home</Link> / <Link to="/products" className="hover:underline">Products</Link> / {product.name}
        </div>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="space-y-4">
            {primaryImage ? (
              <div className="rounded-3xl overflow-hidden bg-white shadow">
                <img src={primaryImage} alt={product.name} className="w-full h-[460px] object-cover" />
              </div>
            ) : (
              <div className="rounded-3xl bg-muted h-[460px] flex items-center justify-center text-muted-foreground">No image</div>
            )}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.slice(0, 4).map((img: string, idx: number) => (
                  <div key={idx} className="rounded-2xl overflow-hidden border">
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="h-24 w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.4em] text-secondary/60">{String(categoryName).toUpperCase()}</p>
              <h1 className="text-4xl font-semibold text-secondary">{product.name}</h1>
              <p className="text-secondary/70">{product.description || "Handcrafted thekua prepared fresh with premium ingredients."}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-semibold text-primary">₹{price.toFixed(0)}</span>
              {originalPrice && originalPrice > price && (
                <span className="text-sm line-through text-secondary/40">₹{originalPrice.toFixed(0)}</span>
              )}
              {originalPrice && originalPrice > price && (
                <Badge className="ml-2">Offer</Badge>
              )}
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Pack Size</p>
                <p className="font-medium text-secondary">{product.packSize || product.weight || "500g"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Availability</p>
                <p className="font-medium text-secondary">{product.stock !== undefined && product.stock <= 0 ? "Sold out" : "In stock"}</p>
              </div>
            </div>

            {Object.keys(attributes).length > 0 && (
              <div className="rounded-2xl bg-card p-4">
                <p className="text-sm font-medium text-secondary mb-3">Highlights</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  {Object.entries(attributes).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between border-b border-border/50 pb-2">
                      <span className="text-muted-foreground">{key}</span>
                      <span className="font-medium text-secondary">{String(value)}</span>
                    </div>
                  ))}
                </div>
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

export default ProductDetail;
