"use client";

import Image from "next/image";
import Link from "next/link";
import type { DivIcon } from "leaflet";
import { useEffect, useMemo, useState } from "react";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

import { type GaragePoint, defaultGarages } from "./osm-radar-map-data";

const dhakaCenter: [number, number] = [23.8103, 90.4125];

function RecenterMap({ center, zoom, userPosition }: { center: [number, number]; zoom?: number, userPosition: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom || map.getZoom(), { animate: true });
  }, [center, zoom, map]);

  return null;
}

interface OSMRadarMapProps {
  selectedGarageId?: string | null;
  hoveredGarageId?: string | null;
  onSelectGarage?: (garage: GaragePoint) => void;
  filterType?: string;
}

export function OSMRadarMap({ selectedGarageId, hoveredGarageId, onSelectGarage, filterType = "all" }: OSMRadarMapProps) {
  const [L, setL] = useState<any>(null);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [center, setCenter] = useState<[number, number]>(dhakaCenter);
  const [zoomLevel, setZoomLevel] = useState<number>(12.2);
  const [activeGarage, setActiveGarage] = useState<GaragePoint | null>(null);
  const [locatingState, setLocatingState] = useState<"idle" | "locating" | "error">("idle");
  const [locatingError, setLocatingError] = useState<string>("");

  useEffect(() => {
    let mounted = true;
    import("leaflet").then((leaflet) => {
      if (!mounted) return;
      setL(leaflet);
    });
    return () => { mounted = false; };
  }, []);

  // Sync selected/hovered garage
  useEffect(() => {
    const targetId = hoveredGarageId || selectedGarageId;
    if (targetId) {
      const match = defaultGarages.find((g) => g.id === targetId);
      if (match && selectedGarageId === targetId) { // only pan on click
        setCenter(match.position);
        setZoomLevel(15);
        setActiveGarage(match);
      }
    }
  }, [selectedGarageId, hoveredGarageId]);

  const filteredGarages = useMemo(() => {
    if (!filterType || filterType === "all") return defaultGarages;
    if (filterType === "covered") return defaultGarages.filter((g) => g.type.toLowerCase().includes("cover") || g.type.toLowerCase().includes("underground"));
    if (filterType === "outdoor") return defaultGarages.filter((g) => g.type.toLowerCase().includes("out") || g.type.toLowerCase().includes("open"));
    if (filterType === "24_7") return defaultGarages.filter((g) => g.is24_7);
    if (filterType === "available") return defaultGarages.filter((g) => g.spaces > 0);
    return defaultGarages;
  }, [filterType]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocatingState("error");
      setLocatingError("Browser does not support location services.");
      return;
    }

    setLocatingState("locating");
    setLocatingError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPosition(next);
        setCenter(next);
        setZoomLevel(14);
        setLocatingState("idle");
      },
      (error) => {
        setLocatingState("error");
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocatingError("Location access blocked. Please enable permissions.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocatingError("Location could not be determined.");
            break;
          case error.TIMEOUT:
            setLocatingError("Location request timed out. Try again.");
            break;
          default:
            setLocatingError("An unknown error occurred.");
            break;
        }
        setTimeout(() => setLocatingState("idle"), 4000);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const getMarkerIcon = (garage: GaragePoint, isSelected: boolean) => {
    if (!L) return null;
    
    // Status color based on spaces
    let dotColor = "bg-red-500";
    if (garage.spaces > 5) dotColor = "bg-[#73d328]";
    else if (garage.spaces > 0) dotColor = "bg-amber-500";

    const baseClass = "relative flex items-center justify-center rounded-full bg-white transition-transform duration-200 shadow-sm border border-[#e5eaf0]";
    const activeClass = isSelected ? "scale-[1.15] ring-2 ring-[#149fe8] shadow-md z-50" : "hover:scale-[1.08] hover:shadow-md";
    
    const size = isSelected ? 40 : 36;
    
    return L.divIcon({
      className: "bg-transparent border-none",
      html: `
        <div class="${baseClass} ${activeClass}" style="width: ${size}px; height: ${size}px;">
          <img src="/icons/parking-lagbe-icon-transparent.png" alt="Parking Lagbe" class="w-[70%] h-[70%] object-contain" />
          <div class="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${dotColor}"></div>
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
      popupAnchor: [0, -size/2 - 4],
    });
  };

  const userIcon = useMemo(() => {
    if (!L) return null;
    return L.divIcon({
      className: "bg-transparent border-none",
      html: `
        <div class="relative flex items-center justify-center w-6 h-6">
          <div class="absolute inset-0 rounded-full bg-[#149fe8]/20 animate-ping"></div>
          <div class="w-3.5 h-3.5 rounded-full bg-[#149fe8] border-2 border-white shadow-sm relative z-10"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  }, [L]);

  return (
    <div className="relative h-full min-h-[420px] sm:min-h-[520px] w-full overflow-hidden rounded-2xl bg-[#f7f9fb] shadow-sm">
      <MapContainer
        center={center}
        zoom={zoomLevel}
        zoomControl={true}
        scrollWheelZoom={false}
        className="h-full w-full z-10"
        style={{ height: "100%", minHeight: "420px", width: "100%" }}
      >
        <RecenterMap center={center} zoom={zoomLevel} userPosition={userPosition} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userPosition && userIcon && (
          <Marker position={userPosition} icon={userIcon} />
        )}

        {filteredGarages.map((garage) => {
          const isSelected = selectedGarageId === garage.id || hoveredGarageId === garage.id || activeGarage?.id === garage.id;
          const icon = getMarkerIcon(garage, isSelected);
          if (!icon) return null;

          return (
            <Marker
              key={garage.id}
              position={garage.position}
              icon={icon}
              eventHandlers={{
                click: () => {
                  setActiveGarage(garage);
                  if (onSelectGarage) onSelectGarage(garage);
                },
              }}
            >
              <Popup className="custom-clean-popup">
                <div className="p-0 min-w-[220px]">
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold text-[#0b1f33] border border-[#e5eaf0] px-1.5 py-0.5 rounded bg-slate-50">
                      {garage.type}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-[#0b1f33] font-semibold">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      {garage.rating}
                    </div>
                  </div>
                  <h4 className="text-[13px] font-bold text-[#0b1f33] leading-tight mb-0.5">{garage.name}</h4>
                  <p className="text-[11px] text-[#64748b] mb-2">{garage.area}</p>
                  
                  <div className="flex items-center gap-1.5 mb-3 text-[11px] font-medium">
                    <div className={`w-1.5 h-1.5 rounded-full ${garage.spaces > 5 ? 'bg-[#73d328]' : garage.spaces > 0 ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                    <span className={garage.spaces > 0 ? "text-[#0b1f33]" : "text-red-500"}>
                      {garage.spaces > 0 ? `${garage.spaces} slots available` : 'Full'}
                    </span>
                  </div>
                  
                  <div className="pt-2 border-t border-[#e5eaf0] flex items-center justify-between">
                    <div>
                      <span className="text-[13px] font-bold text-[#149fe8]">৳{garage.rate}</span>
                      <span className="text-[10px] text-[#64748b]">/hr</span>
                    </div>
                    <Link
                      href={`/dashboard?garage=${garage.id}`}
                      className="px-3 py-1.5 rounded-md bg-[#0b1f33] hover:bg-[#162d47] text-[11px] font-semibold text-white transition-colors"
                    >
                      Reserve Spot
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Overlays */}
      <div className="absolute top-4 right-14 sm:right-4 z-[400] flex flex-col gap-2 pointer-events-none items-end">
        
        {/* Status Overlay */}
        <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-[#e5eaf0] bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[#73d328]"></span>
          <span className="text-[10px] font-semibold text-[#0b1f33]">
            {filteredGarages.length} verified spots
          </span>
        </div>

        {/* Locate Me / Reset Buttons */}
        <div className="pointer-events-auto flex flex-col gap-2 mt-2">
          <button
            type="button"
            onClick={requestLocation}
            disabled={locatingState === "locating"}
            className="flex items-center justify-center w-9 h-9 rounded-md bg-white hover:bg-[#f7f9fb] text-[#0b1f33] shadow-sm border border-[#e5eaf0] transition-colors"
            aria-label="Use my current location"
            title="Use my current location"
          >
            {locatingState === "locating" ? (
              <svg className="animate-spin h-4 w-4 text-[#149fe8]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
            )}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setCenter(dhakaCenter);
              setZoomLevel(12.2);
              setActiveGarage(null);
            }}
            className="flex items-center justify-center w-9 h-9 rounded-md bg-white hover:bg-[#f7f9fb] text-[#64748b] hover:text-[#0b1f33] shadow-sm border border-[#e5eaf0] transition-colors"
            aria-label="Reset map view"
            title="Reset map view"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          </button>
        </div>
        
        {locatingState === "error" && (
          <div className="pointer-events-auto rounded border border-red-200 bg-red-50 px-2 py-1 text-[10px] text-red-600 mt-1 max-w-[150px] text-right shadow-sm">
            {locatingError}
          </div>
        )}
      </div>

      {/* Quick Area Filter Pills */}
      <div className="absolute bottom-4 left-4 right-4 z-[400] flex flex-wrap gap-2 pointer-events-auto">
        {[
          { label: "Banani", pos: [23.7942, 90.4062] },
          { label: "Gulshan 2", pos: [23.7925, 90.4153] },
          { label: "Dhanmondi", pos: [23.7465, 90.3742] },
          { label: "Uttara", pos: [23.8759, 90.3795] },
          { label: "Mirpur", pos: [23.8223, 90.3669] },
        ].map((loc) => (
          <button
            key={loc.label}
            type="button"
            onClick={() => {
              setCenter(loc.pos as [number, number]);
              setZoomLevel(14.5);
            }}
            className="rounded-full border border-[#e5eaf0] bg-white/95 px-3 py-1 text-[11px] font-semibold text-[#64748b] shadow-sm backdrop-blur hover:border-[#149fe8] hover:text-[#149fe8] transition-colors cursor-pointer"
          >
            {loc.label}
          </button>
        ))}
      </div>

      {/* Empty State Overlay */}
      {filteredGarages.length === 0 && (
        <div className="absolute inset-0 z-[300] flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm pointer-events-none">
          <div className="rounded-xl border border-[#e5eaf0] bg-white px-5 py-4 shadow-sm pointer-events-auto text-center">
            <p className="text-sm font-semibold text-[#0b1f33] mb-1">No parking spaces match</p>
            <p className="text-[11px] text-[#64748b]">Try adjusting your filters to see available spots.</p>
          </div>
        </div>
      )}
    </div>
  );
}
