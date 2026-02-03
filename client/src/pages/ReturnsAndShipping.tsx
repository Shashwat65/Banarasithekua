import { Link } from "react-router-dom";

const ReturnsAndShipping = () => {
  return (
    <div className="min-h-screen bg-muted/30 py-16">
      <div className="container mx-auto max-w-3xl px-6 space-y-10">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            <Link to="/" className="underline hover:text-primary">Home</Link> / Returns &amp; Shipping
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Returns &amp; Shipping</h1>
          <p className="text-muted-foreground">We deliver fresh thekua with care. Here&apos;s what to expect.</p>
        </div>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Shipping</h2>
            <p className="text-muted-foreground">Orders are dispatched within 1-3 business days. Delivery timelines vary by location.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Returns</h2>
            <p className="text-muted-foreground">Due to the perishable nature of sweets, returns are not accepted. If an issue occurs, contact us within 24 hours of delivery.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Damaged Orders</h2>
            <p className="text-muted-foreground">Share photos and order details so we can resolve it quickly.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ReturnsAndShipping;
