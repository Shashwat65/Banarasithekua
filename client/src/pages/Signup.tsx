import { useState, type FormEvent } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Signup() {
  const { signup, login } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast("Please fill in all required fields");
      return;
    }

    setLoading(true);
    const result = await signup(name, email, password);
    if (result.ok) {
      toast(result.message || "Registration successful");
      const loggedIn = await login(email, password);
      setLoading(false);
      if (loggedIn) {
        const from = (location.state as { from?: string } | null)?.from;
        const fallback = loggedIn.role === "admin" ? "/admin" : "/";
        nav(from || fallback, { replace: true });
      } else {
        nav("/login");
      }
    } else {
      setLoading(false);
      toast(result.error || "Failed to sign up");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Create account</h1>
        <Input
          placeholder="Full Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          placeholder="Password (min 6 characters)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <Button disabled={loading} type="submit" className="w-full">
          {loading ? "Creating…" : "Sign up"}
        </Button>
        <div className="text-sm text-muted-foreground">
          Have an account? <Link to="/login" className="underline">Login</Link>
        </div>
      </form>
    </div>
  );
}
