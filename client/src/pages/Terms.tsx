import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="min-h-screen bg-muted/30 py-16">
      <div className="container mx-auto max-w-3xl px-6 space-y-10">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            <Link to="/" className="underline hover:text-primary">Home</Link> / Terms &amp; Conditions
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Terms &amp; Conditions</h1>
          <p className="text-muted-foreground">
            Welcome to <span className="font-medium">banarasithekua.com</span>. By browsing or purchasing, you accept the terms below.
          </p>
        </div>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">Using the site means you agree to be bound by these Terms.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">2. Product Information</h2>
            <p className="text-muted-foreground">All products are handcrafted; minor variations may occur.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">3. Pricing &amp; Payment</h2>
            <p className="text-muted-foreground">Prices are in INR and include applicable taxes. Payment is processed via secure gateways.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">4. Shipping</h2>
            <p className="text-muted-foreground">Delivery timelines are estimates and can vary during peak seasons.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">5. Liability</h2>
            <p className="text-muted-foreground">Our liability is limited to the order value paid.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Terms;
