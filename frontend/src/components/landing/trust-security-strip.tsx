export function TrustSecurityStrip() {
  const features = [
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-[#149fe8]">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      ),
      title: "Verified Partners",
      desc: "Every host is verified with trade licenses & physical premises checks.",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-[#149fe8]">
          <path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
        </svg>
      ),
      title: "24/7 Monitored",
      desc: "Continuous camera coverage and dedicated security personnel on site.",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-[#149fe8]">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
        </svg>
      ),
      title: "Instant Receipts",
      desc: "Automated billing, instant SMS invoices, and itemized booking receipts.",
    },
    {
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-[#149fe8]">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
      ),
      title: "Smart Checkout",
      desc: "Support for bKash, Nagad, Mobile Banking, and Visa/Mastercard.",
    },
  ];

  const paymentMethods = ["bKash", "Nagad", "Visa", "Mastercard"];

  return (
    <section className="py-8 border-y border-[#e5eaf0] bg-white">
      <div className="container mx-auto max-w-7xl">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pb-6 border-b border-[#e5eaf0] mb-6">
          <div className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0b1f33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <div>
              <h3 className="text-lg font-bold text-[#0b1f33]">Parking With Complete Confidence</h3>
              <p className="text-xs text-[#64748b] mt-0.5">
                Enterprise security standards for vehicle protection and payment integrity
              </p>
            </div>
          </div>

          {/* Payment Methods - Neutral */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-[#94a3b8] mr-1">Accepted:</span>
            {paymentMethods.map((pm) => (
              <span
                key={pm}
                className="px-2.5 py-1 rounded border border-[#e5eaf0] bg-[#f7f9fb] text-[11px] font-medium text-[#64748b]"
              >
                {pm}
              </span>
            ))}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-0.5">
                {feat.icon}
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-[#0b1f33] mb-0.5">{feat.title}</h4>
                <p className="text-[11px] text-[#64748b] leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

