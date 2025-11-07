import { FormEvent, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { loadPhonePeScript, initiatePayment, openPayPageIframe, checkStatus } from "@/services/phonepe";

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
    try {
      // Ensure script is loaded
      await loadPhonePeScript();
      // Initiate payment session on backend (no UI change)
      const payload = {
        items: items.map((item) => ({ ...item })),
        customer: form,
        amount: subtotal,
      };
      const init = await initiatePayment(payload);
      if (!init?.success) throw new Error("Failed to start payment");

      // Open PayPage in IFRAME; when closed, reconcile status
      openPayPageIframe(init.redirectUrl, async (result) => {
        if (result === "USER_CANCEL") {
          toast("Payment cancelled", { description: "You closed the payment window." });
          setLoading(false);
          return;
        }
        // CONCLUDED -> poll for terminal state
        try {
          let attempts = 0;
          let finalState: string | undefined;
          while (attempts < 20) { // ~progressive polling simplified
            const s = await checkStatus(init.merchantOrderId);
            const state = s?.data?.state as string | undefined;
            if (state === "COMPLETED" || state === "FAILED") { finalState = state; break; }
            await new Promise((r) => setTimeout(r, attempts < 5 ? 2000 : 5000));
            attempts++;
          }
          if (finalState === "COMPLETED") {
            toast("Payment successful", { description: `Order confirmed.` });
            clear();
            navigate(`/order-confirmation/${init.orderId}`);
          } else if (finalState === "FAILED") {
            toast("Payment failed", { description: "Your payment could not be completed." });
          } else {
            toast("Payment pending", { description: "We are still processing your payment." });
          }
        } catch (err: any) {
          toast("Could not verify payment", { description: err?.message || "Please check later." });
        } finally {
          setLoading(false);
        }
      });
    } catch (err: any) {
      toast("Unable to start payment", { description: err?.message || "Please try again." });
      setLoading(false);
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
