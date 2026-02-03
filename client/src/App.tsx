// UI providers
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import ProductDetail from "./pages/ProductDetail";
import ComboDetail from "./pages/ComboDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import TrackOrder from "./pages/TrackOrder";
import Products from "./pages/Products";
import Combos from "./pages/Combos";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import ReturnsAndShipping from "./pages/ReturnsAndShipping";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ShippingPolicy from "./pages/ShippingPolicy";
import WhatsappFloat from "@/components/WhatsappFloat";
import Layout from "@/components/Layout";
import ScrollToTop from "@/components/ScrollToTop";

const queryClient = new QueryClient();

const LoadingScreen = () => (
  <div className="flex h-[60vh] items-center justify-center text-muted-foreground">
    Loading...
  </div>
);

const RequireAdmin = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
};

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Layout><Index /></Layout>} />
              <Route path="/login" element={<Layout><Login /></Layout>} />
              <Route path="/signup" element={<Layout><Signup /></Layout>} />
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <Admin />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/:section"
                element={
                  <RequireAdmin>
                    <Admin />
                  </RequireAdmin>
                }
              />
              <Route path="/products" element={<Layout><Products /></Layout>} />
              <Route path="/products/:slug" element={<Layout><ProductDetail /></Layout>} />
              <Route path="/combos" element={<Layout><Combos /></Layout>} />
              <Route path="/combos/:slug" element={<Layout><ComboDetail /></Layout>} />
              <Route path="/cart" element={<Layout><Cart /></Layout>} />
              <Route
                path="/checkout"
                element={
                  <RequireAuth>
                    <Layout><Checkout /></Layout>
                  </RequireAuth>
                }
              />
              <Route
                path="/order-confirmation/:orderId"
                element={
                  <RequireAuth>
                    <Layout><OrderConfirmation /></Layout>
                  </RequireAuth>
                }
              />
              <Route path="/track-order/:orderId" element={<Layout><TrackOrder /></Layout>} />
              <Route path="/terms" element={<Layout><Terms /></Layout>} />
              <Route path="/privacy" element={<Layout><Privacy /></Layout>} />
              <Route path="/returns-and-shipping" element={<Layout><ReturnsAndShipping /></Layout>} />
              <Route path="/shipping-policy" element={<Layout><ShippingPolicy /></Layout>} />
              <Route path="/about" element={<Layout><About /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              <Route path="/faq" element={<Layout><FAQ /></Layout>} />
              <Route path="*" element={<Layout><NotFound /></Layout>} />
            </Routes>
            <WhatsappFloat />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
