"use client";

import dynamic from "next/dynamic";
import type { GaragePoint } from "./osm-radar-map-data";

const OSMRadarMap = dynamic(
  () => import("./osm-radar-map").then((mod) => mod.OSMRadarMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full min-h-[420px] w-full rounded-2xl bg-[#f7f9fb] border border-[#e5eaf0] flex flex-col items-center justify-center text-[#94a3b8]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-5 w-5 rounded-full border-2 border-[#149fe8] border-t-transparent animate-spin"></div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b]">Loading Live Map Radar...</span>
        </div>
      </div>
    ),
  },
);

interface OSMRadarMapShellProps {
  selectedGarageId?: string | null;
  hoveredGarageId?: string | null;
  onSelectGarage?: (garage: GaragePoint) => void;
  filterType?: string;
}

export function OSMRadarMapShell(props: OSMRadarMapShellProps) {
  return <OSMRadarMap {...props} />;
}
