import React, { useState } from 'react';
import {
  X,
  Search,
  MapPin,
  Check,
  Sparkles,
  Navigation,
  Compass,
  AlertCircle,
} from 'lucide-react';
import {
  SingaporeRegion,
  SingaporeRegionId,
  SingaporeZone,
  GeolocationState,
} from '../types/weather';
import { SINGAPORE_REGIONS } from '../services/mockWeatherService';

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRegionId: SingaporeRegionId;
  onSelectRegion: (id: SingaporeRegionId) => void;
  onRequestGPSLocation?: () => void;
  geolocationState?: GeolocationState;
  isLocatingGPS?: boolean;
}

export const LocationSelectorModal: React.FC<LocationSelectorModalProps> = ({
  isOpen,
  onClose,
  currentRegionId,
  onSelectRegion,
  onRequestGPSLocation,
  geolocationState,
  isLocatingGPS = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<SingaporeZone | 'All'>('All');

  if (!isOpen) return null;

  const regionsList = Object.values(SINGAPORE_REGIONS);

  const filteredRegions = regionsList.filter((reg) => {
    const matchesZone = selectedZone === 'All' || reg.zone === selectedZone;
    const matchesSearch =
      reg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.popularSpots.some((spot) =>
        spot.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesZone && matchesSearch;
  });

  const zones: Array<SingaporeZone | 'All'> = [
    'All',
    'South',
    'Central',
    'East',
    'West',
    'North',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-900 text-white">
              <MapPin className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Select Singapore Location
              </h3>
              <p className="text-xs text-slate-500">
                Singapore hyper-local microclimate weather stations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Auto-Detect Banner */}
        {onRequestGPSLocation && (
          <div className="px-4 pt-3 pb-1 border-b border-slate-100 bg-slate-50/70">
            <div className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/80 flex items-center justify-center flex-shrink-0">
                  <Navigation
                    className={`w-4 h-4 ${
                      isLocatingGPS ? 'animate-spin text-emerald-600' : ''
                    }`}
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>GPS Auto-Detection</span>
                    {geolocationState?.status === 'success' && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {isLocatingGPS ? (
                      'Acquiring coordinates & matching nearest subzone...'
                    ) : geolocationState?.status === 'success' &&
                      geolocationState.nearestRegion ? (
                      <span>
                        Nearest: <strong className="text-slate-800">{geolocationState.nearestRegion.name}</strong> ({geolocationState.distanceKm} km away)
                      </span>
                    ) : geolocationState?.errorMessage ? (
                      <span className="text-rose-600">
                        {geolocationState.errorMessage}
                      </span>
                    ) : (
                      'Instantly switch to your closest Singapore microclimate station'
                    )}
                  </div>
                </div>
              </div>

              <button
                id="modal-detect-gps-btn"
                onClick={onRequestGPSLocation}
                disabled={isLocatingGPS}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-60 transition-colors flex-shrink-0"
              >
                {isLocatingGPS
                  ? 'Locating...'
                  : geolocationState?.status === 'success'
                  ? 'Re-detect'
                  : 'Use My GPS'}
              </button>
            </div>
          </div>
        )}

        {/* Search Input & Zone Filters */}
        <div className="p-4 border-b border-slate-100 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search area (e.g. Tanjong Pagar, Punggol, ECP, Bedok)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900"
            />
          </div>

          {/* Zone Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {zones.map((zone) => (
              <button
                key={zone}
                onClick={() => setSelectedZone(zone)}
                className={`text-xs px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedZone === zone
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {zone}
              </button>
            ))}
          </div>
        </div>

        {/* Regions List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1">
          {filteredRegions.map((region) => {
            const isSelected = region.id === currentRegionId;

            return (
              <button
                key={region.id}
                onClick={() => {
                  onSelectRegion(region.id);
                  onClose();
                }}
                className={`w-full p-3 rounded-xl border text-left flex items-start justify-between gap-3 transition-all ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-500 ring-2 ring-blue-500/20'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-slate-900">
                      {region.name}
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-slate-100 text-slate-600">
                      {region.zone} Region
                    </span>
                    {region.id === 'tanjong_pagar' && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800">
                        Default Baseline Area
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 mb-1.5">
                    {region.shortDesc}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {region.popularSpots.map((spot) => (
                      <span
                        key={spot}
                        className="text-[10px] text-slate-600 bg-slate-100/80 px-1.5 py-0.5 rounded-sm"
                      >
                        {spot}
                      </span>
                    ))}
                  </div>
                </div>

                {isSelected && (
                  <div className="p-1 rounded-full bg-blue-600 text-white flex-shrink-0 mt-1">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}

          {filteredRegions.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs">
              No matching Singapore locations found.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Singapore Government NEA Microclimate Network</span>
          <span className="font-semibold text-slate-700">{regionsList.length} Active Stations</span>
        </div>
      </div>
    </div>
  );
};

