"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Building2, Award } from "lucide-react";

import { ProfileWithAccount } from "@/lib/supabase/database.types";

interface AuthHeaderProps {
  profile: ProfileWithAccount | null;
  currentDashboard?: "user" | "business" | "admin";
}

export function AuthHeader({ profile, currentDashboard = "user" }: AuthHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const userLevelLabel =
    profile?.user_level === "diamond"
      ? "Diamond"
      : profile?.user_level === "gold"
      ? "Gold"
      : "Silver";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-[#e7ecf1] shadow-sm py-3"
          : "bg-white border-b border-[#e7ecf1]/70 py-4"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 max-w-7xl">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group focus:outline-none">
          <Image
            src="/brand/parking-lagbe-full-logo-transparent.png"
            alt="Parking Lagbe Logo"
            width={1095}
            height={549}
            className="h-10 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            priority
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className={`text-sm font-semibold transition-colors duration-150 ${
              pathname === "/"
                ? "text-[#149fe8] font-bold"
                : "text-slate-600 hover:text-[#0b1f33]"
            }`}
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className={`text-sm font-semibold transition-colors duration-150 ${
              pathname.startsWith("/dashboard")
                ? "text-[#149fe8] font-bold"
                : "text-slate-600 hover:text-[#0b1f33]"
            }`}
          >
            Find Parking
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-slate-600 hover:text-[#0b1f33] transition-colors duration-150"
          >
            My Bookings
          </Link>
          <Link
            href="/business"
            className={`text-sm font-semibold transition-colors duration-150 ${
              pathname.startsWith("/business")
                ? "text-[#149fe8] font-bold"
                : "text-slate-600 hover:text-[#0b1f33]"
            }`}
          >
            Space Host
          </Link>
        </nav>

        {/* Right Action Area */}
        <div className="flex items-center gap-3">
          {profile ? (
            <>
              {currentDashboard === "business" ? (
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-[#e5eaf0] bg-white px-3.5 py-1.5 text-xs font-bold text-[#0b1f33] transition hover:bg-[#f7f9fb]"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Switch To Driver
                </Link>
              ) : (
                <Link
                  href="/business"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-[#e5eaf0] bg-white px-3.5 py-1.5 text-xs font-bold text-[#0b1f33] transition hover:bg-[#f7f9fb]"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  Switch To Host
                </Link>
              )}

              {/* Points */}
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center gap-1.5 rounded-md border border-[#e5eaf0] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#64748b] transition hover:text-[#0b1f33] hover:bg-[#f7f9fb]"
              >
                <Award className="w-3.5 h-3.5" />
                <span>{profile.points.toLocaleString()} points</span>
              </Link>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#149fe8] bg-[#149fe8]/10 transition hover:scale-105 cursor-pointer focus:outline-none"
                  aria-label="User profile menu"
                >
                  <span className="text-sm font-bold text-[#149fe8]">{firstLetter}</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-[#e5eaf0] bg-white p-0 shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
                    <div className="flex items-center gap-3 border-b border-[#e5eaf0] bg-[#f7f9fb] p-4">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#0b1f33]">
                        <span className="text-sm font-bold text-white">{firstLetter}</span>
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-[#0f172a]">
                          {profile.first_name} {profile.last_name}
                        </div>
                        <div className="truncate text-xs text-slate-500 mt-0.5">@{profile.username} · {userLevelLabel}</div>
                      </div>
                    </div>

                    <div className="space-y-0.5 p-2 text-sm text-[#0f172a]">
                      <Link
                        href="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 rounded-md px-3 py-2 transition hover:bg-[#f7f9fb]"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        <span>My Bookings</span>
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 rounded-md px-3 py-2 transition hover:bg-[#f7f9fb]"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-4"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                        <span>My Vehicles</span>
                      </Link>
                      <Link
                        href="/dashboard"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 rounded-md px-3 py-2 transition hover:bg-[#f7f9fb]"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                        <span>Payments & Invoices</span>
                      </Link>
                      <Link
                        href="/business"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2.5 rounded-md px-3 py-2 transition hover:bg-[#f7f9fb]"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        <span>Host Dashboard</span>
                      </Link>
                      {profile.role === "admin" && (
                        <Link
                          href="/admin"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-2.5 rounded-md px-3 py-2 transition hover:bg-[#f7f9fb]"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                          <span>Admin Console</span>
                        </Link>
                      )}

                      <div className="my-1 border-t border-[#e5eaf0]" />

                      <button
                        disabled={isLoggingOut}
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left text-red-600 transition hover:bg-red-50 cursor-pointer text-sm"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        <span>{isLoggingOut ? "Logging out..." : "Sign Out"}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-[#149fe8] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-[#0b1f33] px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold text-white hover:bg-[#162d47] transition-colors"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-[#e7ecf1] bg-[#f6f9fc] text-slate-700 hover:bg-slate-200 transition focus:outline-none cursor-pointer"
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#e7ecf1] bg-white px-4 py-5 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-3 text-sm font-semibold text-slate-800">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-[#f6f9fc] hover:text-[#149fe8] transition-colors"
            >
              Home
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-[#f6f9fc] hover:text-[#149fe8] transition-colors"
            >
              Find Parking
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-[#f6f9fc] hover:text-[#149fe8] transition-colors"
            >
              My Bookings
            </Link>
            <Link
              href="/business"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-xl hover:bg-[#f6f9fc] hover:text-[#149fe8] transition-colors"
            >
              List Parking Space (Space Host)
            </Link>

            <div className="border-t border-[#e7ecf1] pt-3 flex flex-col gap-2">
              {!profile ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl border border-[#e7ecf1] text-xs font-bold text-slate-700"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-[#149fe8] to-[#73d328] text-xs font-bold text-white shadow-md shadow-[#149fe8]/20"
                  >
                    Create Free Account
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center py-2.5 rounded-xl bg-red-50 text-xs font-bold text-red-600"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
