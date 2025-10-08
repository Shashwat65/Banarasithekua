import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sampleProducts } from "@/lib/sampleProducts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import api, { productsAPI } from "@/services/api";

const fetchProducts = async (search: string, sort: string) => {
  try {
    if (search.trim()) {
      const res = await api.get(`/shop/search/${encodeURIComponent(search.trim())}`);
      return res.data?.data ?? [];
    }

    const sortMap: Record<string, string> = {
      popularity: "price-lowtohigh",
      "price-asc": "price-lowtohigh",
      "price-desc": "price-hightolow",
    };

    const params = sortMap[sort] ? { sortBy: sortMap[sort] } : undefined;
    const res = await productsAPI.getAll(params);
    return res.data?.data ?? [];
  } catch (error) {
    console.error("Failed to fetch products", error);
    throw error;
  }
};

export default function Products() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("popularity");
  const { data } = useQuery({
    queryKey: ["products", search, sort],
    queryFn: () => fetchProducts(search, sort),
  });

  const products = (Array.isArray(data) && data.length > 0 ? data : null) || sampleProducts;

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
              const salePrice = typeof product.salePrice === "number" ? product.salePrice : null;
              const basePrice = typeof product.price === "number" ? product.price : 0;
              const price = salePrice && salePrice > 0 ? salePrice : basePrice;
              const originalPrice = salePrice ? basePrice : product.originalPrice;
              const stock =
                typeof product.totalStock === "number"
                  ? product.totalStock
                  : typeof product.stock === "number"
                    ? product.stock
                    : undefined;
              return (
                <ProductCard
                  key={id}
                  id={id}
                  slug={slug}
                  name={product.name || product.title || "Product"}
                  image={image}
                  price={price}
                  originalPrice={originalPrice}
                  isOnSale={Boolean(originalPrice && originalPrice > price)}
                  isSoldOut={typeof stock === "number" ? stock <= 0 : false}
                  description={product.description || product.details}
                  weight={product.weight || product.packSize || product.size}
                  category={categoryName}
                />
              );
            })}
          </div>
        )}

        {/* Combo section hidden for now */}
      </div>
    </div>
  );
}
