"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<"driver" | "garage_owner">("driver");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          firstName,
          lastName,
          phone,
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      if (role === "garage_owner") {
        router.push("/business");
      } else {
        router.push("/dashboard");
      }
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error creating account";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Branding Panel */}
        <div className="bg-gradient-to-br from-[#f39c12] to-[#e67e22] p-8 sm:p-12 text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                <span className="font-black text-[#f39c12] text-xl">P</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight">পার্কিং লাগবে ?</h2>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black mb-3 leading-snug">
              Create Your Free Account
            </h1>
            <p className="text-white/90 text-xs sm:text-sm leading-relaxed">
              Join thousands of drivers finding instant parking spaces across Dhaka, or register as a host to monetize your empty parking spots.
            </p>
          </div>

          <div className="pt-8 border-t border-white/20 mt-8">
            <p className="text-xs text-white/80">
              Already have an account?{" "}
              <Link href="/login" className="font-bold underline text-white hover:text-amber-100">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-white">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Get Started</h2>
            <p className="text-xs text-slate-500 mt-1">Select your account type and fill in your details</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-700 font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 mb-5">
            <button
              type="button"
              onClick={() => setRole("driver")}
              className={`py-2 text-xs font-bold rounded-xl transition ${
                role === "driver"
                  ? "bg-white text-[#d97706] shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🚗 Driver (Search & Book)
            </button>
            <button
              type="button"
              onClick={() => setRole("garage_owner")}
              className={`py-2 text-xs font-bold rounded-xl transition ${
                role === "garage_owner"
                  ? "bg-white text-[#d97706] shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🏢 Space Host (Business)
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Shakib"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#f39c12]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Al Hasan"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#f39c12]"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Username *</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Choose unique username"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#f39c12]"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. user@example.com"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#f39c12]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01700000000"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#f39c12]"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Password *</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#f39c12]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#f39c12] hover:bg-[#e67e22] py-3 font-bold text-white text-xs shadow-md shadow-[#f39c12]/20 transition disabled:opacity-50 mt-3"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
