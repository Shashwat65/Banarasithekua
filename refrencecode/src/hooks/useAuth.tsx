import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authAPI } from "@/services/api";

export type User = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
} | null;

type SignupResult =
  | { ok: true; message?: string; otpHint?: string }
  | { ok: false; error?: string };
type VerifyResult = { ok: true; user: User; message?: string } | { ok: false; error?: string };

type AuthContextValue = {
  user: User;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  signup: (name: string, email: string, password: string, phone?: string) => Promise<SignupResult>;
  verify: (email: string, otp: string) => Promise<VerifyResult>;
  resendOTP: (email: string) => Promise<{ ok: boolean; message?: string; error?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<User>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const t = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      
      if (t && storedUser) {
        setToken(t);
        try {
          // First set the stored user data
          const userData = JSON.parse(storedUser);
          setUser(userData);
          
          // Then try to refresh from server
          const response = await authAPI.getProfile();
          setUser(response.data.user);
        } catch (error) {
          // If server fails, keep the stored user data
          console.log("Failed to refresh user from server, using stored data");
        }
      }
      setIsLoading(false);
    };
    
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      const { token: authToken, user: userData } = response.data;
      
      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(userData));
      setToken(authToken);
      setUser(userData);
      
      return userData as User;
    } catch (error: any) {
      console.error("Login error:", error);
      return null;
    }
  };

  const signup = async (name: string, email: string, password: string, phone?: string): Promise<SignupResult> => {
    try {
      const response = await authAPI.register({ name, email, password, phone });
      return { 
        ok: true, 
        message: response.data.message 
      };
    } catch (error: any) {
      console.error("Signup error:", error);
      return { 
        ok: false, 
        error: error.response?.data?.message || "Unable to sign up" 
      };
    }
  };

  const verify = async (email: string, otp: string): Promise<VerifyResult> => {
    try {
      const response = await authAPI.verifyOTP({ email, otp });
      const { token: authToken, user: userData } = response.data;
      
      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(userData));
      setToken(authToken);
      setUser(userData);
      
      return { 
        ok: true, 
        user: userData as User, 
        message: response.data.message 
      };
    } catch (error: any) {
      console.error("Verify error:", error);
      return { 
        ok: false, 
        error: error.response?.data?.message || "Invalid OTP" 
      };
    }
  };

  const resendOTP = async (email: string) => {
    try {
      const response = await authAPI.resendOTP({ email });
      return { 
        ok: true, 
        message: response.data.message 
      };
    } catch (error: any) {
      console.error("Resend OTP error:", error);
      return { 
        ok: false, 
        error: error.response?.data?.message || "Failed to resend OTP" 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ 
    user, 
    token, 
    isLoading, 
    login, 
    signup, 
    verify, 
    resendOTP, 
    logout 
  }), [user, token, isLoading]);
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
