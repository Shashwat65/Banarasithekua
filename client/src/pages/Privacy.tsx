import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-muted/30 py-16">
      <div className="container mx-auto max-w-3xl px-6 space-y-10">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            <Link to="/" className="underline hover:text-primary">
              Home
            </Link>{" "}
            / Privacy Policy
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground">This policy explains how Banarasi Thekua collects, uses &amp; safeguards information you share on <span className="font-medium">banarasithekua.com</span>.</p>
        </div>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">1. Information We Collect</h2>
            <p className="text-muted-foreground">Account &amp; order data (name, email, phone, addresses), payment metadata (handled by secure gateways), and optional preferences you submit.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">2. How We Use It</h2>
            <p className="text-muted-foreground">To process purchases, communicate order and delivery status, improve our catalogue, and (if opted‑in) send gentle launch / festive updates.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">3. Data Protection</h2>
            <p className="text-muted-foreground">Industry standard controls, least‑privilege access and encrypted transport (HTTPS). No method is 100%—report suspected issues to us immediately.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">4. Sharing</h2>
            <p className="text-muted-foreground">Shared only with vetted providers (payments, logistics, email). No selling / renting of data. They contractually protect confidentiality.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">5. Cookies</h2>
            <p className="text-muted-foreground">Essential (session/cart) and performance (anonymised analytics) only. You can disable in browser; some features may degrade.</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">6. Your Rights</h2>
            <p className="text-muted-foreground">Request access, correction or deletion via <a href="mailto:info@banarasithekua.com" className="underline">info@banarasithekua.com</a>. We respond within reasonable time.</p>
          </div>
        </section>

        <div className="rounded-lg bg-card p-6 text-sm text-muted-foreground shadow-sm">
          <p className="font-medium text-foreground">Questions about your privacy?</p>
          <p>
            Email <a href="mailto:info@banarasithekua.com" className="underline">info@banarasithekua.com</a> or call
            {" "}
            <a href="tel:+919693056200" className="underline">+91 96930 56200</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
