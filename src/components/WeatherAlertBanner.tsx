import React from 'react';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';
import { WeatherAlert } from '../types/weather';

interface WeatherAlertBannerProps {
  alerts: WeatherAlert[];
  onDismiss?: (id: string) => void;
}

export const WeatherAlertBanner: React.FC<WeatherAlertBannerProps> = ({ alerts, onDismiss }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="w-full space-y-2 mb-4">
      {alerts.map((alert) => {
        const isSevere = alert.severity === 'severe' || alert.severity === 'warning';

        return (
          <div
            key={alert.id}
            id={`alert-${alert.id}`}
            className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 shadow-xs ${
              isSevere
                ? 'bg-amber-500/10 border-amber-300 text-amber-950'
                : 'bg-blue-500/10 border-blue-200 text-blue-950'
            }`}
          >
            <div className="flex items-start gap-2.5">
              <div
                className={`p-1.5 rounded-lg flex-shrink-0 mt-0.5 ${
                  isSevere ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
                }`}
              >
                {isSevere ? <AlertTriangle className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-bold uppercase tracking-wide">
                    {alert.title}
                  </span>
                  <span className="text-[10px] font-medium px-1.5 py-0.2 rounded-md bg-white/70 border border-current/20">
                    Valid till {alert.validUntil}
                  </span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed">
                  {alert.message}
                </p>
              </div>
            </div>

            {onDismiss && (
              <button
                onClick={() => onDismiss(alert.id)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-black/5"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};
