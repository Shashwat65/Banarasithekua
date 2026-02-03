import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ordersAPI } from "@/services/api";
import { Button } from "@/components/ui/button";

const OrderConfirmation = () => {
  const { orderId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ["order", orderId],
    enabled: Boolean(orderId),
    queryFn: async () => {
      const res = await ordersAPI.getById(orderId as string);
      return res.data?.data || null;
    },
  });

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-muted-foreground">Loading order...</div>;
  }

  return (
    <div className="min-h-screen bg-muted/10 py-16">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="rounded-2xl border bg-card p-6 space-y-4">
          <h1 className="text-2xl font-semibold text-secondary">Order Confirmation</h1>
          <p className="text-muted-foreground">Thank you for your order. Below are the details we received.</p>

          {data ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Order ID</span><span>{data._id}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span>{data.orderStatus}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Payment</span><span>{data.paymentStatus}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span>₹{Number(data.totalAmount || 0).toFixed(0)}</span></div>
            </div>
          ) : (
            <p className="text-muted-foreground">Order details are not available yet.</p>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild variant="outline"><Link to="/products">Continue shopping</Link></Button>
            <Button asChild><Link to={`/track-order/${orderId}`}>Track order</Link></Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
