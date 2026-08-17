"use client";

import dynamic from "next/dynamic";
import type { GaragePoint } from "./osm-radar-map";

const OSMRadarMap = dynamic(
  () => import("./osm-radar-map").then((mod) => mod.OSMRadarMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full min-h-[420px] w-full rounded-3xl bg-slate-100 flex items-center justify-center text-slate-400">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full border-2 border-[#149fe8] border-t-transparent animate-spin"></div>
          <span className="text-xs font-semibold">Loading Live Map Radar...</span>
        </div>
      </div>
    ),
  },
);

interface OSMRadarMapShellProps {
  selectedGarageId?: string | null;
  onSelectGarage?: (garage: GaragePoint) => void;
  filterType?: string;
}

export function OSMRadarMapShell(props: OSMRadarMapShellProps) {
  return <OSMRadarMap {...props} />;
}
