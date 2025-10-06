import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <div className="min-h-screen bg-muted/30 py-16">
      <div className="container mx-auto max-w-3xl px-6 space-y-10">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            <Link to="/" className="underline hover:text-primary">
              Home
            </Link>{" "}
            / Terms &amp; Conditions
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Terms &amp; Conditions</h1>
          <p className="text-muted-foreground">
            Welcome to <span className="font-medium">banarasithekua.com</span> (the “Site”). These Terms &amp; Conditions form a
            binding agreement between you and Banarasi Thekua ("we", "our"). By browsing, creating an account, or
            purchasing from us you accept these terms.
          </p>
        </div>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">Using the Site or placing an order means you agree to be bound by these Terms. If you disagree with any part, please discontinue use.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">2. Product Information</h2>
            <p className="text-muted-foreground">We hand‑craft small batches in Varanasi. Natural colour / texture variation is normal. Images &amp; descriptions are illustrative and not a guarantee of identical appearance.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">3. Pricing &amp; Payment</h2>
            <p className="text-muted-foreground">Prices are shown in INR inclusive of applicable taxes. We accept UPI, cards and net‑banking through secure gateways. Prices may change without notice; confirmed orders retain their paid price.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">4. Order Confirmation</h2>
            <p className="text-muted-foreground">You’ll receive an email / SMS after checkout. Orders remain subject to stock &amp; quality checks. If we cannot fulfil, we refund or propose an alternative.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">5. Shipping &amp; Delivery</h2>
            <p className="text-muted-foreground">Nationwide shipping. Estimated timelines &amp; charges display at checkout. Festive peaks or courier disruptions may extend delivery windows.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">6. Intellectual Property</h2>
            <p className="text-muted-foreground">All content (text, images, marks) is © Banarasi Thekua. Do not reuse without written consent.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">7. Limitation of Liability</h2>
            <p className="text-muted-foreground">Our total liability for any claim is capped at the order value paid. We are not liable for indirect or consequential losses.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">8. Governing Law</h2>
            <p className="text-muted-foreground">These Terms are governed by Indian law; courts of Varanasi, Uttar Pradesh have exclusive jurisdiction.</p>
          </div>
        </section>

        <div className="rounded-lg bg-card p-6 text-sm text-muted-foreground shadow-sm">
          <p className="font-medium text-foreground">Need help?</p>
          <p>
            Reach out to us at <a href="mailto:hello@banarasithekua.com" className="underline">hello@banarasithekua.com</a>
            {" "}or call <a href="tel:+919981155442" className="underline">+91 99811 55442</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
