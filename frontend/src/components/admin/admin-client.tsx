"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  Car, 
  ShieldCheck, 
  CreditCard,
  Search,
  Bell,
  Menu,
  ChevronRight,
  LogOut
} from "lucide-react";

import { ProfileWithAccount } from "@/lib/supabase/database.types";

import { AdminAnalytics } from "./admin-analytics";
import { AdminGarages } from "./admin-garages";
import { AdminOwners } from "./admin-owners";
import { AdminPayments } from "./admin-payments";
import { AdminUsers } from "./admin-users";
import { useRouter } from "next/navigation";

interface AdminClientProps {
  profile: ProfileWithAccount | null;
}

type AdminTab = "analytics" | "users" | "garages" | "owners" | "payments";

export function AdminClient({ profile }: AdminClientProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("analytics");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case "analytics": return "Dashboard";
      case "users": return "User Management";
      case "garages": return "Parking Locations & Verification";
      case "owners": return "Host Verification";
      case "payments": return "Financial Ledger";
      default: return "Admin Console";
    }
  };

  const navigation = [
    { name: "Dashboard", id: "analytics", icon: LayoutDashboard, section: "Overview" },
    { name: "Users", id: "users", icon: Users, section: "User Management" },
    { name: "Host Verification", id: "owners", icon: ShieldCheck, section: "User Management" },
    { name: "Parking Locations", id: "garages", icon: Car, section: "Parking Operations" },
    { name: "Transactions", id: "payments", icon: CreditCard, section: "Finance" },
  ] as const;

  return (
    <div className="flex h-screen overflow-hidden bg-[#F7F9FC]">
      {/* Sidebar */}
      <aside 
        className={`${sidebarOpen ? "w-64" : "w-20"} transition-all duration-300 ease-in-out hidden md:flex flex-col bg-white border-r border-[#E5EAF0] z-20 shrink-0`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#E5EAF0]">
          {sidebarOpen ? (
            <div className="flex flex-col">
              <Link href="/">
                <Image
                  src="/brand/parking-lagbe-full-logo-transparent.png"
                  alt="Parking Lagbe"
                  width={140}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
              </Link>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Admin Console</span>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <span className="font-bold text-xl text-[#0B1F33]">PL</span>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4 no-scrollbar">
          <div className="px-3 space-y-6">
            {/* Group by section */}
            {["Overview", "User Management", "Parking Operations", "Finance"].map((section) => (
              <div key={section}>
                {sidebarOpen && (
                  <h3 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    {section}
                  </h3>
                )}
                <div className="space-y-1">
                  {navigation.filter(item => item.section === section).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as AdminTab)}
                      className={`w-full flex items-center ${sidebarOpen ? "px-3" : "justify-center"} py-2.5 rounded-lg transition-colors duration-150 ${
                        activeTab === item.id
                          ? "bg-blue-50 text-[#149fe8] font-semibold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium"
                      }`}
                      title={!sidebarOpen ? item.name : undefined}
                    >
                      <item.icon className={`shrink-0 ${sidebarOpen ? "mr-3" : ""} ${activeTab === item.id ? "w-5 h-5" : "w-5 h-5"}`} strokeWidth={activeTab === item.id ? 2 : 1.75} />
                      {sidebarOpen && <span className="text-sm">{item.name}</span>}
                      {sidebarOpen && activeTab === item.id && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#149fe8]"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-[#E5EAF0]">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition"
          >
            <ChevronRight className={`w-5 h-5 transition-transform ${sidebarOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-[#E5EAF0] flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-slate-500 hover:text-slate-700">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center text-sm font-medium text-slate-500">
              <span className="hover:text-slate-700 cursor-pointer">Dashboard</span>
              <span className="mx-2">/</span>
              <span className="text-[#0F172A]">{getPageTitle()}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Optional Admin Search */}
            <div className="hidden lg:flex relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-9 pr-4 py-1.5 rounded-lg border border-[#E5EAF0] text-sm focus:outline-none focus:border-[#149fe8] focus:ring-1 focus:ring-[#149fe8] w-64 bg-slate-50"
              />
            </div>

            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-8 w-px bg-[#E5EAF0] mx-1"></div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-[#0F172A] leading-none mb-1">
                  {profile?.first_name} {profile?.last_name}
                </div>
                <div className="text-[11px] font-semibold text-[#149fe8] uppercase tracking-wide leading-none">
                  Super Admin
                </div>
              </div>
              <div className="h-9 w-9 rounded-full bg-[#0B1F33] flex items-center justify-center text-white font-bold text-sm">
                {(profile?.first_name?.[0] || 'A').toUpperCase()}
              </div>
              <button 
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition ml-1"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Workspace (Scrollable) */}
        <main className="flex-1 overflow-y-auto bg-[#F7F9FC] p-4 sm:p-6 lg:p-8 no-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeTab === "analytics" && <AdminAnalytics />}
            {activeTab === "users" && <AdminUsers />}
            {activeTab === "garages" && <AdminGarages />}
            {activeTab === "owners" && <AdminOwners />}
            {activeTab === "payments" && <AdminPayments />}
          </div>
          
          {/* Minimal Footer */}
          <footer className="mt-12 py-4 border-t border-[#E5EAF0] text-center">
            <p className="text-[11px] text-slate-400 font-medium">© 2026 Parking Lagbe · Admin Console</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
