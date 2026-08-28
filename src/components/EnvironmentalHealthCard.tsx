import React, { useState } from 'react';
import { ShieldCheck, Sun, Wind, Activity, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { CurrentWeather } from '../types/weather';

interface EnvironmentalHealthCardProps {
  current: CurrentWeather;
}

export const EnvironmentalHealthCard: React.FC<EnvironmentalHealthCardProps> = ({ current }) => {
  const [showGuidelines, setShowGuidelines] = useState(false);

  // 1. PSI Interpretation
  let psiLabel = 'GOOD';
  let psiBg = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let psiAdvice = 'Air quality is clean and healthy for all outdoor activities.';
  if (current.psi24h > 100) {
    psiLabel = 'UNHEALTHY';
    psiBg = 'bg-rose-50 text-rose-800 border-rose-200';
    psiAdvice = 'Reduce prolonged outdoor exertion; sensitive individuals stay indoors.';
  } else if (current.psi24h > 50) {
    psiLabel = 'MODERATE';
    psiBg = 'bg-amber-50 text-amber-800 border-amber-200';
    psiAdvice = 'Normal outdoor activities safe; mildly sensitive individuals monitor breathing.';
  }

  // 2. 1-hr PM2.5 Interpretation
  let pm25Label = 'NORMAL (BAND I)';
  let pm25Bg = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let pm25Advice = 'No particulate haze hazard detected in the atmosphere.';
  if (current.pm25_1h > 55) {
    pm25Label = 'HIGH (BAND III)';
    pm25Bg = 'bg-rose-50 text-rose-800 border-rose-200';
    pm25Advice = 'Fine particulate concentration elevated; minimize strenuous workouts.';
  } else if (current.pm25_1h > 25) {
    pm25Label = 'ELEVATED (BAND II)';
    pm25Bg = 'bg-amber-50 text-amber-800 border-amber-200';
    pm25Advice = 'Minor haze particles present in air stream.';
  }

  // 3. UV Index Interpretation
  let uvLabel = 'LOW';
  let uvBg = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let uvAdvice = 'Minimal sun protection required; safe for direct skin exposure.';
  if (current.uvIndex >= 11) {
    uvLabel = 'EXTREME';
    uvBg = 'bg-purple-50 text-purple-800 border-purple-200';
    uvAdvice = 'Extreme burn risk in <15 mins. Avoid midday sun, wear SPF 50+ & UV sunglasses.';
  } else if (current.uvIndex >= 8) {
    uvLabel = 'VERY HIGH';
    uvBg = 'bg-rose-50 text-rose-800 border-rose-200';
    uvAdvice = 'Seek shade during peak hours (11 AM – 4 PM). SPF 30+, hat, and UV eyewear recommended.';
  } else if (current.uvIndex >= 6) {
    uvLabel = 'HIGH';
    uvBg = 'bg-amber-50 text-amber-800 border-amber-200';
    uvAdvice = 'High solar exposure. Apply sunscreen and prefer shaded pathways.';
  } else if (current.uvIndex >= 3) {
    uvLabel = 'MODERATE';
    uvBg = 'bg-yellow-50 text-yellow-800 border-yellow-200';
    uvAdvice = 'Moderate UV radiation. Sun protection advised for extended workouts.';
  }

  return (
    <div
      id="environmental-health-section"
      className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              ENVIRONMENTAL HEALTH & SAFETY
            </h3>
            <p className="text-xs text-slate-500">
              Singapore NEA atmospheric readings translated into plain language
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowGuidelines(!showGuidelines)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          {showGuidelines ? 'Hide thresholds' : 'NEA guidelines'}
          {showGuidelines ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* 3 Metric Cards with Human Labels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* PSI */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-700">24-Hr PSI (Pollution)</span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${psiBg}`}>
                {psiLabel}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-2xl font-black font-mono text-slate-900">
                {current.psi24h}
              </span>
              <span className="text-xs text-slate-400">PSI Index</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 leading-tight pt-2 border-t border-slate-200/60">
            {psiAdvice}
          </p>
        </div>

        {/* PM2.5 */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-700">1-Hr PM2.5 (Fine Haze)</span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${pm25Bg}`}>
                {pm25Label}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-2xl font-black font-mono text-slate-900">
                {current.pm25_1h}
              </span>
              <span className="text-xs text-slate-400">µg/m³</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 leading-tight pt-2 border-t border-slate-200/60">
            {pm25Advice}
          </p>
        </div>

        {/* UV Index */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/70 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-700">Solar UV Index</span>
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${uvBg}`}>
                {uvLabel}
              </span>
            </div>

            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-2xl font-black font-mono text-slate-900">
                {current.uvIndex.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">of 15</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 leading-tight pt-2 border-t border-slate-200/60">
            {uvAdvice}
          </p>
        </div>
      </div>

      {/* NEA Threshold Reference Drawer */}
      {showGuidelines && (
        <div className="mt-3 p-3 rounded-xl bg-slate-100 text-xs text-slate-700 space-y-2 animate-fadeIn">
          <div className="font-semibold text-slate-900">Official Singapore National Environmental Standards:</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div>
              <span className="font-bold text-slate-800">PSI Ranges:</span>
              <div>0-50 Good | 51-100 Moderate | 101-200 Unhealthy</div>
            </div>
            <div>
              <span className="font-bold text-slate-800">1-hr PM2.5 Bands:</span>
              <div>0-25 Normal | 26-55 Elevated | 56-150 High</div>
            </div>
            <div>
              <span className="font-bold text-slate-800">UV Scale:</span>
              <div>0-2 Low | 3-5 Moderate | 6-7 High | 8-10 Very High | 11+ Extreme</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
