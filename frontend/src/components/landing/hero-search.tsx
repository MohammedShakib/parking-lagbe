"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface HeroSearchProps {
  onSearch?: (query: string, type: string) => void;
}

export function HeroSearch({ onSearch }: HeroSearchProps) {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [spaceType, setSpaceType] = useState("all");
  const [selectedTime, setSelectedTime] = useState("now");

  const quickLocations = ["Banani", "Gulshan 2", "Dhanmondi 27", "Uttara", "Mirpur 14", "Motijheel"];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(location, spaceType);
      const mapElem = document.getElementById("radar-map-section");
      if (mapElem) {
        mapElem.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    const params = new URLSearchParams();
    if (location) params.set("q", location);
    if (spaceType && spaceType !== "all") params.set("type", spaceType);
    router.push(`/dashboard?${params.toString()}`);
  };

  const handleQuickPick = (loc: string) => {
    setLocation(loc);
    if (onSearch) {
      onSearch(loc, spaceType);
      const mapElem = document.getElementById("radar-map-section");
      if (mapElem) mapElem.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form
        onSubmit={handleSearchSubmit}
        className="rounded-xl border border-[#e5eaf0] bg-white p-2 shadow-[0_4px_16px_rgba(15,23,42,0.06)]"
      >
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-px bg-[#e5eaf0] rounded-lg overflow-hidden">
          {/* Location */}
          <div className="flex flex-col px-4 py-3 bg-white hover:bg-[#f7f9fb] transition-colors">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8] mb-1">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Area or landmark"
              className="w-full bg-transparent text-sm font-medium text-[#0b1f33] placeholder:text-[#94a3b8] outline-none"
            />
          </div>

          {/* Space Type */}
          <div className="flex flex-col px-4 py-3 bg-white hover:bg-[#f7f9fb] transition-colors">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8] mb-1">
              Parking Type
            </label>
            <select
              value={spaceType}
              onChange={(e) => setSpaceType(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-[#0b1f33] outline-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="covered">Covered / Indoor</option>
              <option value="outdoor">Outdoor / Open Lot</option>
              <option value="underground">Underground</option>
            </select>
          </div>

          {/* Arrival Time */}
          <div className="flex flex-col px-4 py-3 bg-white hover:bg-[#f7f9fb] transition-colors">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-[#94a3b8] mb-1">
              Arrival Time
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full bg-transparent text-sm font-medium text-[#0b1f33] outline-none cursor-pointer"
            >
              <option value="now">Park Right Now</option>
              <option value="in_1_hour">In 1 Hour</option>
              <option value="in_3_hours">In 3 Hours</option>
              <option value="evening">Evening (6 PM+)</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="flex">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-[#149fe8] hover:bg-[#0e8ed2] text-white text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap rounded-r-lg"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              Search Parking
            </button>
          </div>
        </div>
      </form>

      {/* Quick picks — minimal text links */}
      <div className="mt-3 flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1 text-xs text-[#64748b]">
        <span className="text-[#94a3b8]">Popular:</span>
        {quickLocations.map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => handleQuickPick(loc)}
            className="hover:text-[#149fe8] hover:underline transition-colors cursor-pointer"
          >
            {loc}
          </button>
        ))}
      </div>
    </div>
  );
}

