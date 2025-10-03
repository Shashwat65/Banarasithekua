import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-12 bg-neutral-950 text-neutral-200">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-4">
        <div className="space-y-2">
          <h3 className="text-lg font-bold">Banarasi Thekua</h3>
          <p className="text-sm text-neutral-400">
            Handmade Banarasi delights, baked fresh with love. Taste the
            tradition in every bite.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Shop</h4>
          <ul className="space-y-1 text-sm text-neutral-300">
            <li><Link to="/shop/listing">All Products</Link></li>
            <li><Link to="/shop/listing">Ghee Thekua</Link></li>
            <li><Link to="/shop/listing">Jaggery Thekua</Link></li>
            <li><Link to="/shop/listing">Assorted Boxes</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Company</h4>
          <ul className="space-y-1 text-sm text-neutral-300">
            <li><Link to="/shop/about">About</Link></li>
            <li><Link to="/shop/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Policies</h4>
          <ul className="space-y-1 text-sm text-neutral-300">
            <li><Link to="/shop/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/shop/terms">Terms & Conditions</Link></li>
            <li><Link to="/shop/refund-policy">Refund Policy</Link></li>
            <li><Link to="/shop/shipping-policy">Shipping Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-neutral-800 py-4 text-center text-xs text-neutral-400">
        © {new Date().getFullYear()} Banarasi Thekua · Traditional taste, modern care
      </div>
    </footer>
  );
}
