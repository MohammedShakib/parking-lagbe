import Link from "next/link";
import { AuthHeader } from "@/components/auth-header";
import { getCurrentProfile } from "@/lib/auth/auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const profile = await getCurrentProfile();

  const featuredGarages = [
    {
      id: "shakib_G_001",
      name: "Banani Prime Parking Zone",
      address: "Road 11, Block D, Banani, Dhaka",
      image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=800&auto=format&fit=crop",
      rate: "60.00",
      capacity: 15,
      available: 12,
      type: "Indoor",
      dimensions: "Standard Size",
      rating: 4.9,
      reviews: 48,
      status: "Open",
      hours: "24/7",
    },
    {
      id: "shakib_G_002",
      name: "Dhanmondi Central SafePark",
      address: "Satmasjid Road, Dhanmondi 27, Dhaka",
      image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=800&auto=format&fit=crop",
      rate: "50.00",
      capacity: 20,
      available: 18,
      type: "Indoor Garage",
      dimensions: "Large SUV & Sedan",
      rating: 4.8,
      reviews: 35,
      status: "Open",
      hours: "06:00 AM - 11:00 PM",
    },
    {
      id: "tanvir_G_001",
      name: "Uttara Express Car Park",
      address: "Sector 3, Jashimuddin Avenue, Uttara",
      image: "https://images.unsplash.com/photo-1563245372-f21724e3856d?q=80&w=800&auto=format&fit=crop",
      rate: "40.00",
      capacity: 25,
      available: 21,
      type: "Covered Ground",
      dimensions: "Standard Size",
      rating: 4.7,
      reviews: 62,
      status: "Open",
      hours: "24/7",
    },
    {
      id: "saba_G_001",
      name: "Gulshan Avenue Executive Lot",
      address: "Gulshan-2 Circle, North Avenue, Dhaka",
      image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?q=80&w=800&auto=format&fit=crop",
      rate: "80.00",
      capacity: 12,
      available: 7,
      type: "Underground Safe",
      dimensions: "Executive Luxury",
      rating: 5.0,
      reviews: 29,
      status: "Open",
      hours: "07:00 AM - 11:30 PM",
    },
    {
      id: "sami_G_001",
      name: "Mirpur 10 Metro Spot",
      address: "Mirpur 10 Roundabout, Dhaka",
      image: "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?q=80&w=800&auto=format&fit=crop",
      rate: "35.00",
      capacity: 18,
      available: 4,
      type: "Outdoor Secured",
      dimensions: "Compact & Sedan",
      rating: 4.6,
      reviews: 19,
      status: "Open",
      hours: "06:00 AM - 10:00 PM",
    },
    {
      id: "shakib_G_003",
      name: "Motijheel Financial District Park",
      address: "Dilkusha C/A, Motijheel, Dhaka",
      image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=800&auto=format&fit=crop",
      rate: "70.00",
      capacity: 30,
      available: 24,
      type: "Multi-Storey",
      dimensions: "All Vehicle Types",
      rating: 4.8,
      reviews: 54,
      status: "Open",
      hours: "24/7",
    },
  ];

  return (
    <div className="relative min-h-screen text-white selection:bg-[#f39c12] selection:text-white">
      {/* Background Image with Dark Overlay matching home.php line 804 */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-[-2]"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
      />
      <div className="fixed inset-0 bg-black/50 z-[-1]" />

      <AuthHeader profile={profile} />

      <main className="container mx-auto px-4 py-10">
        {/* Hero Section matching home.php lines 981-989 */}
        <section className="flex flex-col items-center text-center py-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 drop-shadow-md">
            Find and Reserve Parking Spaces in Real-Time
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mb-8">
            Discover available parking spots, compare prices, and book in advance to save time and money.
          </p>
        </section>

        {/* Map Section matching home.php lines 992-1027 */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white drop-shadow-md">
              Parking Locations Near You
            </h2>
            <div className="flex gap-2">
              <Link
                href="/dashboard"
                id="locateMe"
                className="rounded-xl border border-[#f39c12] bg-black/40 px-4 py-2 text-xs font-bold text-white hover:bg-[#f39c12] transition flex items-center gap-1.5 shadow"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-[#f39c12]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="1" />
                  <line x1="12" y1="2" x2="12" y2="4" />
                  <line x1="12" y1="20" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="4" y2="12" />
                  <line x1="20" y1="12" x2="22" y2="12" />
                </svg>
                Locate Me
              </Link>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden border border-white/20 shadow-xl h-[450px] relative bg-neutral-900 flex flex-col items-center justify-center p-6 text-center">
            {/* Interactive Map Visual Mock with Dhaka Pins matching Leaflet */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
            <div className="relative z-10 max-w-md">
              <div className="w-16 h-16 bg-[#f39c12]/20 border-2 border-[#f39c12] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-lg shadow-[#f39c12]/30">
                📍
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Dhaka Live Parking Radar</h3>
              <p className="text-xs text-white/80 mb-6 leading-relaxed">
                6 Verified Garages active in Banani, Dhanmondi, Gulshan, Uttara, Mirpur and Motijheel.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-[#f39c12] px-6 py-3 text-xs font-bold text-white shadow-xl shadow-[#f39c12]/30 hover:bg-[#e67e22] transition hover:scale-105"
              >
                <span>🗺️</span> Open Full Interactive Map in Driver Hub
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Parking Carousel matching home.php lines 1030-1332 */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white drop-shadow-md">
              Featured Parking Locations
            </h2>
            <Link
              href="/dashboard"
              className="text-xs font-bold text-[#f39c12] hover:underline"
            >
              View All Locations in Driver Hub →
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredGarages.map((parking) => (
              <div
                key={parking.id}
                className="flex flex-col justify-between rounded-2xl bg-black/50 backdrop-blur-md border border-white/20 shadow-xl overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl"
              >
                {/* Real Image Figure matching home.php line 1188 */}
                <div className="h-48 overflow-hidden relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={parking.image}
                    alt={parking.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                  {/* Badges on the right matching home.php line 1202 */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/30 text-green-300 border border-green-500/40 backdrop-blur-md shadow">
                      ● {parking.status}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/30 text-blue-300 border border-blue-500/40 backdrop-blur-md shadow">
                      {parking.hours}
                    </span>
                  </div>
                </div>

                {/* Card Body matching home.php lines 1191-1242 */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1.5">{parking.name}</h3>
                    <div className="flex items-center gap-1.5 text-white/90 text-xs mb-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-[#f39c12] flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span className="truncate">{parking.address}</span>
                    </div>

                    <div className="text-xs text-white/60 mb-4">
                      {parking.type} • {parking.dimensions}
                    </div>

                    {/* Stats Section matching home.php lines 1217-1233 */}
                    <div className="flex justify-between items-center rounded-xl bg-black/40 border border-white/10 p-3 mb-4">
                      <div className="flex flex-col items-center">
                        <span className="text-white font-bold text-sm">{parking.capacity}</span>
                        <span className="text-white/70 text-[11px]">Spaces</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1 text-yellow-400 font-bold text-sm">
                          <span>★</span>
                          <span>{parking.rating}</span>
                        </div>
                        <span className="text-white/70 text-[11px]">({parking.reviews} reviews)</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-[#f39c12] font-bold text-sm">৳{parking.rate}</span>
                        <span className="text-white/70 text-[11px]">per hour</span>
                      </div>
                    </div>

                    {/* Availability Status matching home.php lines 1236-1241 */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="text-white/90 text-xs font-medium">
                          Available ({parking.available} spots open)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Buttons Section matching home.php lines 1244-1260 */}
                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <Link
                      href="/dashboard"
                      className="w-full flex items-center justify-center rounded-xl border border-white/30 bg-white/5 py-2 text-xs font-semibold text-white hover:bg-white/15 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5 mr-1.5 text-yellow-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                      View Reviews ({parking.reviews})
                    </Link>

                    <Link
                      href="/dashboard"
                      className="w-full flex items-center justify-center rounded-xl bg-[#f39c12] py-2.5 text-xs font-bold text-white shadow-lg shadow-[#f39c12]/20 hover:bg-[#e67e22] transition"
                    >
                      Book Now 🎫
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Dots matching home.php line 1324 */}
          <div className="flex justify-center gap-2 mt-8">
            <span className="w-3 h-3 rounded-full bg-[#f39c12] cursor-pointer" />
            <span className="w-3 h-3 rounded-full bg-white/30 cursor-pointer" />
            <span className="w-3 h-3 rounded-full bg-white/30 cursor-pointer" />
          </div>
        </section>

        {/* How It Works matching home.php lines 1336-1406 */}
        <section
          id="how-it-works"
          className="bg-black/50 backdrop-blur-md rounded-2xl p-8 mb-16 border border-white/20 shadow-xl"
        >
          <h2 className="text-3xl font-bold text-white mb-8 drop-shadow-md text-center">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#f39c12]/20 rounded-full flex justify-center items-center mb-4 border-2 border-[#f39c12]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#f39c12]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="16" />
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-md">Search</h3>
              <p className="text-white/90 text-sm leading-relaxed">
                Enter your destination, select date and time, and find available parking spots near your location.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#f39c12]/20 rounded-full flex justify-center items-center mb-4 border-2 border-[#f39c12]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#f39c12]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-md">Reserve</h3>
              <p className="text-white/90 text-sm leading-relaxed">
                Compare prices, view details, and reserve your parking spot in advance with just a few clicks.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#f39c12]/20 rounded-full flex justify-center items-center mb-4 border-2 border-[#f39c12]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#f39c12]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-md">Confirm</h3>
              <p className="text-white/90 text-sm leading-relaxed">
                Receive your parking confirmation and instructions via email or in the app for easy access.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-[#f39c12]/20 rounded-full flex justify-center items-center mb-4 border-2 border-[#f39c12]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-[#f39c12]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-md">Park</h3>
              <p className="text-white/90 text-sm leading-relaxed">
                Arrive at the parking location, show your confirmation, and enjoy stress-free parking at your destination.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer matching home.php lines 1409-1450 */}
      <footer id="contact" className="border-t border-white/20 bg-black/80 backdrop-blur-md pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
            {/* Address Card matching home.php line 1419 */}
            <div className="bg-black/60 rounded-2xl p-6 border border-[#f39c12]/30 shadow-lg text-center">
              <div className="w-12 h-12 bg-[#f39c12] rounded-full flex items-center justify-center mx-auto mb-4 text-black text-xl font-bold">
                📍
              </div>
              <h4 className="text-white font-semibold mb-1">Visit Us</h4>
              <p className="text-white/80 text-xs leading-relaxed">
                651, Ibrahimpur <br />
                Mirpur 14, Dhaka 1206
              </p>
            </div>

            {/* Phone Card */}
            <div className="bg-black/60 rounded-2xl p-6 border border-[#f39c12]/30 shadow-lg text-center">
              <div className="w-12 h-12 bg-[#f39c12] rounded-full flex items-center justify-center mx-auto mb-4 text-black text-xl font-bold">
                📞
              </div>
              <h4 className="text-white font-semibold mb-1">Call Us</h4>
              <p className="text-white/80 text-xs leading-relaxed">
                +880 1700-000000 <br />
                Support 24/7 Available
              </p>
            </div>

            {/* Email Card */}
            <div className="bg-black/60 rounded-2xl p-6 border border-[#f39c12]/30 shadow-lg text-center">
              <div className="w-12 h-12 bg-[#f39c12] rounded-full flex items-center justify-center mx-auto mb-4 text-black text-xl font-bold">
                ✉️
              </div>
              <h4 className="text-white font-semibold mb-1">Email Us</h4>
              <p className="text-white/80 text-xs leading-relaxed">
                info@parkinglagbe.com <br />
                contact@parkinglagbe.com
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60">
            <div className="flex items-center gap-2 mb-2 sm:mb-0">
              <span className="font-bold text-white">পার্কিং লাগবে ?</span>
              <span>• Smart Parking Solutions in Bangladesh</span>
            </div>
            <div>© {new Date().getFullYear()} Parking Lagbe. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
