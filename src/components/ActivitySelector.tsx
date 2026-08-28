import React from 'react';
import {
  Footprints,
  Bike,
  Smile,
  CircleDot,
  Flag,
  Utensils,
  Users,
} from 'lucide-react';
import { ActivityId, CurrentWeather, Nowcast2Hour } from '../types/weather';
import { calculateOutdoorScore, ACTIVITY_PROFILES } from '../services/decisionEngine';

interface ActivitySelectorProps {
  selectedActivity: ActivityId;
  onSelectActivity: (id: ActivityId) => void;
  current: CurrentWeather;
  nowcast: Nowcast2Hour;
}

const getActivityIcon = (id: ActivityId, className: string = 'w-4 h-4') => {
  switch (id) {
    case 'running':
      return <Footprints className={className} />;
    case 'cycling':
      return <Bike className={className} />;
    case 'walking':
      return <Smile className={className} />;
    case 'tennis':
      return <CircleDot className={className} />;
    case 'golf':
      return <Flag className={className} />;
    case 'dining':
      return <Utensils className={className} />;
    case 'kids':
      return <Users className={className} />;
    default:
      return <Footprints className={className} />;
  }
};

export const ActivitySelector: React.FC<ActivitySelectorProps> = ({
  selectedActivity,
  onSelectActivity,
  current,
  nowcast,
}) => {
  const activityList: ActivityId[] = [
    'running',
    'cycling',
    'walking',
    'tennis',
    'golf',
    'dining',
    'kids',
  ];

  return (
    <div id="activity-selector-section" className="w-full">
      <div className="flex items-center justify-between mb-2 px-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Target Activity Mode
        </span>
        <span className="text-xs text-slate-400">
          Adapts score & windows
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
        {activityList.map((actId) => {
          const profile = ACTIVITY_PROFILES[actId];
          const isSelected = selectedActivity === actId;
          const scoreResult = calculateOutdoorScore(current, nowcast, actId);

          let scoreBadgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
          if (scoreResult.score < 50) {
            scoreBadgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
          } else if (scoreResult.score < 70) {
            scoreBadgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
          }

          return (
            <button
              key={actId}
              id={`activity-btn-${actId}`}
              onClick={() => onSelectActivity(actId)}
              className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2.5 rounded-xl border transition-all duration-200 text-left ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-slate-900/10'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50/70'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg ${
                  isSelected ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {getActivityIcon(actId, 'w-4 h-4')}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold whitespace-nowrap">
                    {profile.shortLabel}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full border ${
                      isSelected
                        ? 'bg-white/20 text-white border-white/30'
                        : scoreBadgeBg
                    }`}
                  >
                    {scoreResult.score}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
