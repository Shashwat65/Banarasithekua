import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-muted/30 py-16">
      <div className="container mx-auto max-w-3xl px-6 space-y-10">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            <Link to="/" className="underline hover:text-primary">Home</Link> / Privacy Policy
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground">We respect your privacy and protect your personal data.</p>
        </div>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">Information We Collect</h2>
            <p className="text-muted-foreground">We collect order, contact, and delivery information to fulfil purchases.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">How We Use Information</h2>
            <p className="text-muted-foreground">We use data to process orders, send updates, and improve service.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Data Security</h2>
            <p className="text-muted-foreground">Your data is stored securely and never sold to third parties.</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold">Contact</h2>
            <p className="text-muted-foreground">For privacy questions, contact info@banarasithekua.com.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
