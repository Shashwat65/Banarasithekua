import { useMemo } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { findSampleProduct } from "@/lib/sampleProducts";
import { productsAPI } from "@/services/api";

const fetchProduct = async (idOrSlug: string) => {
  try {
    const res = await productsAPI.getById(idOrSlug);
    return res.data?.data ?? null;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

const mapProduct = (product: any) => {
  if (!product) return null;
  const id = product._id || product.id;
  if (!id) return null;
  const salePrice = typeof product.salePrice === "number" ? product.salePrice : null;
  const basePrice = typeof product.price === "number" ? product.price : 0;
  const price = salePrice && salePrice > 0 ? salePrice : basePrice;
  const originalPrice = salePrice ? basePrice : product.originalPrice;

  return {
    ...product,
    id,
    slug: product.slug || id,
    name: product.name || product.title || "Product",
    price,
    originalPrice,
    stock:
      typeof product.totalStock === "number"
        ? product.totalStock
        : typeof product.stock === "number"
          ? product.stock
          : undefined,
    categoryName: product.categoryName || product.category || null,
    weight: product.weight || product.packSize || product.size,
  };
};

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { addItem } = useCart();
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => fetchProduct(slug || ""),
    enabled: Boolean(slug),
    retry: false,
  });

  const product = useMemo(() => {
    if (data) return mapProduct(data);
    if (slug) return mapProduct(findSampleProduct(slug));
    return null;
  }, [data, slug]);

  // Allow guests to add to cart and buy now
  const pushToCart = () => {
    if (!product) return;
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    });
    toast(`${product.name} added to cart`);
  };

  const handleAddToCart = () => {
    pushToCart();
  };

  const handleBuyNow = () => {
    pushToCart();
    navigate("/checkout");
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center px-4">
        <p className="text-lg font-semibold">Item not found.</p>
        <Link to="/products">
          <Button>Back to catalog</Button>
        </Link>
      </div>
    );
  }

  const savings = product.originalPrice
    ? Math.max(0, product.originalPrice - product.price)
    : 0;

  const detailPairs = [
    {
      label: "Category",
      value: (() => {
        const raw = product.categoryName || product.category;
        if (!raw || /uncategor/i.test(String(raw))) return "Thekua";
        return raw;
      })(),
    },
    {
      label: "Availability",
      value:
        product.stock === undefined || product.stock === null
          ? "Made on order"
          : product.stock > 0
            ? `${product.stock} in stock`
            : "Currently sold out",
    },
    {
      label: "Pack Size",
      value: (() => {
        const raw = product.weight || product.packSize || product.size;
        const grams = /\b\d{2,4}\s?g\b/i;
        if (!raw || String(raw).trim() === "") return "500g";
        return grams.test(String(raw)) ? String(raw) : `${String(raw)} · 500g`;
      })(),
    },
    {
      label: "Last updated",
      value: product.updatedAt
        ? new Date(product.updatedAt).toLocaleDateString()
        : "today",
    },
  ];

  const attributes = product.attributes && typeof product.attributes === "object"
    ? Object.entries(product.attributes as Record<string, string | number>)
    : [];

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
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-3xl shadow-xl"
            />
          ) : (
            <div className="h-[480px] rounded-3xl bg-muted flex items-center justify-center">
              No image available
            </div>
          )}
          {product.originalPrice && product.originalPrice > product.price ? (
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
            <h1 className="text-4xl font-semibold text-secondary">{product.name}</h1>
            <p className="text-secondary/70 leading-relaxed text-base">
              {product.description}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-end gap-4">
              <span className="text-3xl font-semibold text-primary">₹{product.price.toFixed(2)}</span>
              {product.originalPrice && product.originalPrice > product.price ? (
                <span className="text-lg text-secondary/50 line-through">
                  ₹{product.originalPrice.toFixed(2)}
                </span>
              ) : null}
            </div>
            {product.weight ? (
              <p className="text-sm uppercase tracking-[0.35em] text-secondary/60">
                {product.weight}
              </p>
            ) : null}
            {typeof product.stock === 'number' ? (
              product.stock <= 0 ? (
                <p className="text-sm text-red-500">Currently sold out — join waitlist.</p>
              ) : (
                <p className="text-sm text-secondary/70">
                  {product.stock > 20 ? 'In stock' : product.stock <= 5 ? `Only ${product.stock} left` : `${product.stock} in stock`} — ships within 48 hours.
                </p>
              )
            ) : (
              <p className="text-sm text-secondary/70">Freshly prepared to order — ships within 48 hours.</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              Add to Cart
            </Button>
            <Button
              className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90"
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
            >
              Buy Now
            </Button>
          </div>

          <div className="border border-border/60 rounded-2xl p-6 space-y-3 text-sm text-secondary/70">
            <div className="grid gap-3 sm:grid-cols-2">
              {detailPairs.map((item) => (
                <div key={item.label}>
                  <p className="text-xs uppercase tracking-[0.3em] text-secondary/50">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium text-secondary/80">{item.value}</p>
                </div>
              ))}
            </div>
            {attributes.length > 0 ? (
              <div className="pt-4 border-t border-border/50 space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-secondary/50">Highlights</p>
                <ul className="space-y-2 text-sm text-secondary/70">
                  {attributes.map(([key, value]) => (
                    <li key={key} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>
                        <span className="font-medium text-secondary/80">{key}:</span> {String(value)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
