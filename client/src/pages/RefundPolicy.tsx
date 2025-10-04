import { Link } from "react-router-dom";

export default function RefundPolicy() {
  return (
    <main className="container mx-auto px-6 py-16 max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Refund Policy</h1>
        <Link to="/" className="text-sm underline text-secondary/60 hover:text-secondary">Home</Link>
      </div>
      <p className="text-secondary/70 text-sm leading-relaxed">
        Due to the perishable nature of our products, refunds are approved only for: (a) damaged packaging upon delivery,
        (b) incorrect items shipped, or (c) non-delivery. Claims must be raised within 24 hours of receipt with clear
        unedited photos and order ID.
      </p>
      <ul className="list-disc pl-5 space-y-2 text-sm text-secondary/70">
        <li>No taste-based refunds.</li>
        <li>Opened or partially consumed packs are ineligible unless quality degradation is evidenced.</li>
        <li>Approved refunds are processed to the original payment method within 7–10 working days.</li>
      </ul>
    </main>
  );
}
