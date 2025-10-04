import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="container mx-auto px-6 py-16 max-w-4xl space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-semibold">About Us</h1>
        <Link to="/" className="text-sm underline text-secondary/60 hover:text-secondary">Home</Link>
      </div>
      <p className="text-secondary/70 leading-relaxed text-base">
        Banarasi Thekua is a heritage mithai atelier rooted in Maruti Nagar, Varanasi. We handcraft micro-batches of
        traditionally inspired Thekua with a focus on authenticity, hygiene and mindful sourcing. Our kitchen blends
        family recipes with clean-process modern craft.
      </p>
      <p className="text-secondary/70 leading-relaxed text-base">
        Each batch is slow-fried for caramel depth using premium ingredients. We avoid synthetic additives and
        unnecessary processing. Our logistics layer allows same-day dispatch for maximal freshness.
      </p>
      <p className="text-secondary/70 leading-relaxed text-base">
        From festival nostalgia to everyday comfort, we aim to preserve regional taste while elevating its presentation
        and consistency.
      </p>
    </div>
  );
}
