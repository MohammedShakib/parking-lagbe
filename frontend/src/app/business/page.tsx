import { AuthHeader } from "@/components/auth-header";
import { BusinessClient } from "@/components/business/business-client";
import { getCurrentProfile } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";

export default async function BusinessPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <AuthHeader profile={profile} currentDashboard="business" />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <BusinessClient profile={profile} />
      </main>
    </div>
  );
}
