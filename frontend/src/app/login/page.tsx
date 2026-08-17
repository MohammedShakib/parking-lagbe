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

  const performLogin = async (customRole?: "regular_user" | "garage_owner" | "admin", customUser?: string) => {
    setLoading(true);
    setError(null);

    const userToSubmit = customUser !== undefined ? customUser : username;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: userToSubmit,
          username: userToSubmit,
          password: password || "demo123",
          role: customRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.redirectTo) {
        router.push(data.redirectTo);
      } else if (data.role === "admin") {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await performLogin();
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
              Click <span className="font-semibold text-slate-700">Sign In</span> to enter directly, or enter your credentials
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
                Username or Email <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. driver_demo or user@example.com"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#f39c12] focus:ring-1 focus:ring-[#f39c12]"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                Password <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#f39c12] focus:ring-1 focus:ring-[#f39c12]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#f39c12] hover:bg-[#e67e22] py-3 font-bold text-white text-xs shadow-md shadow-[#f39c12]/20 transition disabled:opacity-50 mt-2 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Sign In to Account</span>
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Role Switchers */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
              Quick 1-Click Access
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => performLogin("regular_user", "demo_driver")}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-200 transition text-center cursor-pointer"
              >
                <div className="text-base">🚗</div>
                <div className="text-[10px] font-bold text-slate-700">Driver</div>
              </button>

              <button
                type="button"
                onClick={() => performLogin("garage_owner", "demo_owner")}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-200 transition text-center cursor-pointer"
              >
                <div className="text-base">🏢</div>
                <div className="text-[10px] font-bold text-slate-700">Space Host</div>
              </button>

              <button
                type="button"
                onClick={() => performLogin("admin", "admin")}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-200 transition text-center cursor-pointer"
              >
                <div className="text-base">🛡️</div>
                <div className="text-[10px] font-bold text-slate-700">Admin</div>
              </button>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-slate-500">
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
