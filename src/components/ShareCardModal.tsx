import React, { useState } from 'react';
import { X, Copy, Check, Share2, Sparkles, MessageSquare } from 'lucide-react';
import { NormalizedSingaporeWeather, OutdoorScoreResult } from '../types/weather';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  weather: NormalizedSingaporeWeather;
  scoreData: OutdoorScoreResult;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  isOpen,
  onClose,
  weather,
  scoreData,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `🇸🇬 Singapore Weather Intelligence: ${weather.region.name}
🏃 Activity: ${scoreData.activityName} (${scoreData.score}/100 - ${scoreData.verdict})
⏱ Best Window: ${scoreData.bestWindow}
🌦 Conditions: ${weather.current.temperature}°C, ${weather.current.condition} (Feels like ${Math.round(weather.current.feelsLike)}°C)
🌧 Rain Risk: ${scoreData.factors.rainRisk.label} (${weather.current.rainProbability}%)
☀️ UV: ${weather.current.uvIndex.toFixed(1)} (${scoreData.factors.uvExposure.label}) | Air PSI: ${weather.current.psi24h}
💡 Tip: ${scoreData.practicalTip}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-900 text-white">
              <Share2 className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Share Weather Clearance
              </h3>
              <p className="text-xs text-slate-500">
                For running, cycling & outdoor group chats
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Share Card Preview */}
        <div className="p-4">
          <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-semibold text-slate-200">
                  {weather.region.name}, Singapore
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {scoreData.score}/100 • {scoreData.verdict}
              </span>
            </div>

            <div className="my-2">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                {scoreData.activityName} Clearance
              </span>
              <p className="text-sm font-bold text-white leading-snug">
                {scoreData.headline}
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-white/10 border border-white/10 text-xs my-2 flex items-center justify-between">
              <span className="text-slate-300">Best Window:</span>
              <span className="font-bold text-amber-300">{scoreData.bestWindow}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-[10px] text-slate-300 pt-2 border-t border-slate-800">
              <div>
                <span className="text-slate-400 block">Rain Risk</span>
                <span className="font-semibold text-white">{scoreData.factors.rainRisk.label}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Heat Load</span>
                <span className="font-semibold text-white">{scoreData.factors.heatStress.label}</span>
              </div>
              <div>
                <span className="text-slate-400 block">UV Radiation</span>
                <span className="font-semibold text-white">{scoreData.factors.uvExposure.label}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-mono whitespace-pre-line">
            {shareText}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary for WhatsApp/Telegram'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
