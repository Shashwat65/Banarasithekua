import { Button } from "@/components/ui/button";
import {
  Cookie,
  Gift,
  Heart,
  Package,
  Star,
  Truck,
  Users,
  Wheat,
  ShoppingBag,
  Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import Carousel from "@/components/common/carousel";
import ReviewsSection from "@/components/shopping-view/reviews-section";
import ValuesSection from "@/components/shopping-view/values-section";
import StorySection from "@/components/shopping-view/story-section";

const categoriesWithIcon = [
  { id: "traditional", label: "Traditional Thekua", icon: Cookie },
  { id: "premium", label: "Premium Collection", icon: Star },
  { id: "gift-boxes", label: "Gift Boxes", icon: Gift },
  { id: "festive", label: "Festive Special", icon: Award },
  { id: "bulk-orders", label: "Bulk Orders", icon: Package },
];

const featuresWithIcon = [
  { id: "handmade", label: "Handmade with Love", icon: Heart },
  { id: "fresh", label: "Always Fresh", icon: Wheat },
  { id: "authentic", label: "Authentic Recipe", icon: Star },
  { id: "delivery", label: "Fast Delivery", icon: Truck },
  { id: "quality", label: "Premium Quality", icon: Award },
  { id: "trusted", label: "Trusted by 1000+", icon: Users },
];
function ShoppingHome() {
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  const featuredProducts = useMemo(() => productList?.slice(0, 12) || [], [productList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  console.log(productList, "productList");

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero carousel */}
      <div className="relative w-full">
        <Carousel
          items={featureImageList || []}
          renderItem={(slide) => (
            <div className="relative">
              <img src={slide?.image} className="w-full h-[420px] md:h-[560px] object-cover rounded-md" />
              <div className="absolute inset-0 bg-black/30 rounded-md" />
              <div className="absolute inset-0 flex items-center">
                <div className="max-w-6xl mx-auto px-4 text-white">
                  <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow">Taste the Banarasi Tradition</h1>
                  <p className="mt-3 max-w-xl text-sm md:text-base opacity-90">
                    Authentic Banarasi Thekua baked fresh and delivered to your door. Perfect for gifting and celebrations.
                  </p>
                  <div className="mt-6 flex gap-3">
                    <Button onClick={() => navigate('/shop/listing')}>Shop now</Button>
                    <Button variant="outline" onClick={() => navigate('/shop/about')}>Learn more</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
          autoPlayMs={8000}
          className="h-full"
          perView={1}
        />
      </div>
      {/* Shop by Category Section */}
      <section className="py-16 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-amber-900 mb-4">
              Explore Our Collections
            </h2>
            <p className="text-lg text-amber-700 max-w-2xl mx-auto">
              From traditional recipes to premium gift boxes, discover the perfect Thekua for every occasion
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                key={categoryItem.id}
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm"
              >
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-4 rounded-full mb-4">
                    <categoryItem.icon className="w-8 h-8 text-amber-600" />
                  </div>
                  <span className="font-semibold text-amber-900 text-center">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-amber-900 mb-4">
              Why Choose Banarasi Thekua?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We bring you the authentic taste of Varanasi with modern convenience and quality
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresWithIcon.map((feature) => (
              <div key={feature.id} className="text-center group">
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="font-semibold text-amber-900 mb-2">{feature.label}</h3>
                <p className="text-gray-600 text-sm">
                  {feature.id === 'handmade' && 'Every piece crafted with traditional methods and care'}
                  {feature.id === 'fresh' && 'Baked fresh daily and delivered within 24 hours'}
                  {feature.id === 'authentic' && 'Original family recipes passed down through generations'}
                  {feature.id === 'delivery' && 'Quick and secure delivery across India'}
                  {feature.id === 'quality' && 'Premium ingredients and rigorous quality checks'}
                  {feature.id === 'trusted' && 'Loved by families across the country'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Featured Products</h2>
          {/* Product slider on large, grid on small */}
          <div className="hidden md:block">
            <Carousel
              items={featuredProducts}
              renderItem={(p) => (
                <ShoppingProductTile
                  handleGetProductDetails={handleGetProductDetails}
                  product={p}
                  handleAddtoCart={handleAddtoCart}
                />
              )}
              autoPlayMs={7000}
              perView={4}
            />
          </div>
          <div className="grid md:hidden grid-cols-2 gap-4">
            {featuredProducts.map((p) => (
              <ShoppingProductTile
                key={p?._id}
                handleGetProductDetails={handleGetProductDetails}
                product={p}
                handleAddtoCart={handleAddtoCart}
              />
            ))}
          </div>
        </div>
      </section>
      <ReviewsSection />
      <ValuesSection />
      <StorySection />
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
