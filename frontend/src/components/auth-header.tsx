"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ProfileWithAccount } from "@/lib/supabase/database.types";

interface AuthHeaderProps {
  profile: ProfileWithAccount | null;
  currentDashboard?: "user" | "business" | "admin";
}

export function AuthHeader({ profile, currentDashboard = "user" }: AuthHeaderProps) {
  const router = useRouter();
  const [isSwitching, setIsSwitching] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  };

  const handleSwitchDashboard = async (target: "user" | "business") => {
    setIsSwitching(true);
    try {
      await fetch("/api/auth/switch-dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetDashboard: target }),
      });
      router.push(target === "business" ? "/business" : "/dashboard");
      router.refresh();
    } catch {
      setIsSwitching(false);
    }
  };

  const firstLetter = (
    profile?.first_name?.charAt(0) ||
    profile?.username?.charAt(0) ||
    "U"
  ).toUpperCase();

  const userLevelIcon =
    profile?.user_level === "diamond"
      ? "💎"
      : profile?.user_level === "gold"
      ? "🏆"
      : "⭐";

  return (
    <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-md border-b border-white/20">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand Logo matching PHP */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#f39c12] rounded-full flex justify-center items-center overflow-hidden shadow-lg shadow-[#f39c12]/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-white"
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
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight drop-shadow-md">
              পার্কিং লাগবে ?
            </h1>
          </div>
        </Link>

        {/* Center Nav Links matching PHP */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link
            href="/"
            className="text-white/90 hover:text-[#f39c12] font-medium transition-colors"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="text-white/90 hover:text-[#f39c12] font-medium transition-colors"
          >
            Find Parking
          </Link>
          <Link
            href="/business"
            className="text-white/90 hover:text-[#f39c12] font-medium transition-colors"
          >
            Host Garage
          </Link>
          {profile?.role === "admin" && (
            <Link
              href="/admin"
              className="text-white/90 hover:text-[#f39c12] font-medium transition-colors"
            >
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {profile ? (
            <>
              {/* Switch Portal Button matching PHP */}
              {currentDashboard === "user" ? (
                <button
                  disabled={isSwitching}
                  onClick={() => handleSwitchDashboard("business")}
                  className="hidden sm:inline-flex items-center rounded-xl border border-[#f39c12] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#f39c12] hover:text-neutral-950 transition shadow-sm"
                >
                  {isSwitching ? "Switching..." : "Switch To Business 🏢"}
                </button>
              ) : currentDashboard === "business" ? (
                <button
                  disabled={isSwitching}
                  onClick={() => handleSwitchDashboard("user")}
                  className="hidden sm:inline-flex items-center rounded-xl border border-[#f39c12] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#f39c12] hover:text-neutral-950 transition shadow-sm"
                >
                  {isSwitching ? "Switching..." : "Switch To Driver 🚗"}
                </button>
              ) : null}

              {/* Points Badge matching PHP */}
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 bg-[#f39c12]/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-[#f39c12]/40 hover:bg-[#f39c12]/30 transition cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 text-[#f39c12]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
                <span className="text-[#f39c12] font-bold text-xs">
                  {profile.points.toLocaleString()} PTS
                </span>
              </Link>

              {/* Profile Avatar Dropdown matching PHP */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-9 h-9 rounded-full bg-[#f39c12]/20 border-2 border-[#f39c12] overflow-hidden flex items-center justify-center cursor-pointer hover:scale-105 transition"
                >
                  <span className="text-sm font-bold text-[#f39c12]">{firstLetter}</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-neutral-700 bg-neutral-900 shadow-2xl p-0 overflow-hidden z-50 animate-fadeIn">
                    {/* Header in dropdown matching PHP */}
                    <div className="p-4 bg-gradient-to-r from-[#f39c12]/20 to-[#f39c12]/5 border-b border-neutral-800 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#f39c12]/20 border-2 border-[#f39c12] flex items-center justify-center flex-shrink-0">
                        <span className="text-base font-bold text-[#f39c12]">{firstLetter}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white text-xs truncate flex items-center gap-1">
                          <span>{profile.first_name} {profile.last_name}</span>
                          <span title={`${profile.user_level} VIP`}>{userLevelIcon}</span>
                        </div>
                        <div className="text-[11px] text-neutral-400 truncate">@{profile.username}</div>
                        <div className="text-[10px] text-[#f39c12] font-semibold mt-0.5">
                          {profile.user_level} VIP Tier ({profile.points} pts)
                        </div>
                      </div>
                    </div>

                    {/* Navigation Menu in dropdown matching PHP */}
                    <div className="p-2 text-xs space-y-1 text-neutral-300">
                      <Link
                        href="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-neutral-800 hover:text-white transition"
                      >
                        <span>🎫</span>
                        <span>My Bookings</span>
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-neutral-800 hover:text-white transition"
                      >
                        <span>🚗</span>
                        <span>My Vehicles</span>
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-neutral-800 hover:text-white transition"
                      >
                        <span>💳</span>
                        <span>Payment History & Invoices</span>
                      </Link>
                      <Link
                        href="/business"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-neutral-800 hover:text-white transition"
                      >
                        <span>🏢</span>
                        <span>Business Dashboard</span>
                      </Link>
                      {profile.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-neutral-800 hover:text-white transition"
                        >
                          <span>🛡️</span>
                          <span>Admin Console</span>
                        </Link>
                      )}

                      <div className="my-1 border-t border-neutral-800" />

                      <button
                        disabled={isLoggingOut}
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition text-left"
                      >
                        <span>🚪</span>
                        <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl border border-white/20 bg-black/40 px-4 py-2 text-xs font-bold text-white hover:border-[#f39c12] hover:text-[#f39c12] transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-[#f39c12] px-4 py-2 text-xs font-bold text-white hover:bg-[#e67e22] shadow-lg shadow-[#f39c12]/20 transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
