"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();

  // User type tab: 'user' | 'garage_owner'
  const [accountType, setAccountType] = useState<"user" | "garage_owner">("user");

  // Personal fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Garage fields (if garage_owner)
  const [garageName, setGarageName] = useState("");
  const [parkingLotAddress, setParkingLotAddress] = useState("");
  const [parkingType, setParkingType] = useState("Indoor");
  const [garageSlots, setGarageSlots] = useState("5");
  const [pricePerHour, setPricePerHour] = useState("50");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter your password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const payload: Record<string, unknown> = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        address: address.trim(),
        password,
        isGarageOwner: accountType === "garage_owner",
      };

      if (accountType === "garage_owner") {
        payload.garageDetails = {
          garageName: garageName.trim() || `${firstName}'s Parking Space`,
          parkingLotAddress: parkingLotAddress.trim() || address.trim(),
          parkingType,
          parkingDimensions: "Standard (Car & Bike)",
          garageSlots: parseInt(garageSlots, 10) || 5,
          pricePerHour: parseFloat(pricePerHour) || 50,
          latitude: 23.8103,
          longitude: 90.4125,
        };
      }

      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed. Please check your details.");
      }

      // Success -> navigate to dashboard
      const target = data.redirectTo || (accountType === "garage_owner" ? "/business" : "/dashboard");
      router.push(target);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Registration error";
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 px-4 py-10 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl">
        {/* Brand Header */}
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-lg font-bold text-neutral-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              P
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Parking Lagbe</span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">Create your account</h1>
          <p className="mt-1.5 text-xs text-neutral-400">
            Join the smart parking network to reserve or host parking spaces.
          </p>
        </div>

        {/* Card Form */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 backdrop-blur-xl shadow-2xl sm:p-8">
          {/* Account Type Toggle */}
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl border border-neutral-800 bg-neutral-950/80 p-1">
            <button
              type="button"
              onClick={() => setAccountType("user")}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition ${
                accountType === "user"
                  ? "bg-emerald-500 text-neutral-950 shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <span>🚗</span>
              <span>Driver / User</span>
            </button>
            <button
              type="button"
              onClick={() => setAccountType("garage_owner")}
              className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-semibold transition ${
                accountType === "garage_owner"
                  ? "bg-teal-400 text-neutral-950 shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              <span>🅿️</span>
              <span>Garage / Host</span>
            </button>
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300 flex items-start gap-2.5">
              <span className="text-sm">⚠️</span>
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Details Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Shakib"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none transition focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Ahmed"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none transition focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. shakib99"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none transition focus:border-emerald-500"
                  autoComplete="username"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none transition focus:border-emerald-500"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Phone (Optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1700 000000"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none transition focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Address (Optional)</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Dhanmondi, Dhaka"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none transition focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none transition focus:border-emerald-500"
                  autoComplete="new-password"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-400 mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat password"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 outline-none transition focus:border-emerald-500"
                  autoComplete="new-password"
                />
              </div>
            </div>

            {/* Space / Garage Owner Additional Info */}
            {accountType === "garage_owner" && (
              <div className="mt-4 rounded-xl border border-teal-500/30 bg-teal-950/20 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-teal-300 mb-1">
                  <span>🅿️ Initial Garage Listing Details</span>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">Garage / Space Name</label>
                  <input
                    type="text"
                    required={accountType === "garage_owner"}
                    value={garageName}
                    onChange={(e) => setGarageName(e.target.value)}
                    placeholder="e.g. Green Valley Parking Zone"
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-neutral-400 mb-1">Parking Address</label>
                  <input
                    type="text"
                    required={accountType === "garage_owner"}
                    value={parkingLotAddress}
                    onChange={(e) => setParkingLotAddress(e.target.value)}
                    placeholder="e.g. Road 27, Banani, Dhaka"
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none focus:border-teal-500"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">Type</label>
                    <select
                      value={parkingType}
                      onChange={(e) => setParkingType(e.target.value)}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-2.5 py-2 text-xs text-white outline-none focus:border-teal-500"
                    >
                      <option value="Indoor">Indoor</option>
                      <option value="Outdoor">Outdoor</option>
                      <option value="Covered">Covered</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">Capacity</label>
                    <input
                      type="number"
                      min="1"
                      value={garageSlots}
                      onChange={(e) => setGarageSlots(e.target.value)}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-2.5 py-2 text-xs text-white outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-400 mb-1">Rate (৳/hr)</label>
                    <input
                      type="number"
                      min="10"
                      value={pricePerHour}
                      onChange={(e) => setPricePerHour(e.target.value)}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-2.5 py-2 text-xs text-white outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-xs font-semibold text-neutral-950 shadow-lg shadow-emerald-500/20 transition hover:opacity-95 disabled:opacity-50 mt-4"
            >
              {loading
                ? "Creating account..."
                : accountType === "garage_owner"
                ? "Register as Space Host"
                : "Create Driver Account"}
            </button>
          </form>

          <div className="mt-6 border-t border-neutral-800/80 pt-5 text-center text-xs text-neutral-400">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-emerald-400 hover:text-emerald-300 transition">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
