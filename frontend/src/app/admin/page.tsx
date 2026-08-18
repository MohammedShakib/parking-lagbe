import { AdminClient } from "@/components/admin/admin-client";
import { getCurrentProfile } from "@/lib/auth/auth";

export default async function AdminPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-slate-900">
      <AdminClient profile={profile} />
    </div>
  );
}
