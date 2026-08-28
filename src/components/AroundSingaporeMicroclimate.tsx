import React, { useState } from 'react';
import {
  MapPin,
  ArrowRight,
  Compass,
  ShieldAlert,
  Sparkles,
  Map,
  LayoutGrid,
} from 'lucide-react';
import { MicroclimateSummary, SingaporeRegionId } from '../types/weather';
import { WeatherConditionIcon } from './WeatherConditionIcon';
import { SingaporeMicroclimateMap } from './SingaporeMicroclimateMap';

interface AroundSingaporeMicroclimateProps {
  regions: MicroclimateSummary[];
  currentRegionId: SingaporeRegionId;
  onSelectRegion: (regionId: SingaporeRegionId) => void;
}

export const AroundSingaporeMicroclimate: React.FC<AroundSingaporeMicroclimateProps> = ({
  regions,
  currentRegionId,
  onSelectRegion,
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map');

  return (
    <div
      id="around-singapore-section"
      className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 space-y-4"
    >
      {/* Header with View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                AROUND SINGAPORE (MICROCLIMATES)
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                Islandwide Radar
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Microclimate conditions across Singapore planning zones
            </p>
          </div>
        </div>

        {/* View Switcher: Interactive Map vs Grid */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            id="microclimate-toggle-map-btn"
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === 'map'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Map className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interactive Map</span>
          </button>

          <button
            id="microclimate-toggle-grid-btn"
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-blue-600" />
            <span>Card Grid</span>
          </button>
        </div>
      </div>

      {/* Microclimate Reality Notice */}
      <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-emerald-900 leading-relaxed">
          <span className="font-semibold">Microclimate Tip:</span> Singapore tropical showers frequently isolate over specific zones (e.g. West Jurong or Central Bukit Timah) while East Coast, Changi, and Marina Bay enjoy clear sunshine and coastal breezes.
        </p>
      </div>

      {/* Interactive SVG Map View */}
      {viewMode === 'map' ? (
        <SingaporeMicroclimateMap
          regions={regions}
          currentRegionId={currentRegionId}
          onSelectRegion={onSelectRegion}
        />
      ) : (
        /* Grid of Singapore Microclimates */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {regions.map((reg) => {
            const isCurrent = reg.regionId === currentRegionId;

            let scoreBadge = 'bg-emerald-100 text-emerald-800 border-emerald-200';
            if (reg.outdoorScore < 50) {
              scoreBadge = 'bg-rose-100 text-rose-800 border-rose-200';
            } else if (reg.outdoorScore < 70) {
              scoreBadge = 'bg-amber-100 text-amber-800 border-amber-200';
            }

            return (
              <button
                key={reg.regionId}
                id={`microclimate-card-${reg.regionId}`}
                onClick={() => onSelectRegion(reg.regionId)}
                className={`p-3.5 rounded-xl border text-left transition-all duration-200 relative ${
                  isCurrent
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-slate-900/10'
                    : 'bg-slate-50/80 hover:bg-white hover:border-slate-300 border-slate-200/80 text-slate-800'
                }`}
              >
                {isCurrent && (
                  <span className="absolute top-2.5 right-2.5 text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-blue-500 text-white">
                    Active Area
                  </span>
                )}

                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <MapPin
                        className={`w-3.5 h-3.5 ${
                          isCurrent ? 'text-emerald-400' : 'text-slate-400'
                        }`}
                      />
                      <span
                        className={`text-xs font-bold ${
                          isCurrent ? 'text-white' : 'text-slate-900'
                        }`}
                      >
                        {reg.name}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                          isCurrent
                            ? 'bg-white/10 text-slate-300'
                            : 'bg-slate-200/80 text-slate-600'
                        }`}
                      >
                        {reg.zone}
                      </span>
                    </div>
                  </div>

                  {!isCurrent && (
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full border ${scoreBadge}`}
                    >
                      Score {reg.outdoorScore}
                    </span>
                  )}
                </div>

                {/* Weather & Temp */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <WeatherConditionIcon
                      condition={reg.condition}
                      size={20}
                      className={isCurrent ? 'text-white' : undefined}
                    />
                    <span
                      className={`text-xs font-medium ${
                        isCurrent ? 'text-slate-200' : 'text-slate-700'
                      }`}
                    >
                      {reg.condition}
                    </span>
                  </div>

                  <span
                    className={`text-xs font-bold font-mono ${
                      isCurrent ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {reg.temperature}°C
                  </span>
                </div>

                {/* Local verdict */}
                <p
                  className={`text-[11px] leading-tight line-clamp-2 ${
                    isCurrent ? 'text-slate-300' : 'text-slate-500'
                  }`}
                >
                  {reg.nowcastVerdict}
                </p>

                {reg.activeAlert && (
                  <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center gap-1 text-[10px] font-bold text-amber-400">
                    <ShieldAlert className="w-3 h-3" />
                    <span>{reg.activeAlert}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

