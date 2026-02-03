import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ProductCard";
import { productsAPI } from "@/services/api";
import { sampleProducts } from "@/lib/sampleProducts";

const Products = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["products", "all"],
    queryFn: async () => {
      const res = await productsAPI.getAll();
      return res.data?.data || [];
    },
  });

  const products = (Array.isArray(data) && data.length > 0 ? data : null) || sampleProducts;

  return (
    <div className="min-h-screen bg-muted/20 py-16">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl space-y-3">
          <p className="text-xs uppercase tracking-[0.5em] text-secondary/50">Full Menu</p>
          <h1 className="text-4xl md:text-5xl font-semibold text-secondary">All Products</h1>
          <p className="text-secondary/70">Browse every thekua variant, seasonal pack, and festive selection we craft fresh.</p>
        </div>

        {isLoading && (
          <div className="py-16 text-center text-sm text-muted-foreground">Loading products...</div>
        )}

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
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
                name={product.name || product.title || "Product"}
                image={image}
                price={typeof product.price === "number" ? product.price : Number(product.price || 0)}
                originalPrice={product.originalPrice ? Number(product.originalPrice) : undefined}
                isOnSale={product.originalPrice ? product.originalPrice > product.price : false}
                isSoldOut={product.stock !== undefined ? product.stock <= 0 : false}
                description={product.description}
                weight={product.weight || product.packSize}
                category={categoryName}
                stock={product.stock}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Products;
