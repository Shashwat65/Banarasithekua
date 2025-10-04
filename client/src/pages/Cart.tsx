import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, Link } from "react-router-dom";

export default function Cart() {
  const { items, updateQuantity, removeItem, subtotal, totalItems } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-secondary/70">Your cart is empty.</p>
        <Link to="/">
          <Button>Browse products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-3xl font-semibold mb-8">Cart ({totalItems})</h1>
      <div className="grid md:grid-cols-[2fr,1fr] gap-10">
        <div className="space-y-6">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-6 border border-border/60 rounded-2xl p-4">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-xl bg-muted flex items-center justify-center text-xs text-muted-foreground">No image</div>
              )}
              <div className="flex-1">
                <Link to={`/products/${item.slug}`} className="font-semibold text-lg hover:underline">
                  {item.name}
                </Link>
                <p className="text-sm text-secondary/60">₹{item.price} each</p>
                <div className="flex items-center gap-3 mt-3">
                  <label className="text-sm text-secondary/70">Qty</label>
                  <Input
                    type="number"
                    min={1}
                    max={99}
                    value={item.quantity}
                    onChange={(e) => {
                      const next = Number(e.target.value);
                      if (Number.isNaN(next)) return;
                      updateQuantity(item.id, next);
                    }}
                    className="w-20"
                  />
                  <Button variant="ghost" onClick={() => removeItem(item.id)}>
                    Remove
                  </Button>
                </div>
              </div>
              <div className="text-right font-semibold">₹{(item.price * item.quantity).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <aside className="border border-border/60 rounded-2xl p-6 space-y-4 h-fit">
          <h2 className="text-xl font-semibold">Summary</h2>
          <div className="flex justify-between text-sm text-secondary/70">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <p className="text-xs text-secondary/50">Shipping & taxes calculated at checkout.</p>
          <Button className="w-full" onClick={() => navigate("/checkout")}>Proceed to Checkout</Button>
        </aside>
      </div>
    </div>
  );
}
