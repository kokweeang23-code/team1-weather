import React, { useState } from 'react';
import {
  MapPin,
  Sparkles,
  CloudRain,
  Sun,
  Cloud,
  CloudLightning,
  Eye,
  Layers,
  ChevronRight,
  Compass,
} from 'lucide-react';
import {
  MicroclimateSummary,
  SingaporeRegionId,
  SingaporeZone,
} from '../types/weather';
import { WeatherConditionIcon } from './WeatherConditionIcon';
import { SINGAPORE_REGIONS } from '../services/mockWeatherService';

interface SingaporeMicroclimateMapProps {
  regions: MicroclimateSummary[];
  currentRegionId: SingaporeRegionId;
  onSelectRegion: (regionId: SingaporeRegionId) => void;
}

// Normalized coordinate projections for Singapore Map (viewBox 0 0 800 480)
// Longitude: 103.60 to 104.05 -> X: 50 to 750
// Latitude: 1.20 to 1.48 -> Y: 430 to 50 (inverted SVG Y)
const MAP_STATION_COORDS: Record<SingaporeRegionId, { x: number; y: number }> = {
  woodlands: { x: 380, y: 75 }, // North
  yishun: { x: 440, y: 110 }, // North
  punggol: { x: 570, y: 140 }, // North-East
  east_coast: { x: 650, y: 280 }, // East Coast Park
  changi: { x: 725, y: 225 }, // Far East
  tampines: { x: 645, y: 215 }, // East
  bedok: { x: 590, y: 275 }, // East
  bishan: { x: 410, y: 220 }, // Central
  bukit_timah: { x: 330, y: 240 }, // Central-West
  orchard: { x: 410, y: 300 }, // Central-South
  jurong: { x: 210, y: 260 }, // West
  tanjong_pagar: { x: 420, y: 375 }, // South CBD
  marina_bay: { x: 460, y: 365 }, // South Bay
  sentosa: { x: 395, y: 430 }, // South Island
};

export const SingaporeMicroclimateMap: React.FC<SingaporeMicroclimateMapProps> = ({
  regions,
  currentRegionId,
  onSelectRegion,
}) => {
  const [hoveredRegionId, setHoveredRegionId] = useState<SingaporeRegionId | null>(null);
  const [activeZoneFilter, setActiveZoneFilter] = useState<SingaporeZone | 'All'>('All');

  const activeRegion = regions.find((r) => r.regionId === currentRegionId);
  const hoveredRegion = regions.find((r) => r.regionId === hoveredRegionId);
  const displayedRegion = hoveredRegion || activeRegion;

  // Filter regions by zone
  const visibleRegions = regions.filter((r) => {
    if (activeZoneFilter === 'All') return true;
    return r.zone === activeZoneFilter;
  });

  const getScoreBadgeColor = (score: number) => {
    if (score >= 75) return 'fill-emerald-500 stroke-emerald-600 text-emerald-950 bg-emerald-500';
    if (score >= 50) return 'fill-amber-400 stroke-amber-500 text-amber-950 bg-amber-400';
    return 'fill-rose-500 stroke-rose-600 text-rose-950 bg-rose-500';
  };

  const getMarkerBg = (score: number, isSelected: boolean) => {
    if (isSelected) return 'bg-slate-900 text-white ring-4 ring-emerald-400/40 shadow-lg scale-110';
    if (score >= 75) return 'bg-emerald-500 text-white hover:scale-105';
    if (score >= 50) return 'bg-amber-400 text-slate-900 hover:scale-105';
    return 'bg-rose-500 text-white hover:scale-105';
  };

  return (
    <div
      id="singapore-microclimate-map-container"
      className="relative rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 text-white overflow-hidden shadow-lg p-3 sm:p-5"
    >
      {/* Top Map Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Interactive Doppler &amp; Weather Map
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-800 text-slate-300">
                14 Stations
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
              Singapore Live Microclimate Radar
            </h3>
          </div>
        </div>

        {/* Zone Filter Chips */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {(['All', 'South', 'East', 'Central', 'West', 'North'] as Array<SingaporeZone | 'All'>).map((zone) => (
            <button
              key={zone}
              onClick={() => setActiveZoneFilter(zone)}
              className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all whitespace-nowrap ${
                activeZoneFilter === zone
                  ? 'bg-emerald-500 text-slate-950 shadow-xs'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
              }`}
            >
              {zone}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Map Canvas Container */}
      <div className="relative w-full aspect-[16/9] max-h-[360px] bg-slate-900/90 rounded-xl border border-slate-800/90 overflow-hidden flex items-center justify-center">
        {/* Ambient Map Grids & Nautical Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        <svg
          viewBox="0 0 800 480"
          className="w-full h-full object-contain"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="sgIslandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#0f172a" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#1e293b" stopOpacity="0.95" />
            </linearGradient>

            {/* Rain Cell Radar Overlay Gradient */}
            <radialGradient id="rainRadarJurong" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#0284c7" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
            </radialGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Johor / North Waters label */}
          <text x="380" y="30" fill="#475569" fontSize="11" fontWeight="600" textAnchor="middle" letterSpacing="2">
            STRAITS OF JOHOR
          </text>
          {/* Singapore Strait / South Waters label */}
          <text x="400" y="470" fill="#475569" fontSize="11" fontWeight="600" textAnchor="middle" letterSpacing="2">
            SINGAPORE STRAIT
          </text>

          {/* MAINLAND SINGAPORE OUTLINE (Accurate stylized SVG Coastline) */}
          <path
            d="M 170,240 
               C 130,220 90,260 70,300 
               C 60,330 90,360 140,350 
               C 180,340 220,330 260,345 
               C 310,360 360,395 410,400 
               C 460,405 500,380 540,340 
               C 590,300 650,260 720,240 
               C 760,230 765,200 740,180 
               C 700,150 640,130 580,130 
               C 530,130 490,110 460,85 
               C 420,55 350,50 310,80 
               C 270,110 230,150 200,190 
               Z"
            fill="url(#sgIslandGrad)"
            stroke="#334155"
            strokeWidth="2"
            strokeLinejoin="round"
          />

          {/* SENTOSA ISLAND */}
          <path
            d="M 370,425 C 385,415 415,420 425,435 C 410,445 380,440 370,425 Z"
            fill="#1e293b"
            stroke="#334155"
            strokeWidth="1.5"
          />

          {/* PULAU UBIN (North-East) */}
          <path
            d="M 640,110 C 660,105 690,115 680,125 C 655,130 635,120 640,110 Z"
            fill="#1e293b"
            stroke="#334155"
            strokeWidth="1.5"
          />

          {/* PULAU TEKONG (Far East) */}
          <path
            d="M 720,130 C 745,125 765,140 755,160 C 730,165 715,150 720,130 Z"
            fill="#1e293b"
            stroke="#334155"
            strokeWidth="1.5"
          />

          {/* RAIN RADAR CELL VISUALIZER OVERLAY (e.g. West / Convective Zone) */}
          <ellipse
            cx="220"
            cy="270"
            rx="110"
            ry="75"
            fill="url(#rainRadarJurong)"
            className="animate-pulse"
          />

          {/* CONNECTING CORRIDORS / EXPRESSWAY NETWORK (Subtle Geo Lines) */}
          <path
            d="M 140,320 L 260,300 L 410,300 L 590,260 L 710,210"
            fill="none"
            stroke="#1e293b"
            strokeWidth="2"
            strokeDasharray="4,4"
          />
          <path
            d="M 380,85 L 410,210 L 420,370"
            fill="none"
            stroke="#1e293b"
            strokeWidth="2"
            strokeDasharray="4,4"
          />

          {/* STATIONS MARKERS & WEATHER STATUS PINS */}
          {visibleRegions.map((reg) => {
            const coord = MAP_STATION_COORDS[reg.regionId] || { x: 400, y: 240 };
            const isSelected = reg.regionId === currentRegionId;
            const isHovered = reg.regionId === hoveredRegionId;

            return (
              <g
                key={reg.regionId}
                className="cursor-pointer transition-all group"
                onClick={() => onSelectRegion(reg.regionId)}
                onMouseEnter={() => setHoveredRegionId(reg.regionId)}
                onMouseLeave={() => setHoveredRegionId(null)}
              >
                {/* Active Radar Ripple Rings */}
                {isSelected && (
                  <>
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r="22"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      className="animate-ping opacity-60 origin-center"
                    />
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r="16"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="1.5"
                      opacity="0.8"
                    />
                  </>
                )}

                {/* Base Anchor Circle */}
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={isSelected ? 10 : 7}
                  fill={isSelected ? '#10b981' : reg.outdoorScore >= 75 ? '#10b981' : reg.outdoorScore >= 50 ? '#f59e0b' : '#ef4444'}
                  stroke="#0f172a"
                  strokeWidth="2"
                  filter={isSelected ? 'url(#glow)' : undefined}
                />

                {/* Station Tag Banner Box */}
                <g transform={`translate(${coord.x}, ${coord.y - 14})`}>
                  <rect
                    x="-42"
                    y="-18"
                    width="84"
                    height="18"
                    rx="5"
                    fill={isSelected ? '#020617' : isHovered ? '#1e293b' : '#0f172a'}
                    stroke={isSelected ? '#10b981' : isHovered ? '#64748b' : '#334155'}
                    strokeWidth={isSelected ? 1.5 : 1}
                    className="transition-colors"
                  />
                  <text
                    x="0"
                    y="-6"
                    fill={isSelected ? '#34d399' : '#f8fafc'}
                    fontSize="9.5"
                    fontWeight="700"
                    textAnchor="middle"
                  >
                    {reg.name.split(' ')[0]} {reg.temperature}°
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Live Legend Watermark */}
        <div className="absolute bottom-2 left-2.5 px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-xs border border-slate-800 text-[10px] text-slate-400 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Optimal (75+)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Fair (50–74)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Rain/Poor (&lt;50)</span>
          </div>
        </div>

        {/* Radar Doppler Watermark */}
        <div className="absolute top-2 right-2.5 px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span>Doppler Live</span>
        </div>
      </div>

      {/* Interactive Station Intelligence Drawer Banner */}
      {displayedRegion && (
        <div className="mt-3 p-3.5 rounded-xl bg-slate-800/90 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 flex-shrink-0 flex items-center justify-center">
              <WeatherConditionIcon condition={displayedRegion.condition} size={24} className="text-white" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">
                  {displayedRegion.name}
                </h4>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-slate-700 text-slate-300">
                  {displayedRegion.zone} Region
                </span>
                {displayedRegion.regionId === currentRegionId && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Currently Selected
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300 mt-1">
                <span>Temp: <strong className="text-white font-mono">{displayedRegion.temperature}°C</strong></span>
                <span>•</span>
                <span>Weather: <strong className="text-white">{displayedRegion.condition}</strong></span>
                <span>•</span>
                <span>Outdoor Score: <strong className="text-emerald-400">{displayedRegion.outdoorScore}/100</strong></span>
              </div>

              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {displayedRegion.nowcastVerdict}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {displayedRegion.regionId !== currentRegionId ? (
              <button
                id={`map-select-station-${displayedRegion.regionId}`}
                onClick={() => onSelectRegion(displayedRegion.regionId)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>Switch to {displayedRegion.name}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                <MapPin className="w-3.5 h-3.5" />
                <span>Active Location</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
