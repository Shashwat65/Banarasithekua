import { Link } from "react-router-dom";

export default function ShippingPolicy() {
  return (
    <div className="container mx-auto px-6 py-16 max-w-4xl space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold tracking-tight">Detailed Shipping Policy</h1>
        <Link to="/" className="text-sm underline text-secondary/60 hover:text-secondary">Home</Link>
      </div>
      <p className="text-sm text-secondary/70 leading-relaxed">This page expands on shipping specifics for customers who need deeper clarity beyond the quick snapshot in our Refund, Return &amp; Shipping Policy.</p>
      <div className="space-y-6 text-sm text-secondary/70 leading-relaxed">
        <div>
          <h2 className="text-lg font-semibold text-secondary">1. Dispatch Timing</h2>
          <p>Orders placed before 1 PM IST usually enter same‑day prep. Very large / bulk requests may require an extra day—if so we’ll notify you proactively.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-secondary">2. Tracking</h2>
          <p>A tracking link (email / SMS) is generated once the parcel is scanned by the courier hub. Tracking visibility can take a few hours to initialise.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-secondary">3. Courier Delays</h2>
          <p>Weather, regional disruptions, strikes or compliance checks may extend transit. These are outside our control, but we will escalate with the partner if a parcel stalls.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-secondary">4. Address Accuracy</h2>
          <p>Kindly review flat number, landmark and pincode carefully. Return-to-origin (RTO) due to incomplete / unreachable address may incur re‑shipping fees.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-secondary">5. Delivery Attempts</h2>
          <p>Most couriers attempt delivery 2–3 times. Please keep phone available; failed attempts followed by RTO are treated as undeliverable orders.</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-secondary">6. Packaging Integrity</h2>
          <p>If a parcel appears tampered / wet / crushed, refuse it and contact us with photos so we can raise an immediate claim.</p>
        </div>
      </div>
      <div className="rounded-lg bg-card p-6 text-xs text-secondary/70 space-y-2">
        <p className="font-medium text-secondary">Need shipping support?</p>
  <p>Email <a href="mailto:info@banarasithekua.com" className="underline">info@banarasithekua.com</a> or call <a href="tel:+919693056200" className="underline">+91 96930 56200</a>.</p>
      </div>
    </div>
  );
}
