import Image from "next/image";
import Link from "next/link";

import { AuthHeader } from "@/components/auth-header";
import { getCurrentProfile } from "@/lib/auth/auth";

export default async function HomePage() {
  const profile = await getCurrentProfile();

  const featuredGarages = [
    {
      id: "GAR-001",
      name: "Banani Prime Parking Complex",
      address: "Road 11, Block D, Banani, Dhaka",
      rate: 60,
      spaces: 8,
      totalCapacity: 25,
      rating: 4.9,
      reviewsCount: 38,
      isOpen: true,
      is24_7: true,
      image:
        "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "GAR-002",
      name: "Gulshan Corporate Underground Garage",
      address: "Gulshan Avenue, Gulshan 2, Dhaka",
      rate: 80,
      spaces: 14,
      totalCapacity: 40,
      rating: 4.8,
      reviewsCount: 52,
      isOpen: true,
      is24_7: true,
      image:
        "https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "GAR-003",
      name: "Dhanmondi Lake View Parking Hub",
      address: "Satmasjid Road, Dhanmondi 27, Dhaka",
      rate: 50,
      spaces: 5,
      totalCapacity: 20,
      rating: 4.7,
      reviewsCount: 29,
      isOpen: true,
      is24_7: false,
      image:
        "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "GAR-004",
      name: "Uttara Sector 3 Secure Lot",
      address: "Sector 3, Uttara Model Town, Dhaka",
      rate: 45,
      spaces: 12,
      totalCapacity: 30,
      rating: 4.9,
      reviewsCount: 44,
      isOpen: true,
      is24_7: true,
      image:
        "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "GAR-005",
      name: "Mirpur 14 Central Garage",
      address: "651 Ibrahimpur, Mirpur 14, Dhaka 1206",
      rate: 40,
      spaces: 9,
      totalCapacity: 22,
      rating: 4.8,
      reviewsCount: 31,
      isOpen: true,
      is24_7: true,
      image:
        "https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "GAR-006",
      name: "Motijheel Financial District Parking",
      address: "Dilkusha Commercial Area, Motijheel, Dhaka",
      rate: 70,
      spaces: 3,
      totalCapacity: 35,
      rating: 4.6,
      reviewsCount: 65,
      isOpen: true,
      is24_7: false,
      image:
        "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=800&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-[#f39c12]/20">
      <AuthHeader profile={profile} currentDashboard="user" />

      {/* Hero Section matching legacy home.php in White Theme */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(243,156,18,0.09),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(37,99,235,0.07),transparent_30%)]" />
        <div className="container mx-auto relative z-10 grid max-w-7xl items-center gap-12 px-4 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-xs font-bold text-amber-900 shadow-sm mb-6">
              <span>New</span>
              <span>Real-time Smart Parking Network in Bangladesh</span>
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Find and Reserve Parking Spaces in{" "}
              <span className="text-[#f39c12]">Real-Time</span>
            </h1>

            <p className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0">
              Discover secure, CCTV-monitored parking lots across Dhaka. Check live spot
              availability, book in advance, and pay seamlessly with bKash, Nagad, or Loyalty
              Points.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Link
                href="/dashboard"
                className="rounded-2xl bg-[#f39c12] px-8 py-4 text-sm font-bold text-white shadow-lg shadow-[#f39c12]/25 transition hover:scale-105 hover:bg-[#e67e22]"
              >
                Find Parking Near You
              </Link>

              <Link
                href="/business"
                className="rounded-2xl border-2 border-slate-300 bg-white px-7 py-4 text-sm font-bold text-slate-800 shadow-sm transition hover:border-[#f39c12] hover:text-[#d97706]"
              >
                Host Your Parking Space
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-[#f39c12]/10 via-transparent to-sky-500/10 blur-3xl" />
            <Image
              src="/brand/parking-lagbe-hero-mockup-transparent.png"
              alt="Parking Lagbe hero mockup"
              width={1448}
              height={1086}
              priority
              className="h-auto w-full max-w-[680px] object-contain drop-shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
            />
          </div>
        </div>
      </section>

      {/* Radar Map & Discovery Hub Section matching legacy home.php */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Parking Locations Near You</h2>
              <p className="text-xs text-slate-500 mt-1">Live Dhaka City Radar & Real-Time Availability</p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Link
                href="/dashboard"
                className="w-full md:w-auto rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 text-xs font-bold text-center transition shadow-sm"
              >
                📍 Locate Me on GPS
              </Link>
            </div>
          </div>

          <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
            
            {/* Interactive map placeholder illustration */}
            <div className="relative text-center p-6 z-10">
              <div className="w-16 h-16 bg-[#f39c12]/10 border-2 border-[#f39c12] rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <span className="text-2xl animate-bounce">📍</span>
              </div>
              <h3 className="text-base font-bold text-slate-900">Live Dhaka Parking Grid</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Real-time sensors active across Banani, Gulshan, Dhanmondi, Uttara, Mirpur, and Motijheel.
              </p>
              <Link
                href="/dashboard"
                className="inline-block mt-4 rounded-xl bg-[#f39c12] hover:bg-[#e67e22] text-white px-5 py-2 text-xs font-bold shadow-md shadow-[#f39c12]/20 transition"
              >
                Open Interactive Search
              </Link>
            </div>
          </div>
        </div>

        {/* Featured Parking Locations Section matching legacy home.php */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Featured Parking Spaces</h2>
              <p className="text-xs text-slate-500 mt-0.5">Top-rated parking hubs with guaranteed safety and 24/7 access</p>
            </div>
            <Link
              href="/dashboard"
              className="text-xs font-bold text-[#d97706] hover:underline"
            >
              View All Locations →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredGarages.map((garage) => (
              <div
                key={garage.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-[#f39c12]/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full bg-slate-100">
                    <Image
                      src={garage.image}
                      alt={garage.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold shadow-sm">
                        ● Open
                      </span>
                      {garage.is24_7 && (
                        <span className="rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 text-[10px] font-semibold shadow-sm">
                          24/7
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-base font-bold text-slate-900 mb-1">{garage.name}</h3>
                    <p className="text-xs text-slate-500 mb-4">📍 {garage.address}</p>

                    {/* 3-Column Stats matching legacy home.php */}
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                      <div>
                        <div className="text-[10px] uppercase text-slate-400 font-semibold">Available</div>
                        <div className="text-sm font-bold text-emerald-600 mt-0.5">
                          {garage.spaces} Slots
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase text-slate-400 font-semibold">Rating</div>
                        <div className="text-sm font-bold text-amber-500 mt-0.5">
                          ★ {garage.rating}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase text-slate-400 font-semibold">Hourly</div>
                        <div className="text-sm font-bold text-[#d97706] mt-0.5">
                          ৳{garage.rate}/hr
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    href={`/dashboard?garage=${garage.id}`}
                    className="block w-full text-center rounded-xl bg-[#f39c12] hover:bg-[#e67e22] text-white py-2.5 text-xs font-bold shadow-md shadow-[#f39c12]/20 transition"
                  >
                    Reserve Parking Spot
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4-Step How It Works matching legacy home.php in White Theme */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm mb-12">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">How Parking Lagbe Works</h2>
            <p className="text-xs text-slate-500 mt-1">Four simple steps to seamless parking across Bangladesh</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-14 h-14 rounded-full bg-amber-100 border-2 border-[#f39c12] flex items-center justify-center mx-auto mb-4 text-xl font-bold text-amber-800 shadow-sm">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Search Location</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Find available parking spaces near your destination on the live radar map.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-14 h-14 rounded-full bg-amber-100 border-2 border-[#f39c12] flex items-center justify-center mx-auto mb-4 text-xl font-bold text-amber-800 shadow-sm">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Reserve Space</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Select your vehicle, choose arrival date/time, and reserve your guaranteed spot.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-14 h-14 rounded-full bg-amber-100 border-2 border-[#f39c12] flex items-center justify-center mx-auto mb-4 text-xl font-bold text-amber-800 shadow-sm">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Pay Digitally</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Pay securely with bKash, Nagad, Debit/Credit Cards, or redeem Loyalty Points.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-14 h-14 rounded-full bg-amber-100 border-2 border-[#f39c12] flex items-center justify-center mx-auto mb-4 text-xl font-bold text-amber-800 shadow-sm">
                4
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1">Park with Peace</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Drive in, check in with the host, and enjoy verified, CCTV-monitored parking.
              </p>
            </div>
          </div>
        </div>

        {/* 3-Card Contact Footer matching legacy home.php */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-3 text-xl">
              🏢
            </div>
            <h4 className="text-sm font-bold text-slate-900">Visit Our Office</h4>
            <p className="text-xs text-slate-500 mt-1">651 Ibrahimpur, Mirpur 14, Dhaka 1206</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-3 text-xl">
              📞
            </div>
            <h4 className="text-sm font-bold text-slate-900">Call Support 24/7</h4>
            <p className="text-xs text-slate-500 mt-1">+880 1700-000000 / +880 1800-000000</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-3 text-xl">
              ✉️
            </div>
            <h4 className="text-sm font-bold text-slate-900">Email Inquiries</h4>
            <p className="text-xs text-slate-500 mt-1">support@parkinglagbe.com</p>
          </div>
        </div>
      </section>

      {/* Copyright Footer Bar */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="container mx-auto px-4">
          <p>© 2026 পার্কিং লাগবে (Parking Lagbe). All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
