export function WhyParkingLagbe() {
  const benefits = [
    {
      icon: (
        <svg className="w-6 h-6 text-[#149fe8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Live Availability",
      description:
        "Check live available spaces before you arrive with automated spot tracking and dynamic status updates pushed every 30 seconds.",
      stat: "30s",
      statLabel: "Update Interval",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#149fe8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: "100% Verified Hubs",
      description:
        "Every garage and residential lot undergoes thorough physical inspection, safety checks, license verification, and partner rating audits.",
      stat: "120+",
      statLabel: "Certified Partners",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#149fe8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: "Digital Booking",
      description:
        "Pre-book your spot in seconds and pay seamlessly using bKash, Nagad, Debit/Credit Cards, or loyalty points — no queues, no cash.",
      stat: "<60s",
      statLabel: "Avg. Booking Time",
    },
    {
      icon: (
        <svg className="w-6 h-6 text-[#149fe8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      title: "24/7 Monitored",
      description:
        "Enjoy peace of mind with 24/7 CCTV surveillance, on-site security guards, and digital QR check-in logs for every visit.",
      stat: "24/7",
      statLabel: "CCTV Coverage",
    },
  ];

  return (
    <section className="py-10">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider mb-3">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          Built for Modern Dhaka
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0b1f33] tracking-tight leading-tight">
          Why Drivers Trust <span className="text-[#149fe8]">Parking Lagbe</span>
        </h2>
        <p className="text-sm text-[#64748b] mt-3 leading-relaxed">
          Eliminating Dhaka&apos;s parking congestion with intelligent software, verified host partnerships, and real-time reliability.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {benefits.map((item, idx) => (
          <div
            key={idx}
            className="group rounded-xl border border-[#e5eaf0] bg-white p-5 transition-colors hover:border-[#149fe8]/40 flex flex-col"
          >
            <div className="mb-4">
              {item.icon}
            </div>

            <h3 className="text-[15px] font-semibold text-[#0b1f33] mb-1.5 group-hover:text-[#149fe8] transition-colors">
              {item.title}
            </h3>
            <p className="text-xs text-[#64748b] leading-relaxed mb-6 flex-1">
              {item.description}
            </p>

            {/* Bottom stat */}
            <div className="pt-3 border-t border-[#e5eaf0] flex items-center justify-between">
              <span className="text-lg font-bold text-[#0b1f33]">{item.stat}</span>
              <span className="text-[10px] font-medium text-[#94a3b8]">{item.statLabel}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

