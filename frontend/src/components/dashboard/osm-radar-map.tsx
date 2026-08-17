"use client";

import Image from "next/image";
import Link from "next/link";
import type { DivIcon } from "leaflet";
import { useEffect, useMemo, useState } from "react";
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

export type GaragePoint = {
  id: string;
  name: string;
  area: string;
  position: [number, number];
  rate: number;
  spaces: number;
  totalCapacity: number;
  rating: number;
  open: boolean;
  is24_7: boolean;
  type: string;
  image: string;
};

export const defaultGarages: GaragePoint[] = [
  {
    id: "GAR-001",
    name: "Banani Prime Parking Complex",
    area: "Road 11, Block D, Banani",
    position: [23.7942, 90.4062],
    rate: 60,
    spaces: 8,
    totalCapacity: 25,
    rating: 4.9,
    open: true,
    is24_7: true,
    type: "Covered",
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "GAR-002",
    name: "Gulshan Corporate Underground Garage",
    area: "Gulshan Avenue, Gulshan 2",
    position: [23.7925, 90.4153],
    rate: 80,
    spaces: 14,
    totalCapacity: 40,
    rating: 4.8,
    open: true,
    is24_7: true,
    type: "Underground",
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "GAR-003",
    name: "Dhanmondi Lake View Parking Hub",
    area: "Satmasjid Road, Dhanmondi 27",
    position: [23.7465, 90.3742],
    rate: 50,
    spaces: 5,
    totalCapacity: 20,
    rating: 4.7,
    open: true,
    is24_7: false,
    type: "Indoor",
    image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "GAR-004",
    name: "Uttara Sector 3 Secure Lot",
    area: "Sector 3, Uttara Model Town",
    position: [23.8759, 90.3795],
    rate: 45,
    spaces: 12,
    totalCapacity: 30,
    rating: 4.9,
    open: true,
    is24_7: true,
    type: "Outdoor",
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "GAR-005",
    name: "Mirpur 14 Central Garage",
    area: "651 Ibrahimpur, Mirpur 14",
    position: [23.8223, 90.3669],
    rate: 40,
    spaces: 9,
    totalCapacity: 22,
    rating: 4.8,
    open: true,
    is24_7: true,
    type: "Indoor",
    image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "GAR-006",
    name: "Motijheel Financial District Parking",
    area: "Dilkusha Commercial Area, Motijheel",
    position: [23.7384, 90.4187],
    rate: 70,
    spaces: 3,
    totalCapacity: 35,
    rating: 4.6,
    open: true,
    is24_7: false,
    type: "Covered",
    image: "https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?q=80&w=800&auto=format&fit=crop",
  },
];

const dhakaCenter: [number, number] = [23.8103, 90.4125];

function RecenterMap({ center, zoom }: { center: [number, number]; zoom?: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom || map.getZoom(), { animate: true });
  }, [center, zoom, map]);

  return null;
}

interface OSMRadarMapProps {
  selectedGarageId?: string | null;
  onSelectGarage?: (garage: GaragePoint) => void;
  filterType?: string;
}

export function OSMRadarMap({ selectedGarageId, onSelectGarage, filterType = "all" }: OSMRadarMapProps) {
  const [parkingPin, setParkingPin] = useState<DivIcon | null>(null);
  const [activePin, setActivePin] = useState<DivIcon | null>(null);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [center, setCenter] = useState<[number, number]>(dhakaCenter);
  const [zoomLevel, setZoomLevel] = useState<number>(12.2);
  const [activeGarage, setActiveGarage] = useState<GaragePoint | null>(null);

  useEffect(() => {
    let mounted = true;

    import("leaflet").then(({ divIcon }) => {
      if (!mounted) return;
      setParkingPin(
        divIcon({
          className: "parking-map-pin",
          html: `
            <div class="parking-map-pin__core"></div>
            <div class="parking-map-pin__pulse"></div>
          `,
          iconSize: [38, 54],
          iconAnchor: [19, 52],
          popupAnchor: [0, -50],
        }),
      );

      setActivePin(
        divIcon({
          className: "parking-map-pin active",
          html: `
            <div class="parking-map-pin__core"></div>
            <div class="parking-map-pin__pulse" style="background: rgba(20,159,232,0.4)"></div>
          `,
          iconSize: [44, 60],
          iconAnchor: [22, 58],
          popupAnchor: [0, -56],
        }),
      );
    });

    return () => {
      mounted = false;
    };
  }, []);

  // Update center when selectedGarageId prop changes
  useEffect(() => {
    if (selectedGarageId) {
      const match = defaultGarages.find((g) => g.id === selectedGarageId);
      if (match) {
        setCenter(match.position);
        setZoomLevel(14);
        setActiveGarage(match);
      }
    }
  }, [selectedGarageId]);

  const filteredGarages = useMemo(() => {
    if (!filterType || filterType === "all") return defaultGarages;
    if (filterType === "covered") return defaultGarages.filter((g) => g.type.toLowerCase().includes("cover") || g.type.toLowerCase().includes("underground"));
    if (filterType === "outdoor") return defaultGarages.filter((g) => g.type.toLowerCase().includes("out") || g.type.toLowerCase().includes("open"));
    if (filterType === "24_7") return defaultGarages.filter((g) => g.is24_7);
    if (filterType === "available") return defaultGarages.filter((g) => g.spaces > 5);
    return defaultGarages;
  }, [filterType]);

  const requestLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const next: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        setUserPosition(next);
        setCenter(next);
        setZoomLevel(13.5);
      },
      () => {
        setCenter(dhakaCenter);
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  return (
    <div className="relative h-full min-h-[420px] sm:min-h-[520px] w-full overflow-hidden rounded-3xl border border-[#e7ecf1] bg-[#f0f4f8] shadow-sm">
      <MapContainer
        center={center}
        zoom={zoomLevel}
        zoomControl={false}
        scrollWheelZoom
        className="h-full w-full z-10"
      >
        <RecenterMap center={center} zoom={zoomLevel} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Circle
          center={dhakaCenter}
          radius={14000}
          pathOptions={{
            color: "#149fe8",
            fillColor: "#149fe8",
            fillOpacity: 0.05,
            weight: 1.5,
          }}
        />

        {filteredGarages.map((garage) => {
          const isSelected = selectedGarageId === garage.id || activeGarage?.id === garage.id;
          const pin = isSelected && activePin ? activePin : parkingPin;
          if (!pin) return null;

          return (
            <Marker
              key={garage.id}
              position={garage.position}
              icon={pin}
              eventHandlers={{
                click: () => {
                  setActiveGarage(garage);
                  if (onSelectGarage) onSelectGarage(garage);
                },
              }}
            >
              <Popup className="custom-parking-popup">
                <div className="p-1 min-w-[200px]">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ● {garage.spaces} Available
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">
                      ★ {garage.rating}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-[#0b1f33] leading-snug">{garage.name}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{garage.area}</div>
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#149fe8]">৳{garage.rate}/hr</span>
                    <Link
                      href={`/dashboard?garage=${garage.id}`}
                      className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#149fe8] to-[#73d328] text-[10px] font-bold text-white shadow-sm"
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

      {/* Floating Status & Controls Header Overlay */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2 pointer-events-none">
        <div className="pointer-events-auto rounded-2xl border border-white/80 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#73d328] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#73d328]"></span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Live Dhaka Radar
            </span>
          </div>
          <div className="text-xs font-bold text-[#0b1f33] mt-0.5">
            {filteredGarages.length} Verified Smart Garages
          </div>
        </div>
      </div>

      {/* GPS Locate Button */}
      <div className="absolute top-4 right-4 z-[400]">
        <button
          type="button"
          onClick={requestLocation}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0b1f33] hover:bg-[#149fe8] px-4 py-2.5 text-xs font-bold text-white shadow-lg transition-all duration-200 cursor-pointer"
        >
          <span>📍</span>
          <span>Use My Location</span>
        </button>
      </div>

      {/* Quick Area Filter Pills */}
      <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-[400] flex flex-wrap gap-2 pointer-events-auto">
        <button
          type="button"
          onClick={() => {
            setCenter([23.7942, 90.4062]);
            setZoomLevel(14.5);
          }}
          className="rounded-xl border border-white/80 bg-white/95 px-3.5 py-1.5 text-xs font-bold text-[#0b1f33] shadow-md backdrop-blur hover:border-[#149fe8] hover:text-[#149fe8] transition cursor-pointer"
        >
          Banani
        </button>
        <button
          type="button"
          onClick={() => {
            setCenter([23.7925, 90.4153]);
            setZoomLevel(14.5);
          }}
          className="rounded-xl border border-white/80 bg-white/95 px-3.5 py-1.5 text-xs font-bold text-[#0b1f33] shadow-md backdrop-blur hover:border-[#149fe8] hover:text-[#149fe8] transition cursor-pointer"
        >
          Gulshan 2
        </button>
        <button
          type="button"
          onClick={() => {
            setCenter([23.7465, 90.3742]);
            setZoomLevel(14.5);
          }}
          className="rounded-xl border border-white/80 bg-white/95 px-3.5 py-1.5 text-xs font-bold text-[#0b1f33] shadow-md backdrop-blur hover:border-[#149fe8] hover:text-[#149fe8] transition cursor-pointer"
        >
          Dhanmondi
        </button>
        <button
          type="button"
          onClick={() => {
            setCenter([23.8759, 90.3795]);
            setZoomLevel(14.5);
          }}
          className="rounded-xl border border-white/80 bg-white/95 px-3.5 py-1.5 text-xs font-bold text-[#0b1f33] shadow-md backdrop-blur hover:border-[#149fe8] hover:text-[#149fe8] transition cursor-pointer"
        >
          Uttara
        </button>
        <button
          type="button"
          onClick={() => {
            setCenter([23.8223, 90.3669]);
            setZoomLevel(14.5);
          }}
          className="rounded-xl border border-white/80 bg-white/95 px-3.5 py-1.5 text-xs font-bold text-[#0b1f33] shadow-md backdrop-blur hover:border-[#149fe8] hover:text-[#149fe8] transition cursor-pointer"
        >
          Mirpur 14
        </button>
      </div>

      {/* Floating Selected Garage Card Popup at bottom-right */}
      {activeGarage && (
        <div className="hidden lg:flex absolute bottom-4 right-4 z-[400] w-80 rounded-2xl border border-white/90 bg-white/95 p-3.5 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3">
          <div className="flex gap-3 w-full">
            <div className="relative h-16 w-16 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100">
              <Image
                src={activeGarage.image}
                alt={activeGarage.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-600">● {activeGarage.spaces} slots</span>
                <span className="text-[10px] font-bold text-amber-500">★ {activeGarage.rating}</span>
              </div>
              <h4 className="text-xs font-bold text-[#0b1f33] truncate mt-0.5">{activeGarage.name}</h4>
              <p className="text-[10px] text-slate-500 truncate">{activeGarage.area}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#149fe8]">৳{activeGarage.rate}/hr</span>
                <Link
                  href={`/dashboard?garage=${activeGarage.id}`}
                  className="rounded-lg bg-gradient-to-r from-[#149fe8] to-[#73d328] px-3 py-1 text-[11px] font-bold text-white shadow-sm"
                >
                  Reserve
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
