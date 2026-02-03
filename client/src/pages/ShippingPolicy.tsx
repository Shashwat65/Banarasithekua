import { Link } from "react-router-dom";

const ShippingPolicy = () => {
  return (
    <div className="min-h-screen bg-muted/30 py-16">
      <div className="container mx-auto max-w-3xl px-6 space-y-10">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            <Link to="/" className="underline hover:text-primary">Home</Link> / Shipping Policy
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Shipping Policy</h1>
          <p className="text-muted-foreground">Transparent timelines and charges for every order.</p>
        </div>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Dispatch Timeline</h2>
            <p className="text-muted-foreground">We dispatch within 1-3 business days after confirmation.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Delivery Coverage</h2>
            <p className="text-muted-foreground">We currently ship across India through trusted courier partners.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Tracking</h2>
            <p className="text-muted-foreground">Tracking details are shared via SMS/email once dispatched.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ShippingPolicy;
