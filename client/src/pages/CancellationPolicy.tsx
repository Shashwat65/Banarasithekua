import { Link } from "react-router-dom";

export default function CancellationPolicy() {
  return (
    <div className="container mx-auto px-6 py-16 max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Cancellation Policy</h1>
        <Link to="/" className="text-sm underline text-secondary/60 hover:text-secondary">Home</Link>
      </div>
      <p className="text-sm text-secondary/70 leading-relaxed">
        Orders can be cancelled within 30 minutes of placement if not yet processed. Once a batch is queued or
        dispatched, cancellation isn’t possible due to the fresh nature of production.
      </p>
      <p className="text-sm text-secondary/70 leading-relaxed">To request cancellation quickly email with subject: <span className="font-mono">CANCEL + ORDER ID</span>.</p>
    </div>
  );
}
