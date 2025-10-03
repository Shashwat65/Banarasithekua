import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function OrderConfirmation() {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
      <h1 className="text-3xl font-semibold">Order placed successfully!</h1>
      <p className="text-secondary/70">We’ve received your order. Use the ID below to track status.</p>
      <div className="px-6 py-3 rounded-full bg-primary/10 text-primary font-semibold">Order ID: {orderId}</div>
      <div className="flex gap-3 mt-4">
        <Link to="/">
          <Button variant="outline">Back to home</Button>
        </Link>
        <Link to={`/track-order/${orderId}`}>
          <Button>Track order</Button>
        </Link>
      </div>
    </div>
  );
}
