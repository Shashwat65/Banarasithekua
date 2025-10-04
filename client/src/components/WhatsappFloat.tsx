import { MessageCircle } from 'lucide-react';

const WhatsappFloat = () => {
  const phone = '+919981155442'; // central support number
  const message = encodeURIComponent('Hi! I would like to know more about Banarasi Thekua.');
  const href = `https://wa.me/${phone.replace(/[^\d]/g,'')}?text=${message}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed z-50 bottom-5 right-5 md:bottom-6 md:right-6 group"
    >
      <div className="relative">
        <span className="absolute inset-0 rounded-full bg-green-500/40 blur-xl opacity-60 group-hover:opacity-80 transition" />
        <div className="relative h-14 w-14 md:h-16 md:w-16 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg shadow-green-600/40 border border-white/40 hover:scale-105 active:scale-95 transition">
          <MessageCircle className="h-7 w-7 text-white" />
        </div>
      </div>
    </a>
  );
};

export default WhatsappFloat;
