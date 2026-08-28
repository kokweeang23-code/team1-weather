import React from 'react';
import {
  Sun,
  SunMedium,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudDrizzle,
  Wind,
  Moon,
  CloudMoon,
  EyeOff,
} from 'lucide-react';
import { WeatherCondition } from '../types/weather';

interface WeatherConditionIconProps {
  condition: WeatherCondition | string;
  className?: string;
  size?: number;
  isDaytime?: boolean;
}

export const WeatherConditionIcon: React.FC<WeatherConditionIconProps> = ({
  condition,
  className = 'w-6 h-6',
  size,
  isDaytime = true,
}) => {
  const condLower = condition.toLowerCase();

  if (condLower.includes('thunder') || condLower.includes('lightning')) {
    return <CloudLightning className={`text-amber-500 ${className}`} size={size} />;
  }

  if (condLower.includes('heavy rain')) {
    return <CloudRain className={`text-blue-600 ${className}`} size={size} />;
  }

  if (condLower.includes('rain') || condLower.includes('showers')) {
    return <CloudDrizzle className={`text-sky-500 ${className}`} size={size} />;
  }

  if (condLower.includes('hazy') || condLower.includes('mist') || condLower.includes('fog')) {
    return <EyeOff className={`text-slate-400 ${className}`} size={size} />;
  }

  if (condLower.includes('partly cloudy')) {
    return isDaytime ? (
      <CloudSun className={`text-amber-500 ${className}`} size={size} />
    ) : (
      <CloudMoon className={`text-indigo-400 ${className}`} size={size} />
    );
  }

  if (condLower.includes('cloudy')) {
    return <Cloud className={`text-slate-400 ${className}`} size={size} />;
  }

  if (condLower.includes('night') || !isDaytime) {
    return <Moon className={`text-indigo-400 ${className}`} size={size} />;
  }

  return <Sun className={`text-amber-500 ${className}`} size={size} />;
};
