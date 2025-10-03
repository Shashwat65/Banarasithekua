import ProductCard from "./ProductCard";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { sampleProducts } from "@/lib/sampleProducts";

const ProductGrid = () => {
  const { data } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  const products = (data?.items as any[])?.length ? data.items : sampleProducts;

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
      </div>
    </section>
  );
};

export default ProductGrid;