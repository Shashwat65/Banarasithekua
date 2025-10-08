import { Link } from "react-router-dom";

const ReturnsAndShipping = () => {
  return (
    <div className="min-h-screen bg-muted/30 py-16">
      <div className="container mx-auto max-w-3xl px-6 space-y-10">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            <Link to="/" className="underline hover:text-primary">
              Home
            </Link>{" "}
            / Refund, Returns &amp; Shipping
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Refund, Return &amp; Shipping Policy</h1>
          <p className="text-muted-foreground">Fresh micro‑batch production means we handle issues quickly &amp; fairly. Please review the points below.</p>
        </div>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">1. Return Eligibility</h2>
            <p className="text-muted-foreground">Report issues (damage / wrong item) within 3 days of delivery with clear photos + order ID. Perishable, opened or partially consumed packs cannot be accepted.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">2. Refund Process</h2>
            <p className="text-muted-foreground">Approved refund after verification will be credited to your account through original payment method within 7-10 business days.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">3. Exchange Policy</h2>
            <p className="text-muted-foreground">If the stock is available we will deliver the exchanged items within 3-5 business days.</p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Shipping Snapshot</h2>
          <div>
            <h3 className="text-lg font-semibold">1. Coverage</h3>
            <p className="text-muted-foreground">Pan‑India dispatch from Varanasi. Unsure about a pincode? Email us and we’ll verify.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">2. Charges</h3>
            <p className="text-muted-foreground">Calculated dynamically at checkout (location + weight) — fully transparent before payment.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">3. Processing</h3>
            <p className="text-muted-foreground">Fresh prep &amp; packing: 1–3 business days (longer only during peak festivals / disruptions—updates provided).</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">4. Delivery Windows</h3>
            <p className="text-muted-foreground">Standard: 3–5 business days post‑dispatch. Express (select routes): 2–3 days. Courier performance &amp; regional factors can affect timing.</p>
          </div>
        </section>

        <div className="rounded-lg bg-card p-6 text-sm text-muted-foreground shadow-sm">
          <p className="font-medium text-foreground">Support within reach</p>
          <p>
            Write to <a href="mailto:info@banarasithekua.com" className="underline">info@banarasithekua.com</a> or call
            {" "}
            <a href="tel:+919981155442" className="underline">+91 99811 55442</a> for any return or shipping query.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReturnsAndShipping;
