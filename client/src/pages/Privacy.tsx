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
          <p className="text-muted-foreground">
            Your trust means everything to us. This Privacy Policy explains how Banarasi Thekua collects, uses, and
            protects your personal information when you shop with us at <span className="font-medium">banarasithekua.com</span>.
          </p>
        </div>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">1. Information Collection</h2>
            <p className="text-muted-foreground">
              We collect details such as your name, email, phone number, billing and shipping addresses, and payment
              information to process your orders and deliver a delightful shopping experience. We may also gather optional
              data like preferences or special instructions that you choose to share with us.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">2. Use of Information</h2>
            <p className="text-muted-foreground">
              The information you share helps us confirm orders, dispatch products, update you about delivery status, and
              improve our recipes and services. With your consent, we may send occasional emails about new launches or
              festive offers—you can opt out at any time.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">3. Data Protection</h2>
            <p className="text-muted-foreground">
              We use industry-standard safeguards to secure your information. While no online platform can guarantee
              absolute security, we continuously monitor and upgrade our systems to keep your data safe.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">4. Sharing of Information</h2>
            <p className="text-muted-foreground">
              We never sell or rent your personal information. We may share it with trusted partners strictly for
              order-related services like secure payments, courier deliveries, or customer support. These partners follow
              the same confidentiality standards that we uphold.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">5. Cookies</h2>
            <p className="text-muted-foreground">
              Banarasi Thekua uses cookies to remember your preferences, speed up checkout, and personalise your browsing
              experience. You can modify your browser settings to disable cookies, but some features of the website may
              not function optimally without them.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">6. Your Rights</h2>
            <p className="text-muted-foreground">
              You can review, update, or request deletion of your personal information at any time. Simply write to us at
              <a href="mailto:hello@banarasithekua.com" className="underline"> hello@banarasithekua.com</a>, and we&apos;ll assist you promptly.
            </p>
          </div>
        </section>

        <div className="rounded-lg bg-card p-6 text-sm text-muted-foreground shadow-sm">
          <p className="font-medium text-foreground">Questions about your privacy?</p>
          <p>
            Email <a href="mailto:hello@banarasithekua.com" className="underline">hello@banarasithekua.com</a> or call
            {" "}
            <a href="tel:+919981155442" className="underline">+91 99811 55442</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
