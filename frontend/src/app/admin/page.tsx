import { AuthHeader } from "@/components/auth-header";
import { AdminClient } from "@/components/admin/admin-client";
import { getCurrentProfile } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <AuthHeader profile={profile} currentDashboard="admin" />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <AdminClient profile={profile} />
      </main>
    </div>
  );
}
