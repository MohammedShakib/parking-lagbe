"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password) {
      setError("Please provide both email/username and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed. Please verify your credentials.");
      }

      // If a specific redirect was requested (e.g. from middleware), honor it unless admin
      const destination = redirectTarget || data.redirectTo || "/dashboard";
      router.push(destination);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid credentials";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Brand & Title */}
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-lg font-bold text-neutral-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            P
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Parking Lagbe</span>
        </Link>
        <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">Welcome back</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Sign in with your email or username to access your dashboard.
        </p>
      </div>

      {/* Card Form */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-xl shadow-2xl sm:p-8">
        {error && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300 flex items-start gap-2.5">
            <span className="text-sm">⚠️</span>
            <div className="flex-1 leading-relaxed">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Username or Email
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. user123 or name@example.com"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              autoComplete="username"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-neutral-400 hover:text-neutral-200 transition"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                autoComplete="current-password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-700 bg-neutral-950 text-emerald-500 focus:ring-emerald-500"
              />
              <span className="text-xs text-neutral-400">Remember me</span>
            </label>
            <Link
              href="/"
              className="text-xs text-neutral-400 hover:text-neutral-200 transition"
            >
              Back to Home
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-sm font-semibold text-neutral-950 shadow-lg shadow-emerald-500/20 transition hover:opacity-95 disabled:opacity-50 mt-2"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-6 border-t border-neutral-800/80 pt-6 text-center text-xs text-neutral-400">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/register"
            className="font-semibold text-emerald-400 hover:text-emerald-300 transition"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-12 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <Suspense fallback={<div className="text-sm text-neutral-400">Loading sign in...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
