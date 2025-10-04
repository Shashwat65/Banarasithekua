import { Link } from "react-router-dom";

export default function CookiePolicy() {
  return (
    <div className="container mx-auto px-6 py-16 max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Cookie Policy</h1>
        <Link to="/" className="text-sm underline text-secondary/60 hover:text-secondary">Home</Link>
      </div>
      <p className="text-sm text-secondary/70 leading-relaxed">
        We use minimal cookies: (a) session/auth cookies, (b) cart persistence, (c) analytics to improve UX. No third
        party sells your data. Continued use implies consent. Clear cookies in your browser settings to opt-out.
      </p>
    </div>
  );
}
