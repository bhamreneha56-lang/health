"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Activity, Eye, EyeOff, Lock, Mail, UserCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { cn } from "@/lib/utils";

const DEMO_CREDS = [
  { role: "patient", email: "patient@aarogyam.com", label: "Patient" },
  { role: "doctor", email: "doctor@aarogyam.com", label: "Doctor" },
  { role: "admin", email: "admin@aarogyam.com", label: "Administrator" },
];

function LoginForm() {
  const { login, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const role = searchParams.get("role");
    if (role) {
      const found = DEMO_CREDS.find((c) => c.role === role);
      if (found) setEmail(found.email);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === "patient") router.replace("/dashboard");
      else if (user?.role === "doctor") router.replace("/doctor");
      else router.replace("/admin");
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (!success) {
      setError("Invalid credentials. Try the demo credentials below.");
    } else {
      toast.success("Welcome to AAROGYAM!");
    }
  };

  const quickLogin = (cred: (typeof DEMO_CREDS)[0]) => {
    setEmail(cred.email);
    setPassword("password123");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-card border border-border rounded-3xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <div className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                  AAROGYAM
                </div>
                <div className="text-xs text-muted-foreground -mt-0.5">Health Intelligence</div>
              </div>
            </Link>
            <h1 className="text-xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-sm text-muted-foreground mt-1">Sign in to your healthcare portal</p>
          </div>

          {/* Quick login buttons */}
          <div className="mb-6">
            <p className="text-xs text-muted-foreground text-center mb-3">Quick Demo Login</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO_CREDS.map((c) => (
                <button
                  key={c.role}
                  onClick={() => quickLogin(c)}
                  className={cn(
                    "px-2 py-2 rounded-xl text-xs font-semibold border transition-all",
                    email === c.email
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-muted/60 text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="pl-9"
                  required
                  aria-label="Email address"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-9 pr-9"
                  required
                  aria-label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-3 py-2.5"
                role="alert"
              >
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 rounded-xl shadow-lg shadow-blue-500/25 font-semibold"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing In...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4" />
                  Sign In to AAROGYAM
                </span>
              )}
            </Button>
          </form>

          {/* Demo hint */}
          <div className="mt-5 p-3 bg-muted/50 rounded-xl">
            <p className="text-xs text-muted-foreground text-center">
              All demo accounts use password:{" "}
              <span className="font-mono font-semibold text-foreground">password123</span>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
