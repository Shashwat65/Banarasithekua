import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
  return (
    <div className="min-h-screen bg-muted/10 py-16">
      <div className="container mx-auto px-6 max-w-4xl space-y-10">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.5em] text-secondary/50">Get in touch</p>
          <h1 className="text-4xl font-semibold text-secondary">Contact Us</h1>
          <p className="text-secondary/70">We&apos;re happy to assist with orders, bulk inquiries, and feedback.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border bg-card p-6 space-y-3">
            <h2 className="text-xl font-semibold text-secondary">Reach us</h2>
            <p className="text-muted-foreground">Email: info@banarasithekua.com</p>
            <p className="text-muted-foreground">Phone: +91 96930 56200</p>
            <p className="text-muted-foreground">Address: Varanasi, Uttar Pradesh</p>
          </div>

          <form className="rounded-2xl border bg-card p-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" placeholder="How can we help?" />
            </div>
            <Button type="button" className="w-full">Send message</Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
