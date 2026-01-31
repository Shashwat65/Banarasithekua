import { Instagram, Facebook, Mail, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import ganeshaMark from "@/assets/ganesha-mark.svg";

const Footer = () => {
  return (
    <footer id="footer" className="bg-[#1c120f] text-[#f6f1e9]">
      <div className="border-b border-white/10">
        <div className="container mx-auto px-6 py-16 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-4">
              <img src={ganeshaMark} alt="Banarasi Thekua monogram" className="w-12 h-12 md:w-14 md:h-14" />
              <div className="space-y-1">
                <span className="text-[10px] sm:text-xs uppercase tracking-[0.45em] text-[#f6f1e9]/70">Banarasi Thekua</span>
                <h4 className="text-xl sm:text-2xl font-semibold">Heritage Mithai Atelier</h4>
              </div>
            </div>
            <p className="text-sm text-[#f6f1e9]/70 leading-relaxed">
              Handcrafting thekua in micro-batches from Maruti Nagar, Varanasi—where family recipes meet modern hygiene and same-day dispatch.
            </p>
            <div className="flex items-center gap-4 text-[#f6f1e9]/60">
              <a
                href="https://www.instagram.com/banarasithekua?utm_source=qr&igsh=MXNrZndpMGI5Nmljdg=="
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-[#f6f1e9] transition"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/share/1DBXGFTa9r/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-[#f6f1e9] transition"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="mailto:info@banarasithekua.com"
                aria-label="Email"
                className="hover:text-[#f6f1e9] transition"
              >
                <Mail className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/919981155442?text=Hi!%20I%20would%20like%20to%20know%20more%20about%20Banarasi%20Thekua."
                aria-label="WhatsApp"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#f6f1e9] transition"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h5 className="text-sm font-semibold uppercase tracking-[0.35em] text-[#f6f1e9]/60">Quick Links</h5>
            <ul className="space-y-3 text-sm text-[#f6f1e9]/70">
              <li><a href="#hero" className="hover:text-[#f6f1e9] transition">Home</a></li>
              <li><a href="#products" className="hover:text-[#f6f1e9] transition">Shop</a></li>
              <li><a href="#team" className="hover:text-[#f6f1e9] transition">Team</a></li>
              <li><Link to="/about" className="hover:text-[#f6f1e9] transition">About Us</Link></li>
              <li><a href="#reviews" className="hover:text-[#f6f1e9] transition">Testimonials</a></li>
              <li><Link to="/contact" className="hover:text-[#f6f1e9] transition">Contact</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <h5 className="text-sm font-semibold uppercase tracking-[0.35em] text-[#f6f1e9]/60">Policies</h5>
            <ul className="space-y-3 text-sm text-[#f6f1e9]/70">
              <li><Link to="/terms" className="hover:text-[#f6f1e9] transition">Terms &amp; Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-[#f6f1e9] transition">Privacy Policy</Link></li>
              <li><Link to="/returns-and-shipping" className="hover:text-[#f6f1e9] transition">Refund, Return &amp; Shipping</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-4">
            <h5 className="text-sm font-semibold uppercase tracking-[0.35em] text-[#f6f1e9]/60">Contact</h5>
            <div className="space-y-3 text-sm text-[#f6f1e9]/70">
              <p>📍 Maruti Nagar Colony, Samneghat, Varanasi</p>
              <p>• Landmark: Beside Kidzee School, Maruti Nagar</p>
              <p>✉️ info@banarasithekua.com</p>
              <p>📞 +91 99811 55442</p>
              <p className="text-xs text-[#f6f1e9]/40">Customer Care: Mon–Sat, 9 AM – 8 PM IST</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-6 text-center text-xs tracking-[0.45em] uppercase text-[#f6f1e9]/40">
        © {new Date().getFullYear()} Banarasi Thekua · Traditional Taste, Modern Care
      </div>
    </footer>
  );
};

export default Footer;