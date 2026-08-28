import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ActivityId,
  ApiSyncRecord,
  GeolocationState,
  NormalizedSingaporeWeather,
  SingaporeRegionId,
} from './types/weather';
import {
  getSingaporeWeatherData,
  SINGAPORE_REGIONS,
  WeatherScenarioId,
} from './services/mockWeatherService';
import {
  calculateOutdoorScore,
  calculateBestWindowAnalysis,
} from './services/decisionEngine';
import { getGPSLocation } from './services/geolocationService';
import {
  getInitialSyncHistory,
  recordNewSync,
} from './services/apiSyncService';

import { Header } from './components/Header';
import { WeatherAlertBanner } from './components/WeatherAlertBanner';
import { ActivitySelector } from './components/ActivitySelector';
import { BestWindowTodayCard } from './components/BestWindowTodayCard';
import { OutdoorScoreCard } from './components/OutdoorScoreCard';
import { NowcastTimeline } from './components/NowcastTimeline';
import { CurrentConditionsCard } from './components/CurrentConditionsCard';
import { EnvironmentalHealthCard } from './components/EnvironmentalHealthCard';
import { TodayPeriodsCard } from './components/TodayPeriodsCard';
import { FourDayOutlookCard } from './components/FourDayOutlookCard';
import { AroundSingaporeMicroclimate } from './components/AroundSingaporeMicroclimate';
import { ApiSyncHistoryCard } from './components/ApiSyncHistoryCard';
import { LocationSelectorModal } from './components/LocationSelectorModal';
import { ScenarioDrawer } from './components/ScenarioDrawer';
import { ShareCardModal } from './components/ShareCardModal';
import { Info, Sparkles, MapPin, RefreshCw, Navigation, CheckCircle2, X } from 'lucide-react';

export default function App() {
  // 1. Core State
  const [selectedRegionId, setSelectedRegionId] = useState<SingaporeRegionId>('tanjong_pagar');
  const [selectedActivity, setSelectedActivity] = useState<ActivityId>('running');
  const [currentScenario, setCurrentScenario] = useState<WeatherScenarioId>('realistic_afternoon');
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>([]);

  // 2. Geolocation State
  const [geolocationState, setGeolocationState] = useState<GeolocationState>({
    status: 'idle',
    coords: null,
    nearestRegion: null,
    distanceKm: null,
    errorMessage: null,
  });
  const [isLocatingGPS, setIsLocatingGPS] = useState(false);
  const [gpsNotification, setGpsNotification] = useState<string | null>(null);

  // 3. Modals State
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // 4. API Sync History State (Keeps the last 10 records)
  const [syncHistory, setSyncHistory] = useState<ApiSyncRecord[]>(() =>
    getInitialSyncHistory('Tanjong Pagar')
  );
  const [isSyncing, setIsSyncing] = useState(false);

  // 5. Normalized Weather Data
  const weatherData: NormalizedSingaporeWeather = useMemo(() => {
    return getSingaporeWeatherData(selectedRegionId, currentScenario);
  }, [selectedRegionId, currentScenario]);

  // 6. Decision Intelligence Calculation
  const outdoorScoreResult = useMemo(() => {
    return calculateOutdoorScore(weatherData.current, weatherData.nowcast, selectedActivity);
  }, [weatherData, selectedActivity]);

  // 7. Best Window Today Calculation
  const bestWindowResult = useMemo(() => {
    return calculateBestWindowAnalysis(
      weatherData.current,
      weatherData.nowcast,
      weatherData.dayPeriods,
      selectedActivity,
      weatherData.region.name
    );
  }, [weatherData, selectedActivity]);

  // Filter alerts that user hasn't dismissed
  const visibleAlerts = useMemo(() => {
    return weatherData.alerts.filter((alert) => !dismissedAlertIds.includes(alert.id));
  }, [weatherData.alerts, dismissedAlertIds]);

  const handleDismissAlert = (id: string) => {
    setDismissedAlertIds((prev) => [...prev, id]);
  };

  const handleManualApiSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setSyncHistory((prev) =>
        recordNewSync(prev, 'Manual Sync', weatherData.region.name)
      );
      setIsSyncing(false);
    }, 450);
  };

  const handleRefresh = () => {
    setDismissedAlertIds([]);
    setSyncHistory((prev) =>
      recordNewSync(prev, 'Manual Refresh', weatherData.region.name)
    );
  };

  const handleSelectRegion = (id: SingaporeRegionId) => {
    setSelectedRegionId(id);
    const reg = SINGAPORE_REGIONS[id];
    setSyncHistory((prev) =>
      recordNewSync(prev, 'Location Change', reg ? reg.name : id)
    );
  };

  const handleSelectScenario = (scen: WeatherScenarioId) => {
    setCurrentScenario(scen);
    setSyncHistory((prev) =>
      recordNewSync(prev, 'Scenario Switch', weatherData.region.name)
    );
  };

  const handleResetBaseline = () => {
    setSelectedRegionId('tanjong_pagar');
    setCurrentScenario('realistic_afternoon');
    setSelectedActivity('running');
    setDismissedAlertIds([]);
    setGpsNotification(null);
    setSyncHistory((prev) =>
      recordNewSync(prev, 'Initial Load', 'Tanjong Pagar')
    );
  };

  // GPS Auto-Detection Handler
  const handleRequestGPS = async () => {
    setIsLocatingGPS(true);
    setGpsNotification(null);
    try {
      const geo = await getGPSLocation();
      setGeolocationState(geo);

      if (geo.nearestRegion) {
        setSelectedRegionId(geo.nearestRegion.id);
        const distStr = geo.distanceKm !== null ? `(${geo.distanceKm} km away)` : '';
        setGpsNotification(`📍 Matched nearest weather station: ${geo.nearestRegion.name} ${distStr}`);
        setSyncHistory((prev) =>
          recordNewSync(prev, 'GPS Location', geo.nearestRegion!.name)
        );
      } else if (geo.errorMessage) {
        setGpsNotification(`⚠️ ${geo.errorMessage}`);
      }
    } catch {
      setGpsNotification('Could not retrieve current location.');
    } finally {
      setIsLocatingGPS(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Mobile-first sticky header */}
      <Header
        region={weatherData.region}
        lastUpdated={weatherData.lastUpdated}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenScenarioModal={() => setIsScenarioModalOpen(true)}
        onRefresh={handleRefresh}
        currentScenario={currentScenario}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onRequestGPSLocation={handleRequestGPS}
        isLocatingGPS={isLocatingGPS}
      />

      {/* Main Container - Mobile Centered Column with responsive width */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-4 sm:py-6 space-y-4">
        {/* GPS Notification Toast Banner */}
        {gpsNotification && (
          <div className="p-3 rounded-xl bg-emerald-900 text-emerald-100 text-xs flex items-center justify-between gap-2 shadow-sm animate-fadeIn border border-emerald-700/60">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{gpsNotification}</span>
            </div>
            <button
              onClick={() => setGpsNotification(null)}
              className="p-1 hover:bg-emerald-800 rounded-md text-emerald-300 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Active Weather Alerts (if any) */}
        <WeatherAlertBanner
          alerts={visibleAlerts}
          onDismiss={handleDismissAlert}
        />

        {/* 1. Activity Mode Selector (Changes weights and recommendations) */}
        <ActivitySelector
          selectedActivity={selectedActivity}
          onSelectActivity={setSelectedActivity}
          current={weatherData.current}
          nowcast={weatherData.nowcast}
        />

        {/* 2. INSTANT 5-SECOND DECISION: Best Window Today Smart Recommendation */}
        <BestWindowTodayCard
          analysis={bestWindowResult}
          onOpenShareModal={() => setIsShareModalOpen(true)}
        />

        {/* 3. DECISION INTELLIGENCE: Outdoor Activity Score & Metrics Breakdown */}
        <OutdoorScoreCard
          scoreData={outdoorScoreResult}
          onOpenShareModal={() => setIsShareModalOpen(true)}
        />

        {/* 4. NEXT 2 HOURS NOWCAST: 15-min Intervals & Rain Radar Trajectory */}
        <NowcastTimeline
          nowcast={weatherData.nowcast}
          selectedLocationName={weatherData.region.name}
        />

        {/* 5. CURRENT CONDITIONS: Clutter-free metrics */}
        <CurrentConditionsCard
          current={weatherData.current}
          region={weatherData.region}
        />

        {/* 6. ENVIRONMENTAL HEALTH & SAFETY: PSI, PM2.5, UV in human labels */}
        <EnvironmentalHealthCard
          current={weatherData.current}
        />

        {/* 7. TODAY (24-Hour Outlook by Singapore Periods) */}
        <TodayPeriodsCard
          dayPeriods={weatherData.dayPeriods}
        />

        {/* 8. NEXT 4 DAYS OUTLOOK: Compact trend */}
        <FourDayOutlookCard
          fourDayOutlook={weatherData.fourDayOutlook}
        />

        {/* 9. SINGAPORE MICROCLIMATE: Around Singapore regional comparison */}
        <AroundSingaporeMicroclimate
          regions={weatherData.allRegions}
          currentRegionId={selectedRegionId}
          onSelectRegion={handleSelectRegion}
        />

        {/* 10. API DATA SYNC HISTORY: Last 10 Data Syncs Record Card */}
        <ApiSyncHistoryCard
          syncHistory={syncHistory}
          onTriggerSync={handleManualApiSync}
          isSyncing={isSyncing}
        />

        {/* Product Architectural Footer Note */}
        <footer className="pt-6 pb-8 text-center text-xs text-slate-400 space-y-2 border-t border-slate-200/80 mt-8">
          <div className="flex items-center justify-center gap-1.5 font-semibold text-slate-600">
            <span>Singapore Weather Intelligence MVP</span>
            <span>•</span>
            <span>v1.2 Live Telemetry</span>
          </div>
          <p className="max-w-md mx-auto leading-relaxed text-[11px]">
            Designed for 5–10s outdoor decisions with hyper-local GPS detection and real-time microclimate intelligence.
          </p>
          <div className="flex items-center justify-center gap-3 pt-1 text-[11px] text-blue-600 font-medium">
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="hover:underline"
            >
              Change Location
            </button>
            <span>•</span>
            <button
              onClick={handleRequestGPS}
              className="hover:underline flex items-center gap-1"
            >
              <Navigation className="w-3 h-3" />
              <span>Use GPS</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsScenarioModalOpen(true)}
              className="hover:underline"
            >
              Simulate Weather
            </button>
            <span>•</span>
            <button
              onClick={handleResetBaseline}
              className="hover:underline"
            >
              Reset Tanjong Pagar
            </button>
          </div>
        </footer>
      </main>

      {/* Supporting Modals & Drawers */}
      <LocationSelectorModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentRegionId={selectedRegionId}
        onSelectRegion={handleSelectRegion}
        onRequestGPSLocation={handleRequestGPS}
        geolocationState={geolocationState}
        isLocatingGPS={isLocatingGPS}
      />

      <ScenarioDrawer
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
        currentScenario={currentScenario}
        onSelectScenario={handleSelectScenario}
        onReset={handleResetBaseline}
      />

      <ShareCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        weather={weatherData}
        scoreData={outdoorScoreResult}
      />
    </div>
  );
}

