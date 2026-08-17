"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<"driver" | "owner">("driver");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

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
          address,
          accountType: userType === "owner" ? "owner" : "user",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/login?registered=true");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration error";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 text-white">
      {/* Background Image with Overlay matching registration.php */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-[-2]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      />
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1]" />

      <div className="w-full max-w-4xl bg-black/60 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/20 z-10">
        {/* Left Banner */}
        <div className="md:w-5/12 bg-gradient-to-br from-[#f39c12] via-[#e67e22] to-[#d35400] p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
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

            <h2 className="text-3xl font-extrabold mb-3">Join The Network!</h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              Create your account in seconds. Find parking instantly across Dhaka or monetize your vacant parking spot.
            </p>
          </div>

          <div className="relative z-10 mt-8 pt-6 border-t border-white/20 text-xs text-white/80">
            Guaranteed Parking Security & Digital Payment
          </div>
        </div>

        {/* Right Form */}
        <div className="md:w-7/12 p-8 sm:p-10 bg-neutral-950/80">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white">Create New Account</h3>
            <p className="text-xs text-white/60 mt-1">
              Select your role and enter your details below.
            </p>
          </div>

          {/* Role Switcher */}
          <div className="grid grid-cols-2 gap-2 mb-5 rounded-xl bg-black/50 p-1 border border-white/10">
            <button
              type="button"
              onClick={() => setUserType("driver")}
              className={`rounded-lg py-2 text-xs font-bold transition ${
                userType === "driver"
                  ? "bg-[#f39c12] text-white shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              🚗 Driver (Book Spots)
            </button>
            <button
              type="button"
              onClick={() => setUserType("owner")}
              className={`rounded-lg py-2 text-xs font-bold transition ${
                userType === "owner"
                  ? "bg-[#f39c12] text-white shadow-md"
                  : "text-white/60 hover:text-white"
              }`}
            >
              🏢 Space Host (Earn 70%)
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Shakib"
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-3.5 py-2.5 text-xs text-white placeholder-white/40 outline-none focus:border-[#f39c12]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Khan"
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-3.5 py-2.5 text-xs text-white placeholder-white/40 outline-none focus:border-[#f39c12]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. shakib01"
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-3.5 py-2.5 text-xs text-white placeholder-white/40 outline-none focus:border-[#f39c12]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-3.5 py-2.5 text-xs text-white placeholder-white/40 outline-none focus:border-[#f39c12]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Phone</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1700 000000"
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-3.5 py-2.5 text-xs text-white placeholder-white/40 outline-none focus:border-[#f39c12]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/80 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password"
                  className="w-full rounded-xl border border-white/15 bg-black/50 px-3.5 py-2.5 text-xs text-white placeholder-white/40 outline-none focus:border-[#f39c12]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 mb-1">Area / Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Dhanmondi, Dhaka"
                className="w-full rounded-xl border border-white/15 bg-black/50 px-3.5 py-2.5 text-xs text-white placeholder-white/40 outline-none focus:border-[#f39c12]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#f39c12] py-3 text-xs font-bold text-white shadow-xl shadow-[#f39c12]/25 hover:bg-[#e67e22] transition disabled:opacity-50 mt-3"
            >
              {loading ? "Creating Account..." : "Create Free Account 🚀"}
            </button>
          </form>

          <div className="mt-4 text-center text-xs text-white/60">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#f39c12] hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
