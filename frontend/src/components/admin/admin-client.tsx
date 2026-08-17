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
    { id: "users", label: "User Verification", icon: "👥" },
    { id: "garages", label: "Garage Approvals", icon: "🏢" },
    { id: "owners", label: "Hosts & Commissions", icon: "💼" },
    { id: "payments", label: "Payments Audit", icon: "💳" },
  ];

  return (
    <div className="space-y-6">
      {/* Admin Banner matching admin.php */}
      <div className="relative overflow-hidden rounded-2xl bg-black/50 backdrop-blur-md border border-white/20 p-6 sm:p-8 shadow-2xl">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f39c12]/40 bg-[#f39c12]/20 px-3.5 py-1 text-xs font-bold text-[#f39c12]">
            <span>●</span> Super Administrator Governance
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white tracking-tight sm:text-3xl drop-shadow-md">
            Platform Governance Hub
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-white/80 leading-relaxed">
            Logged in as <span className="text-white font-bold">@{profile?.username}</span> (Super Admin). Oversee security compliance, verify parking garages, audit payments, and adjust revenue commission parameters.
          </p>
        </div>

        {/* Global Stats */}
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="rounded-xl bg-black/40 border border-white/15 px-4 py-2.5">
            <div className="text-[10px] uppercase text-white/60">Security Clearance</div>
            <div className="text-xs font-bold text-emerald-400">Level 3 (Platform Admin)</div>
          </div>
          <div className="rounded-xl bg-black/40 border border-white/15 px-4 py-2.5">
            <div className="text-[10px] uppercase text-white/60">Standard Commission</div>
            <div className="text-xs font-bold text-[#f39c12]">30.00% Platform Fee</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-white/20 pb-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as typeof activeTab)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs font-bold transition ${
              activeTab === item.id
                ? "bg-[#f39c12] text-white shadow-lg shadow-[#f39c12]/30"
                : "border border-white/15 bg-black/40 text-white/80 hover:border-white/30 hover:text-white"
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
