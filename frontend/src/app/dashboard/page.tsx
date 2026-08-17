import { AuthHeader } from "@/components/auth-header";
import { getCurrentProfile } from "@/lib/auth/auth";

const userWorkflows = [
  {
    title: "Nearby Garages & Search",
    desc: "Explore available parking spots around Dhaka in real-time.",
    status: "Phase 4",
    icon: "🗺️",
  },
  {
    title: "My Vehicles",
    desc: "Manage registered cars, bikes, and license plates.",
    status: "Phase 4",
    icon: "🚗",
  },
  {
    title: "Active & Upcoming Bookings",
    desc: "Track reservations, durations, and check-in status.",
    status: "Phase 4",
    icon: "🎫",
  },
  {
    title: "Payment History & Receipts",
    desc: "View bKash/Nagad transactions, receipts, and invoices.",
    status: "Phase 4",
    icon: "💳",
  },
  {
    title: "Points & Loyalty Rewards",
    desc: "Redeem points for discounts and level progression.",
    status: "Phase 4",
    icon: "⭐",
  },
  {
    title: "Ratings & Reviews",
    desc: "Share reviews and ratings for visited parking spaces.",
    status: "Phase 4",
    icon: "💬",
  },
];

export default async function DashboardPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <AuthHeader profile={profile} currentDashboard="user" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-900 to-emerald-950/40 p-6 sm:p-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              <span>●</span> Authenticated Driver Session
            </div>
            <h1 className="mt-4 text-2xl font-bold text-white tracking-tight sm:text-3xl">
              Hello, {profile?.first_name || profile?.username || "Driver"}!
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              Welcome to Parking Lagbe. Find and reserve verified parking spaces instantly or manage your vehicles and points.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 px-4 py-2.5">
              <div className="text-[11px] uppercase tracking-wider text-neutral-400">Reward Tier</div>
              <div className="text-sm font-bold text-white capitalize">{profile?.user_level || "Bronze"} Tier</div>
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 px-4 py-2.5">
              <div className="text-[11px] uppercase tracking-wider text-neutral-400">Available Points</div>
              <div className="text-sm font-bold text-amber-400">{profile?.points?.toLocaleString() || 0} pts</div>
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 px-4 py-2.5">
              <div className="text-[11px] uppercase tracking-wider text-neutral-400">Account Status</div>
              <div className="text-sm font-bold text-emerald-400 capitalize">{profile?.status || "Active"}</div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Driver Workflows</h2>
            <span className="text-xs text-neutral-400">Supabase Auth Connected</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {userWorkflows.map((item) => (
              <div
                key={item.title}
                className="group relative rounded-xl border border-neutral-800/80 bg-neutral-900/50 p-5 transition hover:border-emerald-500/50 hover:bg-neutral-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-2xl">{item.icon}</div>
                  <span className="rounded-full border border-neutral-800 bg-neutral-950 px-2.5 py-0.5 text-[11px] font-medium text-neutral-400">
                    {item.status}
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-white group-hover:text-emerald-400 transition">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
