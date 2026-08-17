"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, rememberMe }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid username or password");
      }

      if (data.redirect) {
        router.push(data.redirect);
        router.refresh();
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 text-white">
      {/* Background Image with Overlay matching login.php */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-[-2]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      />
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1]" />

      {/* Floating Animated Orbs matching login.php */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#f39c12]/15 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#e67e22]/10 rounded-full filter blur-3xl" />
      </div>

      <div className="w-full max-w-4xl bg-black/60 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/20 z-10">
        {/* Left Section with Illustration matching login.php */}
        <div className="md:w-1/2 bg-gradient-to-br from-[#f39c12] via-[#e67e22] to-[#d35400] p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4 shadow-lg shadow-black/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7 text-[#f39c12]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <path d="M9 18V6h4.5a2.5 2.5 0 0 1 0 5H9" />
                </svg>
              </div>
              <h1 className="text-2xl font-black tracking-tight">পার্কিং লাগবে</h1>
            </div>

            <h2 className="text-3xl font-extrabold mb-3">Welcome Back!</h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Login to access real-time parking spaces in Dhaka, manage active bookings, track reward points, or host your garage.
            </p>
          </div>

          <div className="relative z-10 mt-8 pt-6 border-t border-white/20 text-xs text-white/80">
            Smart & Secured Parking Network in Bangladesh
          </div>
        </div>

        {/* Right Section with Form matching login.php */}
        <div className="md:w-1/2 p-8 sm:p-12 bg-neutral-950/80 flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white">Sign In to Your Account</h3>
            <p className="text-xs text-white/60 mt-1">
              Enter your credentials to continue to your dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">
                Username or Email
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. shakib, saba, or admin"
                className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-xs text-white placeholder-white/40 outline-none focus:border-[#f39c12] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full rounded-xl border border-white/15 bg-black/50 px-4 py-3 text-xs text-white placeholder-white/40 outline-none focus:border-[#f39c12] transition"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-white/70">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-white/20 bg-black/50 text-[#f39c12] focus:ring-0"
                />
                <span>Remember me</span>
              </label>

              <Link href="#" className="text-[#f39c12] hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#f39c12] py-3 text-xs font-bold text-white shadow-xl shadow-[#f39c12]/25 hover:bg-[#e67e22] transition disabled:opacity-50 mt-2"
            >
              {loading ? "Signing In..." : "Sign In to Parking Lagbe 🚗"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-white/60">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold text-[#f39c12] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
