import Image from "next/image";
import Link from "next/link";

const stats = [
  { label: "Legacy PHP pages", value: "29", tone: "bg-amber-100 text-amber-800" },
  { label: "Mapped tables", value: "21", tone: "bg-emerald-100 text-emerald-800" },
  { label: "Target database", value: "Supabase", tone: "bg-sky-100 text-sky-800" },
];

const workstreams = [
  {
    title: "User app",
    href: "/dashboard",
    status: "Shell ready",
    body: "Search, vehicles, bookings, payments, points, ratings.",
  },
  {
    title: "Business dashboard",
    href: "/business",
    status: "Shell ready",
    body: "Garages, operating schedule, booking control, owner income.",
  },
  {
    title: "Admin console",
    href: "/admin",
    status: "Shell ready",
    body: "Verification, users, garages, payments, commissions, analytics.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f6f7f9] text-neutral-950">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded bg-neutral-950 text-lg font-bold text-white">
              P
            </span>
            <span>
              <span className="block text-base font-semibold">Parking Lagbe</span>
              <span className="block text-xs text-neutral-500">Migration workspace</span>
            </span>
          </Link>
          <nav className="flex items-center gap-2 text-sm">
            <Link className="rounded border border-neutral-200 px-3 py-2 hover:bg-neutral-50" href="/login">
              Login
            </Link>
            <Link className="rounded border border-neutral-200 px-3 py-2 hover:bg-neutral-50" href="/register">
              Register
            </Link>
            <Link className="rounded bg-neutral-950 px-3 py-2 text-white hover:bg-neutral-800" href="/dashboard">
              Open app
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="flex min-h-[420px] flex-col justify-between rounded border border-neutral-200 bg-white p-6">
          <div>
            <div className="mb-6 flex flex-wrap gap-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded border border-neutral-200 bg-white px-4 py-3">
                  <div className="text-xs uppercase tracking-normal text-neutral-500">{item.label}</div>
                  <div className={`mt-2 inline-flex rounded px-2 py-1 text-sm font-semibold ${item.tone}`}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
            <h1 className="max-w-3xl text-3xl font-semibold leading-tight text-neutral-950 sm:text-4xl">
              Supabase-backed Next.js rebuild for the existing parking workflows.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600">
              The first app shell is in place so each PHP workflow can now move into typed pages,
              server-side data access, and explicit API/service boundaries.
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {workstreams.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded border border-neutral-200 bg-neutral-50 p-4 transition hover:border-neutral-400 hover:bg-white"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-sm font-semibold text-neutral-950">{item.title}</h2>
                  <span className="rounded bg-white px-2 py-1 text-xs text-neutral-600">{item.status}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-neutral-600">{item.body}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded border border-neutral-200 bg-white">
          <div className="relative aspect-[4/3]">
            <Image
              src="/cars/car01.png"
              alt="Parking Lagbe vehicle"
              fill
              className="object-cover"
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
          <div className="grid grid-cols-2 border-t border-neutral-200">
            <div className="border-r border-neutral-200 p-4">
              <div className="text-xs uppercase tracking-normal text-neutral-500">Runtime</div>
              <div className="mt-1 text-sm font-semibold">Next.js App Router</div>
            </div>
            <div className="p-4">
              <div className="text-xs uppercase tracking-normal text-neutral-500">Data layer</div>
              <div className="mt-1 text-sm font-semibold">Supabase Postgres</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
