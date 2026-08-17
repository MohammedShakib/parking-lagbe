import Link from "next/link";

export function HostCTASection() {
  return (
    <section className="py-10">
      <div className="relative overflow-hidden rounded-2xl bg-[#0b1f33] p-8 sm:p-12 lg:p-16 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#149fe8] inline-block"></span>
              <span className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider">
                For Property Owners
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight leading-[1.15] mb-5">
              Have Unused Parking Space? <br />
              <span className="text-[#149fe8]">Turn It Into Monthly Income.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#94a3b8] max-w-[500px] leading-relaxed mb-8">
              Monetize empty residential spots or commercial parking basements. Connect with thousands of verified drivers across Dhaka looking for daily and monthly parking.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/business"
                className="rounded-lg bg-[#149fe8] hover:bg-[#0e8ed2] text-white px-7 py-3 text-sm font-semibold transition-colors"
              >
                List Your Parking Space
              </Link>

              <Link
                href="/business"
                className="rounded-lg border border-[#e5eaf0]/20 bg-transparent hover:bg-white/5 text-white px-7 py-3 text-sm font-semibold transition-colors"
              >
                Host Operations Guide
              </Link>
            </div>
          </div>

          <div className="lg:pl-12">
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider mb-6">Space Host Perks</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#73d328" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <div>
                  <div className="text-sm font-semibold text-white mb-1">Automated Weekly Payouts</div>
                  <div className="text-xs text-[#94a3b8] leading-relaxed">Direct settlement to bank or bKash</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#73d328" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <div>
                  <div className="text-sm font-semibold text-white mb-1">Full Occupancy Control</div>
                  <div className="text-xs text-[#94a3b8] leading-relaxed">Set custom schedules, hourly & monthly rates</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#73d328" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <div>
                  <div className="text-sm font-semibold text-white mb-1">QR Code Gate Entry</div>
                  <div className="text-xs text-[#94a3b8] leading-relaxed">Instant check-in scanner on any mobile phone</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

