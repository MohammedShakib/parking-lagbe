import { AuthHeader } from "@/components/auth-header";
import { AdminClient } from "@/components/admin/admin-client";
import { getCurrentProfile } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="relative min-h-screen text-white">
      {/* Background Image with Dark Overlay matching admin.php */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-[-2]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      />
      <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[-1]" />

      <AuthHeader profile={profile} currentDashboard="admin" />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <AdminClient profile={profile} />
      </main>
    </div>
  );
}
