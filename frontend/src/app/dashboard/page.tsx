import Link from "next/link";

const items = ["Nearby garages", "My bookings", "My vehicles", "Payment history", "Points ledger"];

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#f6f7f9] px-5 py-8 text-neutral-950">
      <div className="mx-auto max-w-7xl">
        <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-950">
          Back
        </Link>
        <h1 className="mt-6 text-3xl font-semibold">User app</h1>
        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <section key={item} className="rounded border border-neutral-200 bg-white p-5">
              <h2 className="text-base font-semibold">{item}</h2>
              <div className="mt-4 h-2 rounded bg-neutral-100">
                <div className="h-2 w-1/4 rounded bg-amber-500" />
              </div>
              <p className="mt-3 text-sm text-neutral-600">Queued for workflow migration.</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
