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
            These Terms &amp; Conditions govern your access to and purchases from Banarasi Thekua and our
            website at <span className="font-medium">banarasithekua.com</span>. By shopping with us you agree to the
            policies set out below.
          </p>
        </div>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              When you browse, place an order, or otherwise engage with Banarasi Thekua, you confirm that you have
              read, understood, and agreed to these Terms &amp; Conditions. If you do not agree, please refrain from
              using the website or placing an order.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">2. Product Information</h2>
            <p className="text-muted-foreground">
              Every batch of our artisanal thekua is handcrafted in Varanasi. We photograph and describe products with
              care, but natural ingredients and lighting conditions may result in slight differences in colour or
              appearance from what you see on screen.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">3. Pricing &amp; Payment</h2>
            <p className="text-muted-foreground">
              All prices are listed in Indian Rupees (INR) and include applicable taxes. You can pay securely via
              credit or debit cards, UPI, and net banking through our trusted payment partners. We reserve the right to
              update prices without prior notice, but confirmed orders will always honour the price you paid.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">4. Order Confirmation</h2>
            <p className="text-muted-foreground">
              After you place an order, you&apos;ll receive an email confirmation from <span className="font-medium">hello@banarasithekua.com</span>.
              Orders are accepted subject to availability. If an item is unavailable or we’re unable to fulfil your
              order, we’ll notify you promptly and arrange an alternative or a full refund.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">5. Shipping &amp; Delivery</h2>
            <p className="text-muted-foreground">
              We currently ship across India. Shipping charges and delivery timelines are calculated at checkout based on
              your location and chosen service. Dispatch times may vary during festivals, peak seasons, or due to factors
              outside our control.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">6. Intellectual Property</h2>
            <p className="text-muted-foreground">
              All photographs, text, illustrations, and branding elements on Banarasi Thekua are owned by us and
              protected under Indian copyright laws. Please request written permission before using any of our content.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">7. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              To the fullest extent permitted by law, Banarasi Thekua is not liable for any indirect, incidental, or
              consequential damages arising from the use of our website, products, or services. Our liability is limited
              to the amount you paid for the specific order in question.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">8. Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms &amp; Conditions are governed by the laws of India. Any disputes will fall under the exclusive
              jurisdiction of the courts in Varanasi, Uttar Pradesh.
            </p>
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
