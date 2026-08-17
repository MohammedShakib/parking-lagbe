import { AuthHeader } from "@/components/auth-header";
import { getCurrentProfile } from "@/lib/auth/auth";

const businessModules = [
  {
    title: "Garage Portfolio & Spaces",
    desc: "Manage slots, capacity, space dimensions, and pricing rules.",
    status: "Phase 5",
    icon: "🏢",
  },
  {
    title: "Operating Schedule & 24/7",
    desc: "Configure opening/closing hours and operating days.",
    status: "Phase 5",
    icon: "🕒",
  },
  {
    title: "Live Booking Control",
    desc: "Accept, verify check-ins, or manage current parked vehicles.",
    status: "Phase 5",
    icon: "⚡",
  },
  {
    title: "Income & Earnings Split",
    desc: "Track daily revenue, platform commission (30%), and net payout.",
    status: "Phase 5",
    icon: "💰",
  },
  {
    title: "Customer Reviews & Ratings",
    desc: "View driver ratings, feedback comments, and overall score.",
    status: "Phase 5",
    icon: "⭐",
  },
  {
    title: "Verification & Documentation",
    desc: "Upload trade license, NID, and ownership documents for approval.",
    status: "Phase 5",
    icon: "📄",
  },
];

export default async function BusinessPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <AuthHeader profile={profile} currentDashboard="business" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-900 to-teal-950/40 p-6 sm:p-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-400">
              <span>●</span> Host / Space Owner Dashboard
            </div>
            <h1 className="mt-4 text-2xl font-bold text-white tracking-tight sm:text-3xl">
              Host Management Portal
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              Logged in as <span className="text-white font-medium">@{profile?.username || "owner"}</span>. Manage your parking spaces, live availability, operating hours, and earnings.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 px-4 py-2.5">
              <div className="text-[11px] uppercase tracking-wider text-neutral-400">Owner ID</div>
              <div className="text-sm font-bold text-white">{profile?.owner_id || `G_owner_${profile?.username}`}</div>
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 px-4 py-2.5">
              <div className="text-[11px] uppercase tracking-wider text-neutral-400">Verification</div>
              <div className="text-sm font-bold text-amber-400">
                {profile?.is_verified_owner ? "Verified ✓" : "Pending Review"}
              </div>
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 px-4 py-2.5">
              <div className="text-[11px] uppercase tracking-wider text-neutral-400">Commission Rate</div>
              <div className="text-sm font-bold text-teal-400">70% Payout (30% Commission)</div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Garage Operations</h2>
            <span className="text-xs text-neutral-400">Supabase Auth Connected</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {businessModules.map((item) => (
              <div
                key={item.title}
                className="group relative rounded-xl border border-neutral-800/80 bg-neutral-900/50 p-5 transition hover:border-teal-500/50 hover:bg-neutral-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-2xl">{item.icon}</div>
                  <span className="rounded-full border border-neutral-800 bg-neutral-950 px-2.5 py-0.5 text-[11px] font-medium text-neutral-400">
                    {item.status}
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-white group-hover:text-teal-400 transition">
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
