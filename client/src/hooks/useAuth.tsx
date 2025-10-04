import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { authAPI } from "@/services/api";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
} | null;

type SignupResult = { ok: boolean; message?: string; error?: string };

type AuthContextValue = {
  user: User;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  signup: (name: string, email: string, password: string) => Promise<SignupResult>;
  logout: () => Promise<void>;
  refresh: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type RawUser = {
  id?: string;
  _id?: string;
  userName?: string;
  name?: string;
  email?: string;
  role?: string;
};

const mapUser = (raw?: RawUser | null): NonNullable<User> | null => {
  if (!raw || !raw.email) return null;
  const id = raw.id || raw._id;
  if (!id) return null;
  const name = raw.userName || raw.name || raw.email.split("@")[0];
  const role = raw.role === "admin" ? "admin" : "user";
  return { id, name, email: raw.email, role };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed?.email) setUser(parsed);
          } catch {
            localStorage.removeItem("user");
          }
        }
        await refresh();
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = async () => {
    try {
      const response = await authAPI.checkAuth();
      if (response.data?.success) {
        const mapped = mapUser(response.data.user);
        if (mapped) {
          setUser(mapped);
          localStorage.setItem("user", JSON.stringify(mapped));
          return mapped;
        }
      }
    } catch (error) {
      console.warn("Auth refresh failed", error);
    }
    setUser(null);
    localStorage.removeItem("user");
    return null;
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      if (!response.data?.success) return null;
      const mapped = mapUser(response.data.user);
      if (mapped) {
        setUser(mapped);
        localStorage.setItem("user", JSON.stringify(mapped));
        return mapped;
      }
      return null;
    } catch (error) {
      console.error("Login error:", error);
      return null;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<SignupResult> => {
    try {
      const payload = { userName: name, email, password };
      const response = await authAPI.register(payload);
      if (response.data?.success) {
        return { ok: true, message: response.data.message };
      }
      return {
        ok: false,
        error: response.data?.message || "Unable to sign up",
      };
    } catch (error: any) {
      console.error("Signup error:", error);
      return {
        ok: false,
        error: error.response?.data?.message || "Unable to sign up",
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.warn("Logout failed", error);
    }
    localStorage.removeItem("user");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      signup,
      logout,
      refresh,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
