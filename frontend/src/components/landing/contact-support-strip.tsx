export function ContactSupportStrip() {
  const contacts = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#149fe8]">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      ),
      label: "Corporate Office",
      value: "651 Ibrahimpur, Mirpur 14, Dhaka 1206",
      sub: "Open Mon–Sat, 9am–6pm",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#149fe8]">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        </svg>
      ),
      label: "24/7 Driver Helpline",
      value: "+880 1700-000000",
      sub: "+880 1800-000000",
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#149fe8]">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
        </svg>
      ),
      label: "Customer Support",
      value: "support@parkinglagbe.com",
      sub: "Response within 2 hours",
    },
  ];

  return (
    <section className="py-12 border-y border-[#e5eaf0] bg-[#f7f9fb]">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1f33] tracking-tight mb-3">
            Get in Touch with Parking Lagbe
          </h2>
          <p className="text-sm text-[#64748b]">
            Our team is available around the clock to assist with bookings, disputes, and host operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contacts.map((c, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-6 bg-white border border-[#e5eaf0] rounded-xl hover:border-[#149fe8]/40 transition-colors"
            >
              <div className="mb-4">
                {c.icon}
              </div>
              <h4 className="text-[11px] font-semibold text-[#64748b] uppercase tracking-wider mb-2">{c.label}</h4>
              <p className="text-[15px] font-semibold text-[#0b1f33] mb-1">{c.value}</p>
              <p className="text-[11px] text-[#94a3b8]">{c.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

