import React, { useState } from 'react';
import {
  Sparkles,
  Clock,
  ChevronDown,
  ChevronUp,
  Info,
  Droplets,
  Flame,
  Sun,
  Wind,
  ShieldCheck,
  Share2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { OutdoorScoreResult } from '../types/weather';

interface OutdoorScoreCardProps {
  scoreData: OutdoorScoreResult;
  onOpenShareModal?: () => void;
}

export const OutdoorScoreCard: React.FC<OutdoorScoreCardProps> = ({
  scoreData,
  onOpenShareModal,
}) => {
  const [showFactorDetails, setShowFactorDetails] = useState(false);

  const getScoreTheme = (score: number) => {
    if (score >= 80) {
      return {
        bgGradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
        borderColor: 'border-emerald-200',
        ringColor: 'text-emerald-600',
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        glow: 'shadow-emerald-500/10',
        barColor: 'bg-emerald-500',
      };
    }
    if (score >= 65) {
      return {
        bgGradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
        borderColor: 'border-teal-200',
        ringColor: 'text-teal-600',
        badgeBg: 'bg-teal-100 text-teal-800 border-teal-300',
        glow: 'shadow-teal-500/10',
        barColor: 'bg-teal-500',
      };
    }
    if (score >= 50) {
      return {
        bgGradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
        borderColor: 'border-amber-200',
        ringColor: 'text-amber-600',
        badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
        glow: 'shadow-amber-500/10',
        barColor: 'bg-amber-500',
      };
    }
    return {
      bgGradient: 'from-rose-500/10 via-rose-500/5 to-transparent',
      borderColor: 'border-rose-200',
      ringColor: 'text-rose-600',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
      glow: 'shadow-rose-500/10',
      barColor: 'bg-rose-500',
    };
  };

  const theme = getScoreTheme(scoreData.score);
  const factorKeys = [
    {
      key: 'rainRisk',
      label: 'Rain Risk',
      icon: Droplets,
      data: scoreData.factors.rainRisk,
    },
    {
      key: 'heatStress',
      label: 'Heat Stress',
      icon: Flame,
      data: scoreData.factors.heatStress,
    },
    {
      key: 'uvExposure',
      label: 'UV Radiation',
      icon: Sun,
      data: scoreData.factors.uvExposure,
    },
    {
      key: 'airQuality',
      label: 'Air Quality',
      icon: ShieldCheck,
      data: scoreData.factors.airQuality,
    },
    {
      key: 'windFactor',
      label: 'Wind',
      icon: Wind,
      data: scoreData.factors.windFactor,
    },
  ];

  return (
    <div
      id="outdoor-score-card"
      className={`relative overflow-hidden rounded-2xl bg-white border ${theme.borderColor} shadow-lg ${theme.glow} p-5 transition-all duration-300`}
    >
      {/* Background Subtle Gradient Glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${theme.bgGradient} pointer-events-none opacity-80`}
      />

      {/* Top Header Row */}
      <div className="relative z-10 flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-900 text-white shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Decision Intelligence
            </span>
            <h2 className="text-sm font-semibold text-slate-900 leading-tight">
              Outdoor Activity Score
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenShareModal && (
            <button
              id="share-score-btn"
              onClick={onOpenShareModal}
              title="Share weather status to workout chat"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Score & Verdict Hero */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-4">
          {/* Circular Score Visual Display */}
          <div className="relative flex-shrink-0 flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-900 text-white shadow-md">
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold tracking-tight font-mono text-white leading-none">
                {scoreData.score}
              </span>
              <span className="text-[10px] font-medium text-slate-400 mt-0.5 uppercase tracking-wider">
                / 100
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wide ${theme.badgeBg}`}
              >
                {scoreData.verdict}
              </span>
              <span className="text-xs font-medium text-slate-500">
                for {scoreData.activityName}
              </span>
            </div>
            <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {scoreData.headline}
            </p>
          </div>
        </div>
      </div>

      {/* Actionable Recommendation: Best Outdoor Window Banner */}
      <div className="relative z-10 mt-4 p-3.5 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-medium uppercase tracking-wider text-slate-300 block">
              Optimal Outdoor Window
            </span>
            <span className="text-sm font-bold text-white tracking-wide">
              {scoreData.bestWindow}
            </span>
          </div>
        </div>

        {scoreData.secondaryWindow && (
          <div className="text-[11px] text-slate-300 sm:text-right border-t sm:border-t-0 border-slate-700 pt-2 sm:pt-0">
            <span className="text-slate-400">Alternative: </span>
            <span className="font-semibold text-slate-200">{scoreData.secondaryWindow}</span>
          </div>
        )}
      </div>

      {/* Activity-Specific Context Recommendation */}
      <div className="relative z-10 mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
        <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed">
          <span className="font-semibold text-slate-900">
            {scoreData.activityName.toUpperCase()} RECOM:
          </span>{' '}
          {scoreData.activityRecommendation}
        </div>
      </div>

      {/* Decision Factor Breakdown ("Why") */}
      <div className="relative z-10 mt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Conditions Breakdown
          </span>
          <button
            onClick={() => setShowFactorDetails(!showFactorDetails)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            {showFactorDetails ? 'Hide details' : 'View metrics'}
            {showFactorDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {factorKeys.map(({ key, label, icon: Icon, data }) => {
            const getStatusColor = (status: string) => {
              if (status === 'positive') return 'text-emerald-700 bg-emerald-50 border-emerald-200';
              if (status === 'warning') return 'text-amber-700 bg-amber-50 border-amber-200';
              return 'text-rose-700 bg-rose-50 border-rose-200';
            };

            return (
              <div
                key={key}
                id={`factor-${key}`}
                className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium">{label}</span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md border ${getStatusColor(
                      data.status
                    )}`}
                  >
                    {data.label}
                  </span>
                </div>

                {showFactorDetails && (
                  <div className="mt-2 pt-2 border-t border-slate-200 text-[10px] text-slate-500 leading-tight">
                    {data.rawDisplay}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Expanded Educational Explanation */}
        {showFactorDetails && (
          <div className="mt-3 p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-blue-900 space-y-1.5 animate-fadeIn">
            <div className="flex items-center gap-1.5 font-semibold">
              <Info className="w-3.5 h-3.5 text-blue-600" />
              <span>Singapore Environmental Assessment Logic</span>
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              In Singapore's tropical climate, ambient temperature alone does not reflect physical strain.
              The Outdoor Score models combined thermal load (Wet-Bulb Globe Index approximation factoring 70%+ relative humidity),
              Doppler radar rain trajectory, solar UV radiation index, and 1-hour PM2.5 concentrations.
            </p>
          </div>
        )}
      </div>

      {/* Practical Micro-tip */}
      {scoreData.practicalTip && (
        <div className="relative z-10 mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="italic">💡 {scoreData.practicalTip}</span>
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider ml-2 flex-shrink-0">
            NEA Data Derived
          </span>
        </div>
      )}
    </div>
  );
};
