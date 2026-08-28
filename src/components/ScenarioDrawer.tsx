import React from 'react';
import { Sliders, Check, Sparkles, RefreshCw, X } from 'lucide-react';
import { WeatherScenarioId, WEATHER_SCENARIOS } from '../services/mockWeatherService';

interface ScenarioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentScenario: WeatherScenarioId;
  onSelectScenario: (scenario: WeatherScenarioId) => void;
  onReset: () => void;
}

export const ScenarioDrawer: React.FC<ScenarioDrawerProps> = ({
  isOpen,
  onClose,
  currentScenario,
  onSelectScenario,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Weather Scenario Simulator
              </h3>
              <p className="text-xs text-slate-500">
                Test prototype response across Singapore weather conditions
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

        {/* Scenarios list */}
        <div className="p-4 space-y-2.5 overflow-y-auto">
          {WEATHER_SCENARIOS.map((scen) => {
            const isSelected = currentScenario === scen.id;

            return (
              <button
                key={scen.id}
                onClick={() => {
                  onSelectScenario(scen.id);
                  onClose();
                }}
                className={`w-full p-3.5 rounded-xl border text-left flex items-start justify-between gap-3 transition-all ${
                  isSelected
                    ? 'bg-indigo-50/80 border-indigo-500 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900">
                      {scen.name}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {scen.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {scen.description}
                  </p>
                </div>

                {isSelected && (
                  <div className="p-1 rounded-full bg-indigo-600 text-white flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              onReset();
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset to Live Tanjong Pagar Baseline</span>
          </button>
          <span className="text-[11px] text-slate-400">MVP Evaluator Mode</span>
        </div>
      </div>
    </div>
  );
};
