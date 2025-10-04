import { Link } from "react-router-dom";

export default function Disclaimer() {
  return (
    <div className="container mx-auto px-6 py-16 max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Disclaimer</h1>
        <Link to="/" className="text-sm underline text-secondary/60 hover:text-secondary">Home</Link>
      </div>
      <p className="text-sm text-secondary/70 leading-relaxed">
        All product imagery is representative; minor color or texture variation may occur because each batch is
        handcrafted. Nutritional values (if provided) are approximate and for general guidance only.
      </p>
      <p className="text-sm text-secondary/70 leading-relaxed">
        This site content is informational and not a substitute for professional dietary advice. By using the site you
        accept inherent variability in traditional food products.
      </p>
    </div>
  );
}
