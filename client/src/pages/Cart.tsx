import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/useCart";
import { Separator } from "@/components/ui/separator";

const Cart = () => {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center gap-4">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Button asChild><Link to="/products">Browse products</Link></Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/10 py-16">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-secondary">Your Cart</h1>
          <Button variant="outline" onClick={() => navigate("/products")}>Continue Shopping</Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl border bg-card p-4 flex flex-col sm:flex-row gap-4 items-start">
                <div className="h-24 w-24 rounded-xl overflow-hidden bg-muted">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">No image</div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="font-medium text-secondary">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">₹{item.price.toFixed(0)}</p>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={99}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, Number(e.target.value || 1))}
                      className="w-24"
                    />
                    <Button variant="ghost" onClick={() => removeItem(item.id)}>Remove</Button>
                  </div>
                </div>
                <div className="text-right font-semibold">₹{(item.price * item.quantity).toFixed(0)}</div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border bg-card p-6 h-fit space-y-4">
            <h2 className="text-xl font-semibold text-secondary">Order Summary</h2>
            <Separator />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">₹{subtotal.toFixed(0)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">Calculated at checkout</span>
            </div>
            <Separator />
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Total</span>
              <span>₹{subtotal.toFixed(0)}</span>
            </div>
            <Button className="w-full" onClick={() => navigate("/checkout")}>Proceed to Checkout</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
