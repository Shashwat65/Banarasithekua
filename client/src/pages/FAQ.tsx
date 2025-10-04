import { Link } from "react-router-dom";

const faqs: { q: string; a: string }[] = [
  { q: "What is Thekua?", a: "A traditional festive sweet made with wheat flour, jaggery and ghee, slow-fried for caramelised depth." },
  { q: "Do you ship nationwide?", a: "Yes, we dispatch across India with hygienic packaging and freshness protection." },
  { q: "Shelf life?", a: "Best consumed within 15 days in an airtight container away from moisture and heat." },
  { q: "Do you use preservatives?", a: "No added preservatives; micro-batch preparation ensures natural shelf life." },
  { q: "Payment methods?", a: "PhonePe (UPI/cards/wallet) and COD (coming soon)." },
];

export default function FAQ() {
  return (
    <div className="container mx-auto px-6 py-16 max-w-4xl">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-semibold tracking-tight">Frequently Asked Questions</h1>
        <Link to="/" className="text-sm underline text-secondary/60 hover:text-secondary">Home</Link>
      </div>
      <div className="space-y-8">
        {faqs.map((f) => (
          <div key={f.q} className="space-y-2">
            <h2 className="text-lg font-medium text-secondary">{f.q}</h2>
            <p className="text-sm text-secondary/70 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
