import React, { useState } from 'react';
import {
  MapPin,
  ChevronDown,
  RefreshCw,
  Sliders,
  Sparkles,
  Share2,
  Navigation,
  Compass,
} from 'lucide-react';
import { SingaporeRegion } from '../types/weather';
import { WeatherScenarioId } from '../services/mockWeatherService';

interface HeaderProps {
  region: SingaporeRegion;
  lastUpdated: string;
  onOpenLocationModal: () => void;
  onOpenScenarioModal: () => void;
  onRefresh: () => void;
  currentScenario: WeatherScenarioId;
  onOpenShareModal: () => void;
  onRequestGPSLocation?: () => void;
  isLocatingGPS?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  region,
  lastUpdated,
  onOpenLocationModal,
  onOpenScenarioModal,
  onRefresh,
  currentScenario,
  onOpenShareModal,
  onRequestGPSLocation,
  isLocatingGPS = false,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40">
      <div className="max-w-3xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        {/* Left: Location Selector */}
        <button
          id="header-location-btn"
          onClick={onOpenLocationModal}
          className="flex items-center gap-2 group text-left p-1 -ml-1 rounded-xl hover:bg-slate-100/70 transition-colors"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-900 text-white shadow-xs">
            <MapPin className="w-4 h-4 text-emerald-400" />
          </div>

          <div>
            <div className="flex items-center gap-1">
              <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                {region.name}, SG
              </span>
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform group-hover:translate-y-0.5" />
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>NEA Live Feed</span>
              <span>•</span>
              <span>{region.zone} Zone</span>
            </div>
          </div>
        </button>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* One-Tap GPS Near Me */}
          {onRequestGPSLocation && (
            <button
              id="header-gps-near-me-btn"
              onClick={onRequestGPSLocation}
              disabled={isLocatingGPS}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100 disabled:opacity-60 transition-colors"
              title="Detect nearest Singapore weather station using GPS"
            >
              <Navigation
                className={`w-3.5 h-3.5 ${
                  isLocatingGPS ? 'animate-spin text-emerald-600' : 'text-emerald-600'
                }`}
              />
              <span className="hidden sm:inline">
                {isLocatingGPS ? 'Locating...' : 'Near Me'}
              </span>
            </button>
          )}

          {/* Scenario simulator tester badge */}
          <button
            id="scenario-simulator-btn"
            onClick={onOpenScenarioModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/70 hover:bg-indigo-100 transition-colors"
            title="Test different Singapore weather scenarios"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Scenario Sim</span>
          </button>

          {/* Share */}
          <button
            id="header-share-btn"
            onClick={onOpenShareModal}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 transition-colors"
            title="Share current outdoor forecast"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Refresh */}
          <button
            id="header-refresh-btn"
            onClick={handleRefreshClick}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 transition-colors"
            title="Refresh weather data"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`}
            />
          </button>
        </div>
      </div>
    </header>
  );
};

