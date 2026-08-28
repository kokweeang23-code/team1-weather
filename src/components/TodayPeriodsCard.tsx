import React from 'react';
import { Calendar, Droplets, Clock3 } from 'lucide-react';
import { DayPeriodForecast } from '../types/weather';
import { WeatherConditionIcon } from './WeatherConditionIcon';

interface TodayPeriodsCardProps {
  dayPeriods: DayPeriodForecast[];
}

export const TodayPeriodsCard: React.FC<TodayPeriodsCardProps> = ({ dayPeriods }) => {
  return (
    <div
      id="today-periods-section"
      className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600">
            <Clock3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              TODAY (24-HOUR OUTLOOK)
            </h3>
            <p className="text-xs text-slate-500">
              Singapore Meteorological Service 4-period model
            </p>
          </div>
        </div>

        <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          NEA Format
        </span>
      </div>

      {/* 4 Periods Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {dayPeriods.map((period) => {
          const isNight = period.periodId === 'night';
          const isEvening = period.periodId === 'evening';

          let comfortBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          if (period.outdoorComfort === 'Caution') {
            comfortBadge = 'bg-rose-50 text-rose-700 border-rose-200';
          } else if (period.outdoorComfort === 'Moderate') {
            comfortBadge = 'bg-amber-50 text-amber-700 border-amber-200';
          }

          return (
            <div
              key={period.periodId}
              id={`period-card-${period.periodId}`}
              className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-800">
                    {period.periodLabel}
                  </span>
                  <span
                    className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border ${comfortBadge}`}
                  >
                    {period.outdoorComfort}
                  </span>
                </div>

                <span className="text-[10px] text-slate-400 block mb-2 font-mono">
                  {period.timeRange}
                </span>

                <div className="flex items-center gap-2 mb-2">
                  <WeatherConditionIcon
                    condition={period.condition}
                    size={22}
                    isDaytime={!isNight}
                  />
                  <span className="text-xs font-medium text-slate-700 leading-tight">
                    {period.condition}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900">
                  {period.tempMin}° – {period.tempMax}°C
                </span>
                <span className="flex items-center gap-0.5 text-[11px] text-blue-600 font-medium">
                  <Droplets className="w-3 h-3" />
                  {period.rainChance}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
