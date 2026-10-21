import React, { useEffect, useRef } from "react";
import L from "leaflet";

interface MapViewProps {
  pickupCoords?: [number, number];
  dropCoords?: [number, number];
  driverCoords?: [number, number];
  pickupName?: string;
  dropName?: string;
  driverName?: string;
  className?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  pickupCoords,
  dropCoords,
  driverCoords,
  pickupName,
  dropName,
  driverName,
  className = "h-64 w-full rounded-2xl",
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Default center: Lavel - GIT Corridor (Lat ~17.735, Lng ~73.505)
  const defaultCenter: [number, number] = [17.738, 73.506];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: pickupCoords || defaultCenter,
        zoom: 14,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
      markersLayerRef.current = markersLayer;
    }

    // Update markers
    if (markersLayerRef.current && mapInstanceRef.current) {
      markersLayerRef.current.clearLayers();
      const bounds = L.latLngBounds([]);

      // Pickup Marker (Green pin)
      if (pickupCoords) {
        const pickupIcon = L.divIcon({
          className: "custom-map-icon",
          html: `<div style="background-color: #10B981; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">📍</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });
        const m = L.marker(pickupCoords, { icon: pickupIcon }).bindPopup(
          `<b>पिकअप (Pickup):</b> ${pickupName || "Pickup"}`
        );
        markersLayerRef.current.addLayer(m);
        bounds.extend(pickupCoords);
      }

      // Drop Marker (Red pin)
      if (dropCoords) {
        const dropIcon = L.divIcon({
          className: "custom-map-icon",
          html: `<div style="background-color: #EF4444; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">🏁</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        });
        const m = L.marker(dropCoords, { icon: dropIcon }).bindPopup(
          `<b>ड्रॉप (Drop):</b> ${dropName || "Drop"}`
        );
        markersLayerRef.current.addLayer(m);
        bounds.extend(dropCoords);
      }

      // Driver Marker (Auto Rickshaw yellow pin)
      if (driverCoords) {
        const autoIcon = L.divIcon({
          className: "custom-map-icon",
          html: `<div style="background-color: #FACC15; color: black; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; border: 3px solid black; box-shadow: 0 4px 10px rgba(0,0,0,0.4);">🛺</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });
        const m = L.marker(driverCoords, { icon: autoIcon }).bindPopup(
          `<b>चालक (Driver):</b> ${driverName || "रिक्षा"}`
        );
        markersLayerRef.current.addLayer(m);
        bounds.extend(driverCoords);
      }

      // Connect route line if pickup and drop present
      if (pickupCoords && dropCoords) {
        const routeLine = L.polyline([pickupCoords, dropCoords], {
          color: "#EAB308",
          weight: 4,
          opacity: 0.8,
          dashArray: "6, 8",
        });
        markersLayerRef.current.addLayer(routeLine);
      }

      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
      }
    }
  }, [pickupCoords, dropCoords, driverCoords, pickupName, dropName, driverName]);

  return (
    <div className={`relative overflow-hidden border-2 border-border shadow-md ${className}`}>
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
};
