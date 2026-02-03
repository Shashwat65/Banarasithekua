import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { ordersAPI } from "@/services/api";
import { toast } from "sonner";

const Checkout = () => {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    address: "",
    city: "",
    pincode: "",
    phone: "",
    notes: "",
  });

  const cartItems = useMemo(
    () =>
      items.map((item) => ({
        productId: item.id,
        title: item.name,
        image: item.image || "",
        price: String(item.price),
        quantity: item.quantity,
      })),
    [items]
  );

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast("Your cart is empty");
      return;
    }
    if (!user) {
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        userId: user.id,
        cartItems,
        addressInfo: {
          address: form.address,
          city: form.city,
          pincode: form.pincode,
          phone: form.phone,
          notes: form.notes,
        },
        paymentMethod: "phonepe",
        paymentStatus: "pending",
        orderStatus: "pending",
        totalAmount: subtotal,
        userPhone: form.phone,
        userEmail: user.email,
        userName: user.name,
      };

      const res = await ordersAPI.create(payload);
      const paymentUrl = res.data?.paymentUrl;
      const orderId = res.data?.orderId;

      if (paymentUrl) {
        window.location.href = paymentUrl;
        return;
      }

      if (orderId) {
        clear();
        navigate(`/order-confirmation/${orderId}`);
        return;
      }

      toast("Order created", { description: "Please complete payment to confirm." });
    } catch (err: any) {
      toast("Checkout failed", { description: err?.response?.data?.message || "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/10 py-16">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-semibold text-secondary mb-8">Checkout</h1>

        <div className="grid gap-10 lg:grid-cols-3">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border bg-card p-6 space-y-4">
              <h2 className="text-lg font-semibold">Shipping Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" value={form.address} onChange={(e) => handleChange("address", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={form.city} onChange={(e) => handleChange("city", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input id="pincode" value={form.pincode} onChange={(e) => handleChange("pincode", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} required />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="notes">Delivery notes</Label>
                  <Textarea id="notes" value={form.notes} onChange={(e) => handleChange("notes", e.target.value)} />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : "Pay with PhonePe"}
            </Button>
          </form>

          <div className="rounded-2xl border bg-card p-6 space-y-4 h-fit">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <Separator />
            <div className="space-y-3 text-sm">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex items-center justify-between font-semibold">
              <span>Total</span>
              <span>₹{subtotal.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
