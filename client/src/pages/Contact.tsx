import { Link } from "react-router-dom";

export default function Contact() {
  return (
    <div className="container mx-auto px-6 py-16 max-w-3xl space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-semibold">Contact Us</h1>
        <Link to="/" className="text-sm underline text-secondary/60 hover:text-secondary">Home</Link>
      </div>
      <div className="space-y-4 text-sm text-secondary/70">
        <p>📍 Maruti Nagar Colony, Samneghat, Varanasi (Beside Kidzee School)</p>
        <p>✉️ hello@banarasithekua.com</p>
        <p>📞 +91 99811 55442</p>
        <p>Customer Care: Mon–Sat, 9 AM – 8 PM IST</p>
      </div>
      <p className="text-xs text-secondary/50">For bulk / gifting enquiries email with subject: <span className="font-mono">GIFTING-ENQUIRY</span>.</p>
    </div>
  );
}
