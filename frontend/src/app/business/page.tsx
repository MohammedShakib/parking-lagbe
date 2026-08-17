import { AuthHeader } from "@/components/auth-header";
import { BusinessClient } from "@/components/business/business-client";
import { getCurrentProfile } from "@/lib/auth/auth";

export default async function BusinessPage() {
  const profile = await getCurrentProfile();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <AuthHeader profile={profile} currentDashboard="business" />

      <main className="container mx-auto px-4 py-8 flex-1">
        <BusinessClient profile={profile} />
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 mt-auto">
        <p>© 2026 পার্কিং লাগবে (Parking Lagbe). Space Host Business Operations.</p>
      </footer>
    </div>
  );
}
