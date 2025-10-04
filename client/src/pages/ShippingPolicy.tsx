import { Link } from "react-router-dom";

export default function ShippingPolicy() {
  return (
    <div className="container mx-auto px-6 py-16 max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Shipping Policy</h1>
        <Link to="/" className="text-sm underline text-secondary/60 hover:text-secondary">Home</Link>
      </div>
      <p className="text-sm text-secondary/70 leading-relaxed">
        Orders placed before 1 PM IST usually dispatch same day. Transit times vary by pincode (2–7 working days). A
        tracking link is provided after dispatch. We are not liable for courier delays caused by weather, strikes or
        force majeure.
      </p>
      <p className="text-sm text-secondary/70 leading-relaxed">
        If a shipment is returned due to incorrect address or repeated delivery attempts failed, re-shipping charges
        may apply.
      </p>
    </div>
  );
}
