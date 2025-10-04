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
          <h1 className="text-3xl font-semibold tracking-tight">Refund, Returns &amp; Shipping Policy</h1>
          <p className="text-muted-foreground">
            We bake every batch to order, but we understand that plans can change. Here&apos;s how Banarasi Thekua handles
            returns, refunds, exchanges, and delivery timelines across India.
          </p>
        </div>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">1. Return Eligibility</h2>
            <p className="text-muted-foreground">
              If your order arrives damaged or isn&apos;t what you expected, please let us know within 3 days of delivery.
              Items must be unopened, unused, and returned in their original packaging with all labels intact. Because our
              thekua is a perishable product, we unfortunately cannot accept items that have been opened or partially
              consumed.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">2. Refund Process</h2>
            <p className="text-muted-foreground">
              Once we receive and inspect the return, we&apos;ll process your refund to the original payment method within
              7–10 business days. We&apos;ll email you as soon as the refund is on its way. Please note that your bank or
              payment provider may take additional time to post the amount back to your account.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">3. Exchange Policy</h2>
            <p className="text-muted-foreground">
              Prefer an exchange instead of a refund? We&apos;re happy to help as long as the desired product is in stock.
              Exchange shipments are dispatched within 3–5 business days after we confirm availability. If we can&apos;t
              arrange the exchange, we&apos;ll issue a full refund instead.
            </p>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Shipping Policy</h2>
          <div>
            <h3 className="text-lg font-semibold">1. Shipping Locations</h3>
            <p className="text-muted-foreground">
              We currently ship pan-India from our kitchen in Varanasi. If you&apos;re unsure whether we can reach your
              pincode, drop us a note—we&apos;ll check with our courier partners right away.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">2. Shipping Charges</h3>
            <p className="text-muted-foreground">
              Shipping fees depend on your delivery location and order weight. The applicable charges will be displayed at
              checkout before you make payment, so there are no surprises.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">3. Order Processing Time</h3>
            <p className="text-muted-foreground">
              We typically knead, shape, and dispatch your mithai within 1–3 business days of receiving payment. During
              festive seasons, flash sales, or unforeseen events, processing times may be slightly longer—we&apos;ll keep you
              posted in such cases.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">4. Delivery Timeframes</h3>
            <p className="text-muted-foreground">
              Standard delivery usually reaches you within 3–5 business days of dispatch. Express options (where available)
              arrive in approximately 2–3 business days. Delivery times can vary depending on your location and courier
              partner performance.
            </p>
          </div>
        </section>

        <div className="rounded-lg bg-card p-6 text-sm text-muted-foreground shadow-sm">
          <p className="font-medium text-foreground">Support within reach</p>
          <p>
            Write to <a href="mailto:hello@banarasithekua.com" className="underline">hello@banarasithekua.com</a> or call
            {" "}
            <a href="tel:+919981155442" className="underline">+91 99811 55442</a> for any return or shipping query.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReturnsAndShipping;
