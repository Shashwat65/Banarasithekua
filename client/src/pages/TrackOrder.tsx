import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { ordersAPI } from "@/services/api";

const TrackOrder = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [value, setValue] = useState(orderId || "");

  const { data, isLoading } = useQuery({
    queryKey: ["track-order", orderId],
    enabled: Boolean(orderId),
    queryFn: async () => {
      const res = await ordersAPI.getById(orderId as string);
      return res.data?.data || null;
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;
    navigate(`/track-order/${value}`);
  };

  return (
    <div className="min-h-screen bg-muted/10 py-16">
      <div className="container mx-auto px-6 max-w-3xl space-y-8">
        <div className="rounded-2xl border bg-card p-6 space-y-4">
          <h1 className="text-2xl font-semibold text-secondary">Track your order</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orderId">Order ID</Label>
              <Input id="orderId" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter order ID" />
            </div>
            <Button type="submit">Track Order</Button>
          </form>
        </div>

        {orderId && (
          <div className="rounded-2xl border bg-card p-6">
            {isLoading ? (
              <p className="text-muted-foreground">Loading order details...</p>
            ) : data ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Order ID</span><span>{data._id}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span>{data.orderStatus}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><span>{data.paymentStatus}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span>₹{Number(data.totalAmount || 0).toFixed(0)}</span></div>
              </div>
            ) : (
              <p className="text-muted-foreground">Order not found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
