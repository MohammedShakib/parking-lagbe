"use client";

import { useState } from "react";
import { Search, Ticket, Car, Award, User } from "lucide-react";

import { ProfileWithAccount } from "@/lib/supabase/database.types";

import { BookingsList } from "./bookings-list";
import { GarageSearch } from "./garage-search";
import { PointsLedger } from "./points-ledger";
import { ProfileEditor } from "./profile-editor";
import { VehiclesManager } from "./vehicles-manager";

interface DashboardClientProps {
  profile: ProfileWithAccount | null;
}

type TabType = "search" | "bookings" | "vehicles" | "points" | "profile";

export function DashboardClient({ profile }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("search");

  return (
    <div className="space-y-6">
      {/* Navigation Tab Bar */}
      <div className="flex overflow-x-auto border-b border-[#e5eaf0] bg-white no-scrollbar">
        <div className="flex w-full min-w-max">
          <button
            onClick={() => setActiveTab("search")}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition whitespace-nowrap border-b-2 ${
              activeTab === "search"
                ? "border-[#149fe8] text-[#149fe8]"
                : "border-transparent text-slate-600 hover:text-[#0b1f33]"
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Find Parking</span>
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition whitespace-nowrap border-b-2 ${
              activeTab === "bookings"
                ? "border-[#149fe8] text-[#149fe8]"
                : "border-transparent text-slate-600 hover:text-[#0b1f33]"
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>My Bookings & Invoices</span>
          </button>

          <button
            onClick={() => setActiveTab("vehicles")}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition whitespace-nowrap border-b-2 ${
              activeTab === "vehicles"
                ? "border-[#149fe8] text-[#149fe8]"
                : "border-transparent text-slate-600 hover:text-[#0b1f33]"
            }`}
          >
            <Car className="w-4 h-4" />
            <span>My Vehicles</span>
          </button>

          <button
            onClick={() => setActiveTab("points")}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition whitespace-nowrap border-b-2 ${
              activeTab === "points"
                ? "border-[#149fe8] text-[#149fe8]"
                : "border-transparent text-slate-600 hover:text-[#0b1f33]"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>VIP Loyalty & Points</span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition whitespace-nowrap border-b-2 ${
              activeTab === "profile"
                ? "border-[#149fe8] text-[#149fe8]"
                : "border-transparent text-slate-600 hover:text-[#0b1f33]"
            }`}
          >
            <User className="w-4 h-4" />
            <span>My Profile</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div className="transition-all">
        {activeTab === "search" && <GarageSearch />}
        {activeTab === "bookings" && <BookingsList />}
        {activeTab === "vehicles" && <VehiclesManager />}
        {activeTab === "points" && <PointsLedger />}
        {activeTab === "profile" && <ProfileEditor initialProfile={profile} />}
      </div>
    </div>
  );
}
