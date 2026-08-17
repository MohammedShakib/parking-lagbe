import { AdminClient } from "@/components/admin/admin-client";
import { AuthHeader } from "@/components/auth-header";
import { getCurrentProfile } from "@/lib/auth/auth";

export default async function AdminPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <AuthHeader profile={profile} currentDashboard="admin" />

      <main className="container mx-auto px-4 py-8 flex-1">
        <AdminClient profile={profile} />
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 mt-auto">
        <p>© 2026 পার্কিং লাগবে (Parking Lagbe). Platform Super Administrator Console.</p>
      </footer>
    </div>
  );
}
