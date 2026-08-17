import Image from "next/image";
import Link from "next/link";

import { AuthHeader } from "@/components/auth-header";
import { ContactSupportStrip } from "@/components/landing/contact-support-strip";
import { HeroSearch } from "@/components/landing/hero-search";
import { HostCTASection } from "@/components/landing/host-cta-section";
import { HowItWorks } from "@/components/landing/how-it-works";
import { LandingInteractiveView } from "@/components/landing/landing-interactive-view";
import { ModernFooter } from "@/components/landing/modern-footer";
import { TrustSecurityStrip } from "@/components/landing/trust-security-strip";
import { WhyParkingLagbe } from "@/components/landing/why-parking-lagbe";
import { getCurrentProfile } from "@/lib/auth/auth";

export default async function HomePage() {
  const profile = await getCurrentProfile();

  const metrics = [
    { value: "120+", label: "Verified Parking Locations" },
    { value: "350+", label: "Live Available Spaces" },
    { value: "24/7", label: "Real-Time Monitoring" },
    { value: "10K+", label: "Completed Bookings" },
    { value: "4.9/5", label: "Driver Satisfaction" },
  ];

  return (
    <div className="min-h-screen bg-white text-[#0f172a] flex flex-col">
      <AuthHeader profile={profile} currentDashboard="user" />

      {/* Hero — flat background, solid typography */}
      <section className="bg-[#f7f9fb] border-b border-[#e5eaf0] pt-10 pb-16 lg:pt-16 lg:pb-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">

            {/* Left: Content */}
            <div className="text-center lg:text-left">
              {/* Eyebrow — plain text, no pill badge */}
              <p className="text-sm font-medium text-[#64748b] mb-5 flex items-center justify-center lg:justify-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#73d328] inline-block"></span>
                Real-time parking across Dhaka
              </p>

              {/* Headline — solid colour accent, no gradient */}
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold tracking-tight text-[#0b1f33] leading-[1.13] mb-5">
                Find &amp; Reserve Parking<br />
                <span className="text-[#149fe8]">Without the Hassle.</span>
              </h1>

              <p className="text-base text-[#64748b] leading-relaxed mb-8 max-w-[520px] mx-auto lg:mx-0">
                Discover verified parking spaces in Dhaka, compare live hourly rates,
                reserve your spot in seconds, and check in with digital confirmation.
              </p>

              {/* CTAs — solid colours, no gradients */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8">
                <Link
                  href="/dashboard"
                  className="rounded-lg bg-[#149fe8] hover:bg-[#0e8ed2] text-white px-7 py-3 text-sm font-semibold transition-colors"
                >
                  Find Parking Near You
                </Link>
                <Link
                  href="/business"
                  className="rounded-lg border border-[#e5eaf0] bg-white hover:border-[#149fe8]/50 text-[#0b1f33] px-7 py-3 text-sm font-semibold transition-colors"
                >
                  List Your Parking Space
                </Link>
              </div>

              {/* Trust row — SVG checks, no emoji */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-[#64748b]">
                {["100% Verified Spaces", "Real-Time Availability", "Instant Digital Booking"].map((item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#73d328" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Phone mockup — single minimal status chip */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[460px]">
                <Image
                  src="/brand/parking-lagbe-hero-mockup-transparent.png"
                  alt="Parking Lagbe Mobile App Interface"
                  width={1448}
                  height={1086}
                  priority
                  sizes="(max-width: 768px) 100vw, 460px"
                  className="h-auto w-full object-contain drop-shadow-[0_16px_40px_rgba(11,31,51,0.10)]"
                />

                {/* Single live status chip — no animation, no bounce */}
                <div className="hidden sm:flex absolute top-6 -left-4 z-20 items-center gap-2 rounded-lg border border-[#e5eaf0] bg-white px-3 py-2 shadow-[0_4px_12px_rgba(11,31,51,0.06)]">
                  <span className="h-2 w-2 rounded-full bg-[#73d328] flex-shrink-0"></span>
                  <div>
                    <div className="text-[11px] font-semibold text-[#0b1f33]">24 spots available</div>
                    <div className="text-[10px] text-[#94a3b8]">Banani 11 · Live</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-10 sm:mt-14">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* Metrics Strip — numbers only, separators, no icons */}
      <section className="border-b border-[#e5eaf0] bg-white py-7">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          <div className="flex flex-wrap justify-center divide-x divide-[#e5eaf0]">
            {metrics.map((m, idx) => (
              <div key={idx} className="flex flex-col items-center px-6 sm:px-10 py-2">
                <div className="text-2xl sm:text-3xl font-bold text-[#0b1f33] tracking-tight">
                  {m.value}
                </div>
                <div className="text-[11px] text-[#64748b] mt-0.5 text-center">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 max-w-7xl py-14 sm:py-20 space-y-20">
        <LandingInteractiveView />
        <WhyParkingLagbe />
        <HowItWorks />
        <TrustSecurityStrip />
        <HostCTASection />
        <ContactSupportStrip />
      </main>

      <ModernFooter />
    </div>
  );
}

