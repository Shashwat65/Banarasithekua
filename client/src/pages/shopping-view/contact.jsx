import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <p className="text-muted-foreground mb-6">We'd love to hear from you.</p>
      <div className="grid gap-3">
        <Input placeholder="Your name" />
        <Input placeholder="Email" type="email" />
        <Textarea placeholder="Message" rows={5} />
        <Button disabled>Send (coming soon)</Button>
      </div>
    </div>
  );
}
