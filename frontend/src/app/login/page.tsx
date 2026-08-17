"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.role === "admin") {
        router.push("/admin");
      } else if (data.role === "garage_owner") {
        router.push("/business");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Branding Panel matching legacy login.php */}
        <div className="bg-gradient-to-br from-[#f39c12] to-[#e67e22] p-8 sm:p-12 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                <span className="font-black text-[#f39c12] text-xl">P</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight">পার্কিং লাগবে ?</h2>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black mb-3 leading-snug">
              Welcome Back to Parking Lagbe
            </h1>
            <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
              Login to access your reserved spots, vehicle records, VIP rewards, and parking invoices across Dhaka.
            </p>
          </div>

          <div className="pt-8 border-t border-white/20 mt-8">
            <p className="text-xs text-white/80">
              Need to list a commercial or home parking lot?{" "}
              <Link href="/register" className="font-bold underline text-white hover:text-amber-100">
                Register as Space Host
              </Link>
            </p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Sign In</h2>
            <p className="text-xs text-slate-500 mt-1">
              Enter your username or email and password to continue
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 font-medium">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                Username or Email
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. driver_demo or user@example.com"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#f39c12] focus:ring-1 focus:ring-[#f39c12]"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#f39c12] focus:ring-1 focus:ring-[#f39c12]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#f39c12] hover:bg-[#e67e22] py-3 font-bold text-white text-xs shadow-md shadow-[#f39c12]/20 transition disabled:opacity-50 mt-2"
            >
              {loading ? "Signing in..." : "Sign In to Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold text-[#d97706] hover:underline">
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
