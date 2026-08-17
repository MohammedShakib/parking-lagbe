import { AuthHeader } from "@/components/auth-header";
import { getCurrentProfile } from "@/lib/auth/auth";

const adminModules = [
  {
    title: "Document & Owner Verification",
    desc: "Review uploaded NID, Trade licenses, and verify parking hosts.",
    status: "Phase 6",
    icon: "🛡️",
  },
  {
    title: "User & Garage Management",
    desc: "Inspect active users, garage statuses, overrides, and account health.",
    status: "Phase 6",
    icon: "👥",
  },
  {
    title: "Payment Ledger & Transactions",
    desc: "Audit bKash/Nagad payments, refund requests, and settlement orders.",
    status: "Phase 6",
    icon: "💳",
  },
  {
    title: "Commission & Payout Rates",
    desc: "Configure platform commission rates for individual or dual owners.",
    status: "Phase 6",
    icon: "📊",
  },
  {
    title: "Live Activity & Logs",
    desc: "Monitor live garage status changes, login history, and security audits.",
    status: "Phase 6",
    icon: "📜",
  },
  {
    title: "Analytics & Platform Insights",
    desc: "Real-time revenue charts, booking heatmaps, and capacity utilization.",
    status: "Phase 6",
    icon: "📈",
  },
];

export default async function AdminPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <AuthHeader profile={profile} currentDashboard="admin" />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-900 to-red-950/30 p-6 sm:p-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400">
              <span>●</span> Platform Administration Console
            </div>
            <h1 className="mt-4 text-2xl font-bold text-white tracking-tight sm:text-3xl">
              System Control & Operations
            </h1>
            <p className="mt-2 text-sm text-neutral-400">
              Logged in with administrative authority. Manage platform users, verification queues, commission rates, and real-time operations.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 px-4 py-2.5">
              <div className="text-[11px] uppercase tracking-wider text-neutral-400">Role Status</div>
              <div className="text-sm font-bold text-red-400">Super Administrator</div>
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 px-4 py-2.5">
              <div className="text-[11px] uppercase tracking-wider text-neutral-400">Security Model</div>
              <div className="text-sm font-bold text-emerald-400">PostgreSQL RLS Active</div>
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 px-4 py-2.5">
              <div className="text-[11px] uppercase tracking-wider text-neutral-400">Auth Engine</div>
              <div className="text-sm font-bold text-white">Supabase Auth @ssr</div>
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Administrative Workflows</h2>
            <span className="text-xs text-neutral-400">Phase 6 Migration Target</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {adminModules.map((item) => (
              <div
                key={item.title}
                className="group relative rounded-xl border border-neutral-800/80 bg-neutral-900/50 p-5 transition hover:border-red-500/40 hover:bg-neutral-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-2xl">{item.icon}</div>
                  <span className="rounded-full border border-neutral-800 bg-neutral-950 px-2.5 py-0.5 text-[11px] font-medium text-neutral-400">
                    {item.status}
                  </span>
                </div>
                <h3 className="mt-3 text-sm font-semibold text-white group-hover:text-red-400 transition">
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
