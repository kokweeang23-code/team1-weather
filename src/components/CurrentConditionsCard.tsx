import React from 'react';
import {
  Thermometer,
  Droplets,
  CloudRain,
  Wind,
  Sun,
  Shield,
  Compass,
} from 'lucide-react';
import { CurrentWeather, SingaporeRegion } from '../types/weather';
import { WeatherConditionIcon } from './WeatherConditionIcon';

interface CurrentConditionsCardProps {
  current: CurrentWeather;
  region: SingaporeRegion;
}

export const CurrentConditionsCard: React.FC<CurrentConditionsCardProps> = ({
  current,
  region,
}) => {
  return (
    <div
      id="current-conditions-card"
      className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5"
    >
      {/* Top Section: Hero Temp + Condition */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black text-slate-900 font-mono tracking-tight">
              {current.temperature.toFixed(1)}°
            </span>
            <span className="text-sm font-semibold text-slate-500">
              Feels like {Math.round(current.feelsLike)}°C
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-bold text-slate-800">
              {current.condition}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">
              {region.name} ({region.zone} Region)
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-100">
          <WeatherConditionIcon
            condition={current.condition}
            size={36}
            isDaytime={current.isDaytime}
          />
          <span className="text-[10px] font-bold text-slate-500 uppercase mt-1">
            {current.isDaytime ? 'Day' : 'Night'}
          </span>
        </div>
      </div>

      {/* Grid of Weather Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4">
        {/* Humidity */}
        <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Humidity
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900">
              {current.relativeHumidity}%
            </span>
          </div>
        </div>

        {/* Rainfall */}
        <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
            <CloudRain className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Rainfall
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900">
              {current.rainfallRate > 0 ? `${current.rainfallRate} mm/h` : '0.0 mm/h'}
            </span>
          </div>
        </div>

        {/* Wind Speed & Direction */}
        <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-teal-50 text-teal-600">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Wind
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900">
              {current.windSpeed} km/h {current.windDirection}
            </span>
          </div>
        </div>

        {/* UV & Air Health Quick Badge */}
        <div className="p-2.5 rounded-xl bg-slate-50/70 border border-slate-100 flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              UV / PSI
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900">
              UV {current.uvIndex.toFixed(1)} • PSI {current.psi24h}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
