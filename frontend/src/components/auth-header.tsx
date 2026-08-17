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
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-colors">
      <div className="container mx-auto px-4 py-3.5 flex justify-between items-center">
        {/* Brand Logo matching legacy home.php */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="w-10 h-10 bg-[#f39c12] rounded-full flex justify-center items-center overflow-hidden shadow-md shadow-[#f39c12]/30 group-hover:scale-105 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 text-white"
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
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            পার্কিং লাগবে <span className="text-[#f39c12]">?</span>
          </h1>
        </Link>

        {/* Navigation Links for desktop */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-7 text-sm font-semibold">
            <li>
              <Link
                href="/"
                className="text-slate-600 hover:text-[#f39c12] transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className={`transition-colors ${
                  currentDashboard === "user"
                    ? "text-[#d97706] font-bold"
                    : "text-slate-600 hover:text-[#f39c12]"
                }`}
              >
                Find Parking
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="text-slate-600 hover:text-[#f39c12] transition-colors"
              >
                My Bookings
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="text-slate-600 hover:text-[#f39c12] transition-colors"
              >
                My Profile
              </Link>
            </li>
          </ul>
        </nav>

        {/* Action Controls matching legacy home.php */}
        <div className="flex items-center gap-3">
          {profile ? (
            <>
              {/* Business Mode Switcher */}
              {currentDashboard === "business" ? (
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition shadow-sm"
                >
                  🚗 Switch To Driver Mode
                </Link>
              ) : (
                <Link
                  href="/business"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-[#f39c12] bg-amber-50/50 px-3.5 py-1.5 text-xs font-bold text-[#d97706] hover:bg-[#f39c12] hover:text-white transition shadow-sm"
                >
                  🏢 Switch To Business
                </Link>
              )}

              {/* Admin Console Shortcut */}
              {profile.role === "admin" && currentDashboard !== "admin" && (
                <Link
                  href="/admin"
                  className="hidden lg:inline-flex rounded-xl bg-purple-50 text-purple-700 border border-purple-200 px-3 py-1.5 text-xs font-bold hover:bg-purple-100 transition"
                >
                  🛡️ Admin Panel
                </Link>
              )}

              {/* Points Badge */}
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 px-3 py-1.5 rounded-full hover:bg-amber-100 transition cursor-pointer shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 text-[#f39c12]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
                <span className="text-xs font-bold text-amber-900">
                  {profile.points || 0} PTS
                </span>
              </Link>

              {/* Profile Avatar Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-9 h-9 rounded-full bg-amber-100 border-2 border-[#f39c12] overflow-hidden flex items-center justify-center cursor-pointer hover:scale-105 transition shadow-sm"
                >
                  <span className="text-sm font-bold text-amber-800">{firstLetter}</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white shadow-2xl p-0 overflow-hidden z-50 animate-fadeIn">
                    <div className="p-4 bg-amber-50/70 border-b border-slate-200 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-amber-100 border-2 border-[#f39c12] flex items-center justify-center flex-shrink-0">
                        <span className="text-base font-bold text-amber-800">{firstLetter}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 text-xs truncate flex items-center gap-1">
                          <span>
                            {profile.first_name} {profile.last_name}
                          </span>
                          <span title={`${profile.user_level} VIP`}>{userLevelIcon}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          @{profile.username}
                        </div>
                        <div className="text-[10px] text-[#d97706] font-bold mt-0.5">
                          {profile.user_level} VIP Tier ({profile.points} pts)
                        </div>
                      </div>
                    </div>

                    <div className="p-2 text-xs space-y-1 text-slate-700">
                      <Link
                        href="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition"
                      >
                        <span>🎫</span>
                        <span>My Bookings</span>
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition"
                      >
                        <span>🚗</span>
                        <span>My Vehicles</span>
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition"
                      >
                        <span>💳</span>
                        <span>Payment History & Invoices</span>
                      </Link>
                      <Link
                        href="/business"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition"
                      >
                        <span>🏢</span>
                        <span>Business Dashboard</span>
                      </Link>
                      {profile.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition"
                        >
                          <span>🛡️</span>
                          <span>Admin Console</span>
                        </Link>
                      )}

                      <div className="my-1 border-t border-slate-100" />

                      <button
                        disabled={isLoggingOut}
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 transition text-left"
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
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:border-[#f39c12] hover:text-[#d97706] transition shadow-sm"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-[#f39c12] px-4 py-2 text-xs font-bold text-white hover:bg-[#e67e22] shadow-md shadow-[#f39c12]/20 transition"
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
