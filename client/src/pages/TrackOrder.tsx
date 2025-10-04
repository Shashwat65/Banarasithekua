import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ordersAPI } from "@/services/api";

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
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await ordersAPI.getById(orderId!);
        const raw = res.data?.data;
        if (!raw) {
          setError("Order not found or access denied.");
          setOrder(null);
          return;
        }

        const mapped: Order = {
          id: raw._id || raw.id || orderId!,
          status: raw.orderStatus || raw.paymentStatus || "processing",
          amount: Number(raw.totalAmount || 0),
          customer: raw.addressInfo
            ? {
                name: raw.addressInfo.address,
                email: undefined,
              }
            : undefined,
          items: Array.isArray(raw.cartItems)
            ? raw.cartItems.map((item: any) => ({
                name: item.title || "Item",
                quantity: Number(item.quantity || 0),
                price: Number(item.price || 0),
              }))
            : [],
          timeline: [
            raw.orderDate
              ? {
                  at: raw.orderDate,
                  status: "Order placed",
                  message: "We have received your order",
                }
              : null,
            raw.orderUpdateDate
              ? {
                  at: raw.orderUpdateDate,
                  status: "Last update",
                  message: raw.orderStatus || raw.paymentStatus,
                }
              : null,
          ].filter(Boolean) as Order["timeline"],
        };
        setOrder(mapped);
        setError(null);
      } catch (err: any) {
        console.error("Failed to fetch order", err);
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
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <button
              onClick={() => (window.history.length > 1 ? navigate(-1) : navigate("/"))}
              className="text-sm px-3 py-1 rounded-md border border-border/60 hover:bg-muted"
            >
              ← Back
            </button>
            <h1 className="text-3xl font-semibold">Track Order</h1>
          </div>
          <p className="text-secondary/70">Order ID: {order.id}</p>
        </div>
        <Link to="/" className="text-sm underline text-secondary/70 hover:text-secondary">Home</Link>
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
