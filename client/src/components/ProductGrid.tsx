import ProductCard from "./ProductCard";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { sampleProducts } from "@/lib/sampleProducts";
import { combosAPI, productsAPI } from "@/services/api";

const ProductGrid = () => {
  const { data } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const res = await productsAPI.getAll();
      return res.data?.data || [];
    },
  });

  const { data: comboData } = useQuery({
    queryKey: ["combos", "homepage"],
    queryFn: async () => {
      try {
        const res = await combosAPI.getAllPublic();
        return res.data?.data || [];
      } catch {
        return [];
      }
    },
  });

  const products = (Array.isArray(data) && data.length > 0 ? data : null) || sampleProducts;

  return (
    <section id="products" className="py-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <p className="text-xs uppercase tracking-[0.5em] text-secondary/50">Featured Selection</p>
          <h2 className="text-4xl md:text-5xl font-semibold text-secondary">
            Our Products
          </h2>
          <p className="text-base text-secondary/70">
            Freshly hand-crafted thekua inspired by recipes from the ghats of Varanasi and kitchens of Mithila.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          {products.map((product: any) => {
            const id = product._id || product.id;
            const slug = product.slug || product._id || product.id;
            const image = product.image || product.images?.[0]?.url || null;
            const categoryName =
              typeof product.category === "object" && product.category !== null
                ? product.category.name
                : product.categoryName || product.category || null;
            return (
              <ProductCard
                key={id}
                id={id}
                slug={slug}
                name={product.name}
                image={image}
                price={product.price}
                originalPrice={product.originalPrice}
                isOnSale={product.originalPrice ? product.originalPrice > product.price : false}
                isSoldOut={product.stock !== undefined ? product.stock <= 0 : false}
                description={product.description}
                weight={product.weight || product.packSize}
                category={categoryName}
              />
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" className="px-8 py-3">
            <Link to="/products">View full menu</Link>
          </Button>
        </div>

        {Array.isArray(comboData) && comboData.length > 0 && (
          <div className="mt-24">
            <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
              <p className="text-xs uppercase tracking-[0.5em] text-secondary/50">Curated Value</p>
              <h3 className="text-3xl md:text-4xl font-semibold text-secondary">Combo Products</h3>
              <p className="text-base text-secondary/70">Save more with thoughtfully paired assortments of our signature thekua flavours.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {comboData.slice(0,3).map((combo: any) => {
                const image = combo.image || combo.products?.[0]?.image || combo.products?.[0]?.images?.[0]?.url;
                const effectivePrice = combo.price ?? 0;
                const original = combo.originalPrice;
                return (
                  <div key={combo._id} className="rounded-2xl border border-border/60 bg-white/60 backdrop-blur-sm p-6 flex flex-col shadow-[0_20px_40px_rgba(84,48,33,0.08)]">
                    {image && (
                      <div className="h-44 w-full overflow-hidden rounded-xl mb-5">
                        <img src={image} alt={combo.name} className="h-full w-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 space-y-3">
                      <p className="text-[10px] uppercase tracking-[0.45em] text-secondary/50">Combo</p>
                      <h4 className="text-xl font-semibold text-secondary">{combo.name}</h4>
                      <p className="text-sm text-secondary/70 line-clamp-3">{combo.description}</p>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold">₹{effectivePrice}</span>
                        {original && original > effectivePrice && (
                          <span className="text-sm line-through text-secondary/40">₹{original}</span>
                        )}
                      </div>
                    </div>
                    <Button className="mt-6 w-full" variant="outline" asChild>
                      <Link to={`/combos/${combo.slug || combo._id}`}>View Details</Link>
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;