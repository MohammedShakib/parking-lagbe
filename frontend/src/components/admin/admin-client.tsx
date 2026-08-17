"use client";

import { useState } from "react";

import { ProfileWithAccount } from "@/lib/supabase/database.types";
import { AdminAnalytics } from "./admin-analytics";
import { AdminGarages } from "./admin-garages";
import { AdminOwners } from "./admin-owners";
import { AdminPayments } from "./admin-payments";
import { AdminUsers } from "./admin-users";

interface AdminClientProps {
  profile: ProfileWithAccount | null;
}

export function AdminClient({ profile }: AdminClientProps) {
  const [activeTab, setActiveTab] = useState<"analytics" | "users" | "garages" | "owners" | "payments">("analytics");

  const navItems = [
    { id: "analytics", label: "Executive Analytics", icon: "📊" },
    { id: "users", label: "Users & Drivers", icon: "👥" },
    { id: "garages", label: "Garage Verification", icon: "🏢" },
    { id: "owners", label: "Hosts & Commissions", icon: "💼" },
    { id: "payments", label: "Payments Audit", icon: "💳" },
  ];

  return (
    <div className="space-y-6">
      {/* Admin Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-900 to-indigo-950/40 p-6 sm:p-8 shadow-2xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
            <span>●</span> Super Administrator Console
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white tracking-tight sm:text-3xl">
            Platform Governance Hub
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400">
            Logged in as <span className="text-white font-medium">@{profile?.username}</span> (Super Admin). Oversee security compliance, verify parking garages, audit payments, and adjust revenue commission parameters.
          </p>
        </div>

        {/* Global Stats */}
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 px-4 py-2.5">
            <div className="text-[10px] uppercase text-neutral-500">Security Clearance</div>
            <div className="text-xs font-bold text-emerald-400">Level 3 (Platform Admin)</div>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/70 px-4 py-2.5">
            <div className="text-[10px] uppercase text-neutral-500">Standard Commission</div>
            <div className="text-xs font-bold text-indigo-400">30.00% Platform Fee</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-neutral-800 pb-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as typeof activeTab)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition ${
              activeTab === item.id
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                : "border border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-white"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="pt-2">
        {activeTab === "analytics" && <AdminAnalytics />}
        {activeTab === "users" && <AdminUsers />}
        {activeTab === "garages" && <AdminGarages />}
        {activeTab === "owners" && <AdminOwners />}
        {activeTab === "payments" && <AdminPayments />}
      </div>
    </div>
  );
}
