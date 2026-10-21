import React from "react";
import { Navigation } from "lucide-react";

interface MockupMapProps {
  autoPosition?: "pickup" | "middle" | "approaching";
  pillText?: string;
  className?: string;
}

export const MockupMap: React.FC<MockupMapProps> = ({
  autoPosition = "middle",
  pillText,
  className = "h-56 w-full",
}) => {
  // SVG Mockup styled map representation with real roads, terrain, pins and route
  return (
    <div className={`relative overflow-hidden bg-slate-100 dark:bg-slate-900 border-b border-zinc-200 dark:border-zinc-800 ${className}`}>
      {/* Background Stylized Vector Map */}
      <svg className="w-full h-full object-cover" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Soft terrain & rivers */}
        <path d="M-10 180 Q100 160 200 200 T420 170" stroke="#CBD5E1" strokeWidth="18" fill="none" opacity="0.6" />
        <path d="M-20 60 Q120 40 240 70 T420 40" stroke="#E2E8F0" strokeWidth="8" fill="none" />
        
        {/* Secondary Roads */}
        <path d="M60 -10 L100 250" stroke="#E2E8F0" strokeWidth="5" />
        <path d="M320 -10 L300 250" stroke="#E2E8F0" strokeWidth="5" />
        <path d="M-10 120 L410 120" stroke="#E2E8F0" strokeWidth="5" />

        {/* Lavel to GIT Main Corridor Road */}
        <path
          d="M 60 140 C 120 140, 160 100, 240 90 S 330 70, 340 50"
          stroke="#94A3B8"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />

        {/* Blue Active Route Highlight */}
        <path
          d="M 60 140 C 120 140, 160 100, 240 90 S 330 70, 340 50"
          stroke="#2563EB"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Inner glow on route */}
        <path
          d="M 60 140 C 120 140, 160 100, 240 90 S 330 70, 340 50"
          stroke="#60A5FA"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* Pickup Pin: Lavel Stop (at 60, 140) */}
        <circle cx="60" cy="140" r="10" fill="#10B981" />
        <circle cx="60" cy="140" r="4" fill="white" />
        <text x="60" y="162" textAnchor="middle" fill="#0F172A" fontSize="10" fontWeight="bold">
          Lavel Stop
        </text>

        {/* Drop Pin: Gharda Institute of Technology (at 340, 50) */}
        <circle cx="340" cy="50" r="10" fill="#EF4444" />
        <circle cx="340" cy="50" r="4" fill="white" />
        <text x="325" y="40" textAnchor="middle" fill="#0F172A" fontSize="9" fontWeight="bold">
          Gharda Institute of Technology
        </text>

        {/* Moving Auto Rickshaw Marker */}
        {autoPosition === "pickup" && (
          <g transform="translate(68, 126)">
            <circle cx="12" cy="12" r="14" fill="#FACC15" stroke="#18181B" strokeWidth="2" />
            <text x="12" y="16" textAnchor="middle" fontSize="14">🛺</text>
          </g>
        )}
        {autoPosition === "middle" && (
          <g transform="translate(195, 78)">
            <circle cx="12" cy="12" r="14" fill="#FACC15" stroke="#18181B" strokeWidth="2" />
            <text x="12" y="16" textAnchor="middle" fontSize="14">🛺</text>
          </g>
        )}
        {autoPosition === "approaching" && (
          <g transform="translate(290, 55)">
            <circle cx="12" cy="12" r="14" fill="#FACC15" stroke="#18181B" strokeWidth="2" />
            <text x="12" y="16" textAnchor="middle" fontSize="14">🛺</text>
          </g>
        )}
      </svg>

      {/* Floating Status Pill */}
      {pillText && (
        <div className="absolute top-3 right-4 bg-white/95 dark:bg-zinc-800/95 backdrop-blur-sm border border-zinc-200 dark:border-zinc-700 shadow-md px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>{pillText}</span>
        </div>
      )}

      {/* Google Maps / OSM Watermark badge */}
      <div className="absolute bottom-1.5 left-2 text-[9px] font-bold text-zinc-400 select-none">
        OpenStreetMap • Lavel Corridor
      </div>
    </div>
  );
};
