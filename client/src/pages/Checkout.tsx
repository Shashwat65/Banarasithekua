import { FormEvent, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    notes: "",
  });

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p>Your cart is empty.</p>
        <Link to="/">
          <Button>Continue shopping</Button>
        </Link>
      </div>
    );
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        items: items.map((item) => ({ ...item })),
        customer: form,
        amount: subtotal,
        notes: form.notes,
      }),
    });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      toast("Order placed", { description: `Order ID: ${data.id}` });
      clear();
      navigate(`/order-confirmation/${data.id}`);
    } else {
      const err = await res.json().catch(() => ({}));
      toast("Unable to place order", { description: err.error || "Please try again." });
    }
  };

  return (
    <div className="container mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            type="button"
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/cart"))}
          >
            ← Back
          </Button>
          <h1 className="text-3xl font-semibold">Checkout</h1>
        </div>
        <Link to="/cart" className="text-sm underline text-secondary/70 hover:text-secondary">Edit Cart</Link>
      </div>
      <div className="grid md:grid-cols-[2fr,1fr] gap-10">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            <Input placeholder="Postal code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} required />
          </div>
          <Textarea placeholder="Street address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
          <div className="grid md:grid-cols-2 gap-4">
            <Input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
            <Input placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required />
          </div>
          <Textarea placeholder="Delivery notes (optional)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <Button type="submit" disabled={loading} className="w-full md:w-auto">
            {loading ? "Processing…" : `Place order • ₹${subtotal.toFixed(2)}`}
          </Button>
        </form>
        <aside className="border border-border/60 rounded-2xl p-6 space-y-4 h-fit">
          <h2 className="text-xl font-semibold">Order summary</h2>
          <ul className="space-y-3">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between text-sm">
                <span>{item.name} × {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <p className="text-xs text-secondary/60">You’ll be redirected to PhonePe for payment when integrated.</p>
        </aside>
      </div>
    </div>
  );
}
