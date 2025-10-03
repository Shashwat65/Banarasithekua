import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const logged = await login(email, password);
    setLoading(false);
    if (logged) {
      toast("Welcome back!");
      const from = (location.state as { from?: string } | null)?.from;
      const fallback = logged.role === "admin" ? "/admin" : "/";
      nav(from || fallback, { replace: true });
    } else toast("Invalid credentials", { description: "Please try again." });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Login</h1>
        <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <Button disabled={loading} type="submit" className="w-full">{loading ? "Logging in…" : "Login"}</Button>
        <div className="text-sm text-muted-foreground">No account? <Link to="/signup" className="underline">Sign up</Link></div>
      </form>
    </div>
  );
}
