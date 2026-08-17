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

type AdminTab = "analytics" | "users" | "garages" | "owners" | "payments";

export function AdminClient({ profile }: AdminClientProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("analytics");

  return (
    <div className="space-y-6">
      {/* Header Banner in White Theme */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-xs font-bold text-purple-900 mb-2">
            <span>🛡️</span>
            <span>Super Administrator Governance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Platform Executive Control Hub
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Logged in as Super Admin (@{profile?.username}). Manage platform finances, host verifications, safety compliance, and audit trails.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400">Platform Profit Share</span>
            <div className="text-lg font-black text-[#d97706]">30.0% Commission</div>
          </div>
        </div>
      </div>

      {/* Tabs in White Theme */}
      <div className="flex overflow-x-auto gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm no-scrollbar">
        <button
          onClick={() => setActiveTab("analytics")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "analytics"
              ? "bg-[#f39c12] text-white shadow-md shadow-[#f39c12]/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <span>📊</span>
          <span>Platform Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "users"
              ? "bg-[#f39c12] text-white shadow-md shadow-[#f39c12]/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <span>👥</span>
          <span>Registered Users</span>
        </button>

        <button
          onClick={() => setActiveTab("garages")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "garages"
              ? "bg-[#f39c12] text-white shadow-md shadow-[#f39c12]/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <span>🏢</span>
          <span>Garages & Compliance</span>
        </button>

        <button
          onClick={() => setActiveTab("owners")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "owners"
              ? "bg-[#f39c12] text-white shadow-md shadow-[#f39c12]/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <span>🤝</span>
          <span>Host Verifications & Rates</span>
        </button>

        <button
          onClick={() => setActiveTab("payments")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === "payments"
              ? "bg-[#f39c12] text-white shadow-md shadow-[#f39c12]/20"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <span>💳</span>
          <span>Complete Financial Ledger</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "analytics" && <AdminAnalytics />}
        {activeTab === "users" && <AdminUsers />}
        {activeTab === "garages" && <AdminGarages />}
        {activeTab === "owners" && <AdminOwners />}
        {activeTab === "payments" && <AdminPayments />}
      </div>
    </div>
  );
}
