import React, { useState } from 'react';
import {
  Clock,
  Radar,
  Droplets,
  AlertCircle,
  CheckCircle2,
  TrendingDown,
  Sparkles,
} from 'lucide-react';
import { Nowcast2Hour, NowcastSlot } from '../types/weather';
import { WeatherConditionIcon } from './WeatherConditionIcon';

interface NowcastTimelineProps {
  nowcast: Nowcast2Hour;
  selectedLocationName: string;
}

export const NowcastTimeline: React.FC<NowcastTimelineProps> = ({
  nowcast,
  selectedLocationName,
}) => {
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);
  const activeSlot = nowcast.slots[selectedSlotIndex] || nowcast.slots[0];

  return (
    <div
      id="nowcast-2hour-section"
      className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 text-blue-600">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                NEXT 2 HOURS (NOWCAST)
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 uppercase">
                Hyper-Local
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Expected conditions around {selectedLocationName}
            </p>
          </div>
        </div>

        {/* Rain status badge */}
        <div className="flex items-center gap-1 text-xs font-semibold">
          {nowcast.rainExpectedInNext2Hours ? (
            <span className="flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              <AlertCircle className="w-3.5 h-3.5" />
              Shower Possible
            </span>
          ) : (
            <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Dry Window
            </span>
          )}
        </div>
      </div>

      {/* Immediate 2-Hour Summary Headline */}
      <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
        <Radar className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <span className="font-semibold text-slate-900">RADAR INSIGHT:</span> {nowcast.summary}
        </div>
      </div>

      {/* Horizontal 15-Min Timeline */}
      <div className="relative">
        <div className="flex items-stretch gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {nowcast.slots.map((slot, index) => {
            const isSelected = selectedSlotIndex === index;
            const isOptimalWindow = index >= 2 && index <= 6 && !nowcast.rainExpectedInNext2Hours;

            let rainColor = 'text-slate-400';
            let rainBarBg = 'bg-slate-200';
            if (slot.rainProbability >= 60) {
              rainColor = 'text-rose-600 font-bold';
              rainBarBg = 'bg-rose-500';
            } else if (slot.rainProbability >= 30) {
              rainColor = 'text-amber-600 font-bold';
              rainBarBg = 'bg-amber-500';
            } else if (slot.rainProbability >= 15) {
              rainColor = 'text-blue-500';
              rainBarBg = 'bg-blue-400';
            }

            return (
              <button
                key={slot.time}
                id={`nowcast-slot-${index}`}
                onClick={() => setSelectedSlotIndex(index)}
                className={`relative flex-shrink-0 w-20 flex flex-col items-center p-2.5 rounded-xl border transition-all duration-200 text-center ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-500 ring-2 ring-blue-500/20 shadow-xs'
                    : isOptimalWindow
                    ? 'bg-emerald-50/40 border-emerald-200 hover:bg-emerald-50/80'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {/* Optimal window badge for slot */}
                {isOptimalWindow && index === 2 && (
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full whitespace-nowrap shadow-2xs">
                    BEST
                  </span>
                )}

                <span className="text-[11px] font-semibold text-slate-700 mb-1.5">
                  {slot.time}
                </span>

                <div className="my-1">
                  <WeatherConditionIcon condition={slot.condition} size={22} />
                </div>

                <span className="text-xs font-bold text-slate-900 mt-1">
                  {slot.temp}°C
                </span>

                {/* Rain Probability Mini Bar */}
                <div className="w-full mt-2 pt-2 border-t border-slate-100 flex flex-col items-center gap-1">
                  <div className="flex items-center gap-0.5 text-[10px]">
                    <Droplets className="w-2.5 h-2.5 text-blue-500" />
                    <span className={rainColor}>{slot.rainProbability}%</span>
                  </div>

                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${rainBarBg} rounded-full`}
                      style={{ width: `${Math.min(100, Math.max(8, slot.rainProbability))}%` }}
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Slot Detailed Strip */}
      {activeSlot && (
        <div className="mt-2 p-3 rounded-xl bg-slate-100/70 border border-slate-200/60 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">{activeSlot.time}:</span>
            <span className="text-slate-600 font-medium">{activeSlot.condition}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600">Rain risk: {activeSlot.rainProbability}%</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500">Slot Score:</span>
            <span
              className={`font-bold px-2 py-0.5 rounded-md ${
                activeSlot.outdoorScore >= 75
                  ? 'bg-emerald-100 text-emerald-800'
                  : activeSlot.outdoorScore >= 50
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}
            >
              {activeSlot.outdoorScore}/100
            </span>
          </div>
        </div>
      )}

      {/* Rain Trajectory Footer */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <span className="truncate max-w-[80%]">
          📡 {nowcast.radarTrajectory}
        </span>
        <span className="text-blue-600 font-semibold cursor-pointer hover:underline flex-shrink-0">
          MSS Radar
        </span>
      </div>
    </div>
  );
};
