import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Order = {
  id: string;
  status: string;
  amount: number;
  customer?: { name?: string; email?: string };
  items: { name: string; quantity: number; price: number }[];
  timeline?: { at: string; status: string; message: string }[];
};

export default function TrackOrder() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await fetch(`/api/orders?id=${orderId}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data.order);
        setError(null);
      } else {
        setError("Order not found or access denied.");
      }
    };
    if (orderId) fetchOrder();
  }, [orderId]);

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-secondary/70">{error}</div>;
  }

  if (!order) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }

  return (
    <div className="container mx-auto px-6 py-16 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Track Order</h1>
        <p className="text-secondary/70">Order ID: {order.id}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Current status: {order.status}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Items</h3>
            <ul className="space-y-2 text-sm">
              {order.items.map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-sm text-secondary/70">Total paid/Payable: ₹{order.amount.toFixed(2)}</div>
          {order.timeline?.length ? (
            <div className="space-y-2">
              <h3 className="font-semibold">Timeline</h3>
              <ul className="text-sm space-y-1">
                {order.timeline.map((entry, idx) => (
                  <li key={idx}>
                    <span className="font-medium">{new Date(entry.at).toLocaleString()} • {entry.status}</span>
                    {entry.message ? <span className="text-secondary/60"> — {entry.message}</span> : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
