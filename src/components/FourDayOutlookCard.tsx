import React from 'react';
import { CalendarDays, Droplets, ArrowUpRight } from 'lucide-react';
import { DailyForecast } from '../types/weather';
import { WeatherConditionIcon } from './WeatherConditionIcon';

interface FourDayOutlookCardProps {
  fourDayOutlook: DailyForecast[];
}

export const FourDayOutlookCard: React.FC<FourDayOutlookCardProps> = ({ fourDayOutlook }) => {
  return (
    <div
      id="four-day-outlook-section"
      className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-50 text-teal-600">
            <CalendarDays className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              NEXT 4 DAYS OUTLOOK
            </h3>
            <p className="text-xs text-slate-500">
              Singapore islandwide trend
            </p>
          </div>
        </div>

        <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          4-Day Model
        </span>
      </div>

      {/* 4-Day Compact Grid / List */}
      <div className="space-y-2">
        {fourDayOutlook.map((day) => {
          let suitBg = 'text-emerald-700 bg-emerald-50 border-emerald-200';
          if (day.outdoorSuitability === 'Moderate') suitBg = 'text-amber-700 bg-amber-50 border-amber-200';
          if (day.outdoorSuitability === 'Poor') suitBg = 'text-rose-700 bg-rose-50 border-rose-200';

          return (
            <div
              key={day.date}
              id={`forecast-day-${day.date}`}
              className="p-3 rounded-xl bg-slate-50/70 hover:bg-slate-50 border border-slate-200/70 transition-colors flex items-center justify-between gap-3"
            >
              {/* Day & Date */}
              <div className="w-24 flex-shrink-0">
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  {day.dayName}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {day.formattedDate}
                </span>
              </div>

              {/* Condition Icon & Label */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <WeatherConditionIcon condition={day.condition} size={22} />
                <div className="min-w-0">
                  <span className="text-xs font-semibold text-slate-800 truncate block">
                    {day.condition}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate block">
                    {day.rainOutlook}
                  </span>
                </div>
              </div>

              {/* Rain Chance */}
              <div className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 w-14 justify-end flex-shrink-0">
                <Droplets className="w-3 h-3 text-blue-500" />
                <span>{day.rainChance}%</span>
              </div>

              {/* Temp Range Bar */}
              <div className="text-right w-20 flex-shrink-0">
                <div className="text-xs font-bold text-slate-900 font-mono">
                  {day.tempMin}° <span className="text-slate-400 font-normal">/</span> {day.tempMax}°C
                </div>
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-full border inline-block mt-0.5 ${suitBg}`}
                >
                  {day.outdoorSuitability}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
