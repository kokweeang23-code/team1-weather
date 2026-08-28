import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  ChevronRight,
  TrendingUp,
  Thermometer,
  Droplets,
  Sun,
  Wind,
  Bell,
  Check,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { BestWindowAnalysis, BestWindowReason } from '../types/weather';

interface BestWindowTodayCardProps {
  analysis: BestWindowAnalysis;
  onOpenShareModal?: () => void;
}

export const BestWindowTodayCard: React.FC<BestWindowTodayCardProps> = ({
  analysis,
  onOpenShareModal,
}) => {
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);

  const handleSetReminder = () => {
    setReminderSet(true);
    setTimeout(() => setReminderSet(false), 3000);
  };

  const getReasonIcon = (icon: BestWindowReason['icon']) => {
    switch (icon) {
      case 'thermometer':
        return <Thermometer className="w-3.5 h-3.5 text-amber-500" />;
      case 'droplet':
        return <Droplets className="w-3.5 h-3.5 text-blue-500" />;
      case 'sun':
        return <Sun className="w-3.5 h-3.5 text-amber-400" />;
      case 'wind':
        return <Wind className="w-3.5 h-3.5 text-teal-500" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-indigo-500" />;
    }
  };

  const isNowActive = analysis.timingStatus === 'active_now';

  return (
    <div
      id="best-window-today-card"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-xl border border-slate-700/60 p-4 sm:p-5"
    >
      {/* Decorative ambient subtle background glows */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />

      {/* Top Banner Row */}
      <div className="relative z-10 flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-xs">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                5-Second Decision
              </span>
              <span className="text-[11px] text-slate-400">•</span>
              <span className="text-[11px] text-slate-300 font-medium">
                {analysis.activityName}
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white leading-tight">
              Best Window Today
            </h2>
          </div>
        </div>

        {/* Live Status Pill */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
            isNowActive
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse'
              : 'bg-indigo-500/20 text-indigo-200 border-indigo-400/30'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isNowActive ? 'bg-emerald-400' : 'bg-indigo-400'
            }`}
          />
          <span>{analysis.timingLabel}</span>
        </div>
      </div>

      {/* Hero Window Box */}
      <div className="relative z-10 p-3.5 sm:p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[11px] text-slate-400 font-medium mb-0.5">
            Recommended Departure Window:
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {analysis.timeRange}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {analysis.score}/100 • {analysis.verdict}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {analysis.headline}
          </p>
        </div>

        {/* Delta Comparison badge vs Right Now */}
        <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-slate-700/60 pt-2 sm:pt-0">
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{analysis.comparisonVsNow.verdictDiff}</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Current: {analysis.comparisonVsNow.currentScore}/100
          </div>
        </div>
      </div>

      {/* Key Why Reasons Grid */}
      <div className="relative z-10 mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {analysis.reasons.map((reason) => (
          <div
            key={reason.id}
            className="p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-start gap-2 text-left"
          >
            <div className="p-1 rounded-md bg-slate-700/60 mt-0.5 flex-shrink-0">
              {getReasonIcon(reason.icon)}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">
                {reason.title}
              </div>
              <div className="text-[11px] text-slate-400 leading-snug">
                {reason.detail}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Recommendation & Quick Buttons */}
      <div className="relative z-10 mt-3 pt-3 border-t border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="text-xs text-slate-300 flex-1 leading-relaxed">
          <span className="font-semibold text-emerald-400">Pro Tip: </span>
          {analysis.actionRecommendation}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            id="best-window-reminder-btn"
            onClick={handleSetReminder}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              reminderSet
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white'
            }`}
          >
            {reminderSet ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Reminder Ready</span>
              </>
            ) : (
              <>
                <Bell className="w-3.5 h-3.5" />
                <span>Notify me</span>
              </>
            )}
          </button>

          <button
            id="toggle-alternatives-btn"
            onClick={() => setShowAlternatives(!showAlternatives)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-700/80 hover:bg-slate-700 text-slate-200 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>{showAlternatives ? 'Hide slots' : 'Alternative times'}</span>
            <ChevronRight
              className={`w-3.5 h-3.5 transition-transform ${
                showAlternatives ? 'rotate-90' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Expandable Alternative Slots */}
      {showAlternatives && (
        <div className="relative z-10 mt-3 pt-3 border-t border-slate-700/60 space-y-2 animate-fadeIn">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>Alternative Outdoor Windows</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {analysis.alternatives.map((alt, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">
                    {alt.label}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-700 text-emerald-300">
                    {alt.score}/100
                  </span>
                </div>
                <div className="text-xs font-mono font-semibold text-emerald-400 mb-1">
                  {alt.timeRange}
                </div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  {alt.why}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
