import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Signup() {
  const { signup, verify } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "otp">("form");
  const [loading, setLoading] = useState(false);
  const [otpHint, setOtpHint] = useState<string | null>(null);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast("Please fill in all required fields");
      return;
    }
    setLoading(true);
    const result = await signup(name, email, password, phone || undefined);
    setLoading(false);
    if (result.ok) {
      setOtpHint(result.otpHint || null);
      toast(
        [result.message || "OTP sent", result.otpHint ? `OTP: ${result.otpHint}` : null]
          .filter(Boolean)
          .join(" • "),
      );
      setStep("otp");
    } else {
      toast(("error" in result && result.error) || "Failed to sign up");
    }
  };

  const onVerify = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const result = await verify(email, otp);
    setLoading(false);
    if (result.ok) {
      const verified = result.user;
      toast(result.message || "Verified");
  setOtpHint(null);
      const from = (location.state as { from?: string } | null)?.from;
      const fallback = verified.role === "admin" ? "/admin" : "/";
      nav(from || fallback, { replace: true });
    } else {
      toast(("error" in result && result.error) || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {step === "form" ? (
        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold">Create account</h1>
          <Input placeholder="Full Name" type="text" value={name} onChange={e => setName(e.target.value)} required />
          <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input placeholder="Password (min 6 characters)" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          <Input placeholder="Phone Number (optional)" type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
          <Button disabled={loading} type="submit" className="w-full">{loading ? "Creating…" : "Sign up"}</Button>
          <div className="text-sm text-muted-foreground">Have an account? <Link to="/login" className="underline">Login</Link></div>
        </form>
      ) : (
        <form onSubmit={onVerify} className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold">Verify email</h1>
          {otpHint ? (
            <p className="text-xs text-muted-foreground bg-muted/40 border border-dashed border-border rounded-lg px-3 py-2">
              Enter OTP <span className="font-semibold text-secondary">{otpHint}</span> to verify your account.
            </p>
          ) : null}
          <Input placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} inputMode="numeric" required />
          <Button disabled={loading} type="submit" className="w-full">{loading ? "Verifying…" : "Verify"}</Button>
        </form>
      )}
    </div>
  );
}
