"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ProfileWithAccount } from "@/lib/supabase/database.types";

interface AuthHeaderProps {
  profile: ProfileWithAccount | null;
  currentDashboard: "user" | "business" | "admin";
}

export function AuthHeader({ profile, currentDashboard }: AuthHeaderProps) {
  const router = useRouter();
  const [isSwitching, setIsSwitching] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  const handleSwitchDashboard = async (target: "user" | "business") => {
    setIsSwitching(true);
    try {
      const res = await fetch("/api/auth/switch-dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetDashboard: target }),
      });
      const data = await res.json();
      if (data.redirectTo) {
        router.push(data.redirectTo);
        router.refresh();
      }
    } catch {
      setIsSwitching(false);
    }
  };

  const canSwitchToBusiness =
    profile?.role === "garage_owner" || profile?.role === "dual_user" || profile?.role === "admin";
  const canSwitchToUser =
    profile?.role === "garage_owner" || profile?.role === "dual_user" || profile?.role === "admin";

  const getLevelBadgeColor = (level?: string) => {
    switch (level) {
      case "diamond":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      case "gold":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      default:
        return "bg-orange-500/10 text-orange-400 border-orange-500/30";
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-sm font-bold text-neutral-950 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight">Parking Lagbe</span>
                {currentDashboard === "admin" && (
                  <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-400 border border-red-500/30">
                    Admin
                  </span>
                )}
                {currentDashboard === "business" && (
                  <span className="rounded-full bg-teal-500/10 px-2 py-0.5 text-[10px] font-semibold text-teal-400 border border-teal-500/30">
                    Host / Owner
                  </span>
                )}
                {currentDashboard === "user" && (
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/30">
                    Driver App
                  </span>
                )}
              </div>
            </div>
          </Link>
        </div>

        {/* User Info & Controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {profile ? (
            <>
              {/* Points & Level (User or Dual) */}
              <div className="hidden items-center gap-2 sm:flex">
                <div
                  className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${getLevelBadgeColor(
                    profile.user_level
                  )}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {profile.user_level}
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-xs font-medium text-neutral-300">
                  <span className="text-amber-400">★</span>
                  <span>{profile.points.toLocaleString()} pts</span>
                </div>
              </div>

              {/* Dashboard Switcher */}
              {currentDashboard === "user" && canSwitchToBusiness && (
                <button
                  onClick={() => handleSwitchDashboard("business")}
                  disabled={isSwitching}
                  className="hidden rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 py-1.5 text-xs font-medium text-teal-300 transition hover:bg-teal-500/20 sm:inline-block"
                >
                  {isSwitching ? "Switching..." : "Switch to Host View ⚡"}
                </button>
              )}

              {currentDashboard === "business" && canSwitchToUser && (
                <button
                  onClick={() => handleSwitchDashboard("user")}
                  disabled={isSwitching}
                  className="hidden rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/20 sm:inline-block"
                >
                  {isSwitching ? "Switching..." : "Switch to Driver App 🚗"}
                </button>
              )}

              {/* Profile Greeting */}
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-xs font-bold text-neutral-300 border border-neutral-700">
                  {profile.first_name?.[0]?.toUpperCase() || profile.username?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="hidden text-left md:block">
                  <div className="text-xs font-medium text-white">
                    {profile.first_name} {profile.last_name}
                  </div>
                  <div className="text-[10px] text-neutral-400">@{profile.username}</div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
              >
                {isLoggingOut ? "..." : "Log out"}
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg border border-neutral-800 bg-neutral-900 px-3.5 py-1.5 text-xs font-medium text-neutral-300 hover:bg-neutral-800"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-medium text-neutral-950 hover:bg-emerald-400"
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
