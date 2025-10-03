import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 grid gap-10 md:grid-cols-2">
      <div>
        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
        <p className="text-muted-foreground mb-6">We'd love to hear from you.</p>
        <div className="grid gap-3">
          <Input placeholder="Your name" />
          <Input placeholder="Email" type="email" />
          <Textarea placeholder="Message" rows={5} />
          <Button disabled>Send (coming soon)</Button>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Banarasi Thekua</h2>
        <div className="space-y-2 text-sm">
          <p>📍 Maruti Nagar Colony, Samneghat, Varanasi</p>
          <p>Landmark: Beside Kidzee School, Maruti Nagar</p>
          <p>✉️ hello@banarasithekua.com</p>
          <p>📞 +91 99811 55442</p>
          <p>Customer Care: Mon–Sat, 9 AM – 8 PM IST</p>
        </div>
      </div>
    </div>
  );
}
