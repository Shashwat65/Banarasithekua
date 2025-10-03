import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sampleProducts } from "@/lib/sampleProducts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const fetchProducts = async (params: URLSearchParams) => {
  const res = await fetch(`/api/products?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
};

export default function Products() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popularity");
  const params = new URLSearchParams();
  if (search) params.set("q", search);
  if (sort) params.set("sort", sort);

  const { data } = useQuery({
    queryKey: ["products", search, sort],
    queryFn: () => fetchProducts(params),
  });

  const products = data?.items?.length ? data.items : sampleProducts;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-16 space-y-10">
        <header className="space-y-4 text-center">
          <h1 className="text-4xl font-semibold">Shop Thekua</h1>
          <p className="text-secondary/70 max-w-2xl mx-auto">
            Discover hand-crafted thekua in seasonal flavours. Filter and sort to find your festive favourites.
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <Input
            placeholder="Search flavours…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:w-72"
          />
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="md:w-56">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {products.length === 0 ? (
          <Alert>
            <AlertTitle>No products found</AlertTitle>
            <AlertDescription>
              Try adjusting your search or check back later as we add more festive specials.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
            {products.map((product: any) => {
              const id = product._id || product.id;
              const slug = product.slug || id;
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
        )}
      </div>
    </div>
  );
}
