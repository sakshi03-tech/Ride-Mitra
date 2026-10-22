import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Navigation, Locate, Compass } from "lucide-react";

interface MockupMapProps {
  autoPosition?: "pickup" | "middle" | "approaching" | "dropped";
  pillText?: string;
  className?: string;
  pickupCoords?: [number, number];
  dropCoords?: [number, number];
  pickupName?: string;
  dropName?: string;
  showLiveMotion?: boolean;
}

// Real Lavel ↔ GIT Corridor Coordinates
// Lavel Highway Stop: [17.7289, 73.4981]
// GIT College Gate:   [17.7425, 73.5132]
// Intermediate corridor waypoints along actual road
const ROUTE_WAYPOINTS: [number, number][] = [
  [17.7289, 73.4981], // Lavel Highway Stop
  [17.7310, 73.5005],
  [17.7335, 73.5032],
  [17.7360, 73.5060], // Lavel Bridge / River crossing
  [17.7385, 73.5090],
  [17.7405, 73.5115],
  [17.7425, 73.5132], // GIT College Main Gate
];

export const MockupMap: React.FC<MockupMapProps> = ({
  autoPosition = "middle",
  pillText,
  className = "h-64 w-full",
  pickupCoords = [17.7289, 73.4981],
  dropCoords = [17.7425, 73.5132],
  pickupName = "Lavel Stop",
  dropName = "GIT College",
  showLiveMotion = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const autoMarkerRef = useRef<L.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState("32 km/h");

  // Determine initial auto index based on autoPosition
  const getIndexForPos = (pos: string) => {
    if (pos === "pickup") return 0;
    if (pos === "middle") return 3;
    if (pos === "approaching") return 5;
    return 6;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Prevent duplicate map initialization
    if (!mapRef.current) {
      const map = L.map(containerRef.current, {
        center: [17.7357, 73.5056],
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
      });

      // Real OpenStreetMap Tile Layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        subdomains: ["a", "b", "c"],
      }).addTo(map);

      // Real route polyline (Outer glow + Blue corridor line)
      L.polyline(ROUTE_WAYPOINTS, {
        color: "#1E40AF",
        weight: 7,
        opacity: 0.8,
        lineCap: "round",
        lineJoin: "round",
      }).addTo(map);

      L.polyline(ROUTE_WAYPOINTS, {
        color: "#60A5FA",
        weight: 3,
        opacity: 0.9,
        dashArray: "6, 8",
      }).addTo(map);

      // Custom Pickup Pin (Green)
      const pickupIcon = L.divIcon({
        className: "custom-pin",
        html: `
          <div style="background-color: #10B981; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; items-center; justify-content: center; font-weight: 900; font-size: 13px; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); line-height: 22px; text-align: center;">
            📍
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });
      L.marker(pickupCoords, { icon: pickupIcon })
        .addTo(map)
        .bindPopup(`<b>पिकअप (Pickup):</b> ${pickupName}`);

      // Custom Drop Pin (Red)
      const dropIcon = L.divIcon({
        className: "custom-pin",
        html: `
          <div style="background-color: #EF4444; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; items-center; justify-content: center; font-weight: 900; font-size: 13px; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); line-height: 22px; text-align: center;">
            🏁
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });
      L.marker(dropCoords, { icon: dropIcon })
        .addTo(map)
        .bindPopup(`<b>ड्रॉप (Drop):</b> ${dropName}`);

      // Moving Auto Rickshaw Pin (Ola/Uber style pulsing yellow badge)
      const autoIcon = L.divIcon({
        className: "rickshaw-live-marker",
        html: `
          <div style="position: relative; width: 38px; height: 38px;">
            <div style="position: absolute; inset: -4px; background: rgba(245, 158, 11, 0.4); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="background-color: #F59E0B; color: black; width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; border: 3px solid #18181B; box-shadow: 0 6px 16px rgba(0,0,0,0.4); text-align: center; line-height: 32px; position: relative; z-index: 2;">
              🛺
            </div>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      const initialCoord = ROUTE_WAYPOINTS[getIndexForPos(autoPosition)];
      const autoMarker = L.marker(initialCoord, { icon: autoIcon, zIndexOffset: 1000 }).addTo(map);
      autoMarkerRef.current = autoMarker;

      mapRef.current = map;
      setMapLoaded(true);
    }

    return () => {
      // Keep map across re-renders
    };
  }, []);

  // Ola/Uber Live Motion Animation along route
  useEffect(() => {
    if (!autoMarkerRef.current || !mapRef.current || !showLiveMotion) return;

    let step = getIndexForPos(autoPosition);
    let subStep = 0;
    const interval = setInterval(() => {
      if (subStep < 10) {
        subStep += 1;
      } else {
        subStep = 0;
        step = (step + 1) % ROUTE_WAYPOINTS.length;
      }

      const p1 = ROUTE_WAYPOINTS[step];
      const p2 = ROUTE_WAYPOINTS[(step + 1) % ROUTE_WAYPOINTS.length];
      const lat = p1[0] + (p2[0] - p1[0]) * (subStep / 10);
      const lng = p1[1] + (p2[1] - p1[1]) * (subStep / 10);

      autoMarkerRef.current?.setLatLng([lat, lng]);

      // Random natural speed fluctuation
      const speeds = ["28 km/h", "31 km/h", "34 km/h", "29 km/h", "35 km/h"];
      setCurrentSpeed(speeds[step % speeds.length]);
    }, 400);

    return () => clearInterval(interval);
  }, [autoPosition, showLiveMotion]);

  const handleCenterMap = () => {
    if (mapRef.current) {
      mapRef.current.setView([17.7357, 73.5056], 14, { animate: true });
    }
  };

  return (
    <div className={`relative overflow-hidden bg-slate-200 dark:bg-slate-900 border-b border-zinc-200 dark:border-zinc-800 ${className}`}>
      {/* Real Leaflet Map Container */}
      <div ref={containerRef} className="w-full h-full z-0" />

      {/* Floating GPS Live Tracking Pill (Ola / Uber Style) */}
      <div className="absolute top-3 left-3 z-10 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-700 shadow-xl px-3 py-1.5 rounded-2xl flex items-center gap-2 text-xs font-black">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-zinc-800 dark:text-zinc-100">Live GPS</span>
        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-mono">
          {currentSpeed}
        </span>
      </div>

      {/* Dynamic Status / ETA Pill */}
      {pillText && (
        <div className="absolute top-3 right-3 z-10 bg-zinc-900/90 text-white backdrop-blur-md border border-zinc-700 shadow-xl px-3 py-1.5 rounded-2xl flex items-center gap-1.5 text-xs font-bold animate-in fade-in">
          <Navigation className="w-3.5 h-3.5 text-amber-400" />
          <span>{pillText}</span>
        </div>
      )}

      {/* Re-center GPS button */}
      <button
        type="button"
        onClick={handleCenterMap}
        className="absolute bottom-3 right-3 z-10 w-9 h-9 rounded-xl bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 shadow-lg border border-zinc-200 dark:border-zinc-700 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-95 transition"
        title="Re-center map"
      >
        <Locate className="w-4 h-4 text-blue-600" />
      </button>

      {/* Real OpenStreetMap attribution watermark */}
      <div className="absolute bottom-1 left-2 z-10 text-[9px] font-bold text-zinc-600 dark:text-zinc-400 select-none bg-white/70 dark:bg-black/70 px-1.5 py-0.5 rounded backdrop-blur-sm">
        © OpenStreetMap • Lavel Corridor
      </div>
    </div>
  );
};
