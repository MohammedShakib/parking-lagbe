export function HowItWorks() {
  const steps = [
    {
      num: "1",
      title: "Search Location",
      desc: "Input your destination or explore live spots on the interactive radar map.",
    },
    {
      num: "2",
      title: "Compare & Select",
      desc: "Compare verified hourly rates, indoor/covered facilities, and real-time slot counts.",
    },
    {
      num: "3",
      title: "Instant Reserve",
      desc: "Lock in your guaranteed parking spot and pay securely via digital checkout.",
    },
    {
      num: "4",
      title: "Check In & Park",
      desc: "Drive to the gate, show your digital QR confirmation to the host, and park safely.",
    },
  ];

  return (
    <section className="py-2">
      <div className="rounded-2xl bg-[#f7f9fb] border border-[#e5eaf0] p-8 sm:p-12">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1f33] tracking-tight mb-3">
            How Parking Lagbe Works
          </h2>
          <p className="text-sm text-[#64748b]">
            From search to parking spot in under 60 seconds — completely contactless.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center group">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white border border-[#149fe8]/30 text-[#149fe8] font-bold text-lg mb-4 shadow-sm group-hover:bg-[#149fe8] group-hover:text-white transition-colors">
                {step.num}
              </div>
              <h3 className="text-[15px] font-semibold text-[#0b1f33] mb-2">{step.title}</h3>
              <p className="text-xs text-[#64748b] leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

