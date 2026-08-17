"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { defaultGarages } from "../dashboard/osm-radar-map";
import { OSMRadarMapShell } from "../dashboard/osm-radar-map-shell";

export function LandingInteractiveView() {
  const [selectedGarageId, setSelectedGarageId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGarageCardClick = (id: string) => {
    setSelectedGarageId(id);
    const mapSection = document.getElementById("radar-map-section");
    if (mapSection) mapSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const filters = [
    { key: "all", label: "All Garages" },
    { key: "available", label: "Available Now" },
    { key: "covered", label: "Covered" },
    { key: "24_7", label: "24/7 Access" },
  ];

  return (
    <div className="space-y-14">
      {/* Map Section */}
      <section id="radar-map-section" className="scroll-mt-24">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1f33] tracking-tight">
              Find Parking Near You
            </h2>
            <p className="mt-1 text-sm text-[#64748b]">
              Live Dhaka city map with real-time slot availability
            </p>
          </div>

          {/* Filter bar — simple segmented */}
          <div className="flex items-center gap-1 border border-[#e5eaf0] rounded-lg p-1 bg-[#f7f9fb] overflow-x-auto no-scrollbar">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilterType(f.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition whitespace-nowrap cursor-pointer ${
                  filterType === f.key
                    ? "bg-white border border-[#e5eaf0] text-[#0b1f33] shadow-sm"
                    : "text-[#64748b] hover:text-[#0b1f33]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Map — clean border, no floating card container */}
        <div className="rounded-2xl border border-[#e5eaf0] overflow-hidden h-[420px] sm:h-[500px] w-full">
          <OSMRadarMapShell
            selectedGarageId={selectedGarageId}
            onSelectGarage={(g) => setSelectedGarageId(g.id)}
            filterType={filterType}
          />
        </div>
      </section>

      {/* Parking Listings */}
      <section className="space-y-5">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0b1f33] tracking-tight">
              Featured Parking Spaces
            </h2>
            <p className="text-sm text-[#64748b] mt-1">
              Verified commercial and residential spaces with live availability
            </p>
          </div>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-[#149fe8] hover:text-[#0b1f33] transition-colors"
          >
            View all →
          </Link>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {defaultGarages.map((garage) => {
            const isSelected = selectedGarageId === garage.id;
            const isFav = !!favorites[garage.id];

            return (
              <div
                key={garage.id}
                onClick={() => handleGarageCardClick(garage.id)}
                className={`group rounded-xl border bg-white overflow-hidden transition-all duration-200 cursor-pointer flex flex-col ${
                  isSelected
                    ? "border-[#149fe8] ring-1 ring-[#149fe8]/20"
                    : "border-[#e5eaf0] hover:border-[#149fe8]/40 hover:shadow-[0_4px_16px_rgba(15,23,42,0.06)]"
                }`}
              >
                {/* Image */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden flex-shrink-0">
                  <Image
                    src={garage.image}
                    alt={garage.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />

                  {/* Availability badge */}
                  <span className="absolute top-3 left-3 rounded-md bg-white/95 backdrop-blur-sm px-2 py-0.5 text-[11px] font-semibold text-[#0b1f33] border border-[#e5eaf0]">
                    {garage.spaces} available
                  </span>

                  {/* Type badge */}
                  <span className="absolute top-3 right-10 rounded-md bg-[#0b1f33]/75 px-2 py-0.5 text-[11px] font-medium text-white">
                    {garage.type}
                  </span>

                  {/* Bookmark — SVG icon */}
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(garage.id, e)}
                    className="absolute top-2.5 right-2.5 flex h-7 w-7 items-center justify-center rounded-md bg-white/90 text-slate-400 hover:text-[#149fe8] transition-colors cursor-pointer shadow-sm"
                    aria-label="Save to favourites"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill={isFav ? "#149fe8" : "none"} stroke={isFav ? "#149fe8" : "currentColor"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                    </svg>
                  </button>
                </div>

                {/* Body — inline typography, no nested card */}
                <div className="p-4 flex flex-col gap-3 flex-1">
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#0b1f33] group-hover:text-[#149fe8] transition-colors leading-snug">
                      {garage.name}
                    </h3>
                    <p className="text-xs text-[#64748b] mt-0.5 flex items-center gap-1">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      {garage.area}
                    </p>
                  </div>

                  {/* Inline stats — typography, no nested box */}
                  <div className="flex items-center gap-4 text-sm border-t border-[#e5eaf0] pt-3">
                    <div>
                      <span className="font-bold text-[#149fe8]">৳{garage.rate}</span>
                      <span className="text-[11px] text-[#94a3b8]">/hr</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#64748b] text-xs">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      <span className="font-medium text-[#0b1f33]">{garage.rating}</span>
                    </div>
                    <div className="text-xs text-[#64748b]">{garage.totalCapacity} total</div>
                  </div>

                  {/* Amenity tags — text only, no emoji */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] font-medium text-[#64748b] border border-[#e5eaf0] rounded px-2 py-0.5">CCTV</span>
                    {garage.is24_7 && (
                      <span className="text-[10px] font-medium text-[#149fe8] border border-[#149fe8]/30 rounded px-2 py-0.5">24/7</span>
                    )}
                    <span className="text-[10px] font-medium text-[#64748b] border border-[#e5eaf0] rounded px-2 py-0.5">Security Guard</span>
                  </div>

                  {/* CTA — solid dark, no gradient */}
                  <div className="mt-auto pt-1">
                    <Link
                      href={`/dashboard?garage=${garage.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#0b1f33] hover:bg-[#162d47] text-white py-2.5 text-xs font-semibold transition-colors"
                    >
                      View &amp; Reserve
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

