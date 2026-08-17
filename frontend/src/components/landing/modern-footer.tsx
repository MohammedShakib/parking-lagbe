import Image from "next/image";
import Link from "next/link";

export function ModernFooter() {
  const navLinks = [
    {
      heading: "Parking",
      links: [
        { label: "Find & Reserve Spots", href: "/dashboard" },
        { label: "My Active Bookings", href: "/dashboard" },
        { label: "VIP Loyalty Rewards", href: "/dashboard" },
        { label: "Vehicle Management", href: "/dashboard" },
      ],
    },
    {
      heading: "Partners",
      links: [
        { label: "List Your Space", href: "/business" },
        { label: "Space Host Dashboard", href: "/business" },
        { label: "Host Earnings Guide", href: "/business" },
        { label: "Register as Host", href: "/register" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About Parking Lagbe", href: "/" },
        { label: "Contact Support", href: "/" },
        { label: "Privacy Policy", href: "/" },
        { label: "Terms of Service", href: "/" },
      ],
    },
  ];

  return (
    <footer className="mt-auto bg-[#0b1f33] text-slate-400 text-xs">
      {/* Main footer content */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block">
              <Image
                src="/brand/parking-lagbe-full-logo-transparent.png"
                alt="Parking Lagbe Logo"
                width={1095}
                height={549}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Bangladesh&apos;s pioneering real-time smart mobility & parking network. Discover, reserve, and park seamlessly across commercial basements and residential garages in Dhaka.
            </p>

            {/* Live Status Badge */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Live City Operations:
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#73d328]">
                <span className="h-2 w-2 rounded-full bg-[#73d328] animate-pulse"></span>
                Dhaka Metropolitan
              </span>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1">
              <a href="#" aria-label="Facebook" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-[#149fe8] transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" aria-label="Twitter (X)" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-[#0f172a] transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-[#0b1f33] transition-all">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>

          {/* Nav Columns */}
          {navLinks.map((col) => (
            <div key={col.heading} className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-white">
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-slate-400 hover:text-[#149fe8] transition-colors leading-none"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p className="text-[12px]">© 2026 পার্কিং লাগবে (Parking Lagbe). All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-slate-600">Dhaka Smart Mobility</span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-600">Zero Congestion Initiative</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

