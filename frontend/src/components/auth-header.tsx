"use client";

import Image from "next/image";
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
      ? "ðŸ’Ž"
      : profile?.user_level === "gold"
      ? "ðŸ†"
      : "â­";

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-black/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/brand/parking-lagbe-full-logo-transparent.png"
            alt="Parking Lagbe"
            width={1095}
            height={549}
            className="h-11 w-auto object-contain sm:h-12 md:h-14"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 text-sm md:flex">
          <Link
            href="/"
            className="font-medium text-white/90 transition-colors hover:text-[#f39c12]"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="font-medium text-white/90 transition-colors hover:text-[#f39c12]"
          >
            Find Parking
          </Link>
          <Link
            href="/business"
            className="font-medium text-white/90 transition-colors hover:text-[#f39c12]"
          >
            Host Garage
          </Link>
          {profile?.role === "admin" && (
            <Link
              href="/admin"
              className="font-medium text-white/90 transition-colors hover:text-[#f39c12]"
            >
              Admin Panel
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {profile ? (
            <>
              {currentDashboard === "user" ? (
                <button
                  disabled={isSwitching}
                  onClick={() => handleSwitchDashboard("business")}
                  className="hidden items-center rounded-xl border border-[#f39c12] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#f39c12] hover:text-neutral-950 shadow-sm sm:inline-flex"
                >
                  {isSwitching ? "Switching..." : "Switch To Business ðŸ¢"}
                </button>
              ) : currentDashboard === "business" ? (
                <button
                  disabled={isSwitching}
                  onClick={() => handleSwitchDashboard("user")}
                  className="hidden items-center rounded-xl border border-[#f39c12] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#f39c12] hover:text-neutral-950 shadow-sm sm:inline-flex"
                >
                  {isSwitching ? "Switching..." : "Switch To Driver ðŸš—"}
                </button>
              ) : null}

              <Link
                href="/dashboard"
                className="flex cursor-pointer items-center gap-1.5 rounded-full border border-[#f39c12]/40 bg-[#f39c12]/20 px-3 py-1.5 backdrop-blur-sm transition hover:bg-[#f39c12]/30"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5 text-[#f39c12]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
                <span className="text-xs font-bold text-[#f39c12]">
                  {profile.points.toLocaleString()} PTS
                </span>
              </Link>

              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-[#f39c12] bg-[#f39c12]/20 transition hover:scale-105"
                >
                  <span className="text-sm font-bold text-[#f39c12]">{firstLetter}</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-900 p-0 shadow-2xl animate-fadeIn">
                    <div className="flex items-center gap-3 border-b border-neutral-800 bg-gradient-to-r from-[#f39c12]/20 to-[#f39c12]/5 p-4">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border-2 border-[#f39c12] bg-[#f39c12]/20">
                        <span className="text-base font-bold text-[#f39c12]">{firstLetter}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1 truncate text-xs font-bold text-white">
                          <span>
                            {profile.first_name} {profile.last_name}
                          </span>
                          <span title={`${profile.user_level} VIP`}>{userLevelIcon}</span>
                        </div>
                        <div className="truncate text-[11px] text-neutral-400">
                          @{profile.username}
                        </div>
                        <div className="mt-0.5 text-[10px] font-semibold text-[#f39c12]">
                          {profile.user_level} VIP Tier ({profile.points} pts)
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1 p-2 text-xs text-neutral-300">
                      <Link
                        href="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition hover:bg-neutral-800 hover:text-white"
                      >
                        <span>🎫</span>
                        <span>My Bookings</span>
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition hover:bg-neutral-800 hover:text-white"
                      >
                        <span>🚗</span>
                        <span>My Vehicles</span>
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition hover:bg-neutral-800 hover:text-white"
                      >
                        <span>💳</span>
                        <span>Payment History & Invoices</span>
                      </Link>
                      <Link
                        href="/business"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition hover:bg-neutral-800 hover:text-white"
                      >
                        <span>🏢</span>
                        <span>Business Dashboard</span>
                      </Link>
                      {profile.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition hover:bg-neutral-800 hover:text-white"
                        >
                          <span>🛡️</span>
                          <span>Admin Console</span>
                        </Link>
                      )}

                      <div className="my-1 border-t border-neutral-800" />

                      <button
                        disabled={isLoggingOut}
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-red-400 transition hover:bg-red-500/10"
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
                className="rounded-xl border border-white/20 bg-black/40 px-4 py-2 text-xs font-bold text-white transition hover:border-[#f39c12] hover:text-[#f39c12]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-[#f39c12] px-4 py-2 text-xs font-bold text-white transition shadow-lg shadow-[#f39c12]/20 hover:bg-[#e67e22]"
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
