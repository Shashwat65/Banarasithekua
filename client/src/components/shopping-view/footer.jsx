import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-12 border-t bg-muted/30">
      <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-4">
        <div className="space-y-2">
          <h3 className="text-lg font-bold">Banarasi Thekua</h3>
          <p className="text-sm text-muted-foreground">
            Handmade Banarasi delights, baked fresh with love. Taste the
            tradition in every bite.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Shop</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/shop/listing">All Products</Link></li>
            <li><Link to="/shop/listing">Ghee Thekua</Link></li>
            <li><Link to="/shop/listing">Jaggery Thekua</Link></li>
            <li><Link to="/shop/listing">Assorted Boxes</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Company</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/shop/about">About</Link></li>
            <li><Link to="/shop/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Legal</h4>
          <ul className="space-y-1 text-sm">
            <li><Link to="/shop/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/shop/terms">Terms of Service</Link></li>
            <li><Link to="/shop/refund-policy">Refund Policy</Link></li>
            <li><Link to="/shop/shipping-policy">Shipping Policy</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Banarasi Thekua. All rights reserved.
      </div>
    </footer>
  );
}
