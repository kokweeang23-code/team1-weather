export type SingaporeRegionId =
  | 'tanjong_pagar'
  | 'orchard'
  | 'bishan'
  | 'jurong'
  | 'east_coast'
  | 'changi'
  | 'woodlands'
  | 'sentosa'
  | 'marina_bay'
  | 'punggol'
  | 'bedok'
  | 'bukit_timah'
  | 'yishun'
  | 'tampines';

export type SingaporeZone = 'Central' | 'North' | 'South' | 'East' | 'West';

export interface SingaporeRegion {
  id: SingaporeRegionId;
  name: string;
  zone: SingaporeZone;
  shortDesc: string;
  popularSpots: string[];
  lat: number;
  lng: number;
}

export type ActivityId =
  | 'running'
  | 'cycling'
  | 'walking'
  | 'tennis'
  | 'golf'
  | 'dining'
  | 'kids';

export interface ActivityProfile {
  id: ActivityId;
  name: string;
  iconName: string;
  shortLabel: string;
  description: string;
  optimalTempRange: [number, number]; // in Celsius
  maxWindSpeed: number; // in km/h
  rainSensitivity: 'very_high' | 'high' | 'moderate' | 'low';
  uvSensitivity: 'very_high' | 'high' | 'moderate' | 'low';
  heatSensitivity: 'very_high' | 'high' | 'moderate' | 'low';
}

export interface BestWindowAlternative {
  label: string;
  timeRange: string;
  score: number;
  condition: string;
  temp: string;
  why: string;
}

export interface BestWindowReason {
  id: string;
  icon: 'thermometer' | 'droplet' | 'sun' | 'wind' | 'clock' | 'shield';
  title: string;
  detail: string;
  positive: boolean;
}

export interface BestWindowAnalysis {
  activityId: ActivityId;
  activityName: string;
  regionName: string;
  timeRange: string;
  durationLabel: string;
  timingStatus: 'active_now' | 'starting_soon' | 'later_today' | 'tomorrow_morning';
  timingLabel: string;
  score: number;
  verdict: 'IDEAL' | 'GREAT' | 'GOOD' | 'FAIR';
  headline: string;
  reasons: BestWindowReason[];
  forecastSnapshot: {
    temp: string;
    feelsLike: string;
    rainProbability: string;
    uvIndex: string;
    condition: WeatherCondition;
  };
  comparisonVsNow: {
    currentScore: number;
    scoreDelta: number;
    verdictDiff: string;
  };
  alternatives: BestWindowAlternative[];
  actionRecommendation: string;
}

export interface GeolocationState {
  status: 'idle' | 'locating' | 'success' | 'permission_denied' | 'unavailable' | 'outside_singapore';
  coords: { lat: number; lng: number; accuracy?: number } | null;
  nearestRegion: SingaporeRegion | null;
  distanceKm: number | null;
  errorMessage: string | null;
  lastUpdated?: string;
}


export type WeatherCondition =
  | 'Fair (Day)'
  | 'Fair (Night)'
  | 'Partly Cloudy'
  | 'Cloudy'
  | 'Hazy'
  | 'Light Rain'
  | 'Moderate Rain'
  | 'Heavy Rain'
  | 'Passing Showers'
  | 'Thundery Showers'
  | 'Heavy Thundery Showers';

export interface CurrentWeather {
  temperature: number; // °C
  feelsLike: number; // °C
  relativeHumidity: number; // %
  rainfallRate: number; // mm/h
  rainProbability: number; // %
  windSpeed: number; // km/h
  windDirection: string; // "SSW", "NE", etc.
  windDirectionDeg: number;
  uvIndex: number;
  psi24h: number;
  pm25_1h: number; // µg/m³
  condition: WeatherCondition;
  conditionDescription: string;
  timestamp: string; // ISO or formatted
  isDaytime: boolean;
}

export interface NowcastSlot {
  time: string; // "5:00 PM"
  relativeMinutes: number; // 0, 15, 30, 45, 60, 75, 90, 105, 120
  condition: WeatherCondition;
  rainProbability: number; // 0 - 100%
  radarIntensity: 'none' | 'light' | 'moderate' | 'heavy';
  outdoorScore: number; // 0 - 100
  temp: number;
}

export interface Nowcast2Hour {
  summary: string;
  rainExpectedInNext2Hours: boolean;
  rainOnsetMinute?: number;
  radarTrajectory: string;
  slots: NowcastSlot[];
  optimalSubWindow?: {
    start: string;
    end: string;
    reason: string;
  };
}

export interface FactorScore {
  name: string;
  label: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Extreme' | 'Good' | 'Fair' | 'Light' | 'Breezy' | 'Gusty';
  rawDisplay: string;
  score: number; // 0 - 100 (100 is best for activity)
  status: 'positive' | 'warning' | 'alert';
  detail: string;
}

export interface OutdoorScoreResult {
  score: number; // 0 - 100
  verdict: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'FAIR' | 'POOR';
  verdictColor: 'emerald' | 'amber' | 'orange' | 'rose';
  headline: string;
  activityRecommendation: string;
  activityName: string;
  bestWindow: string;
  secondaryWindow?: string;
  keyLimitingFactor?: string;
  practicalTip: string;
  factors: {
    rainRisk: FactorScore;
    heatStress: FactorScore;
    uvExposure: FactorScore;
    airQuality: FactorScore;
    windFactor: FactorScore;
  };
}

export interface DayPeriodForecast {
  periodId: 'morning' | 'afternoon' | 'evening' | 'night';
  periodLabel: string; // "Morning (6 AM – 12 PM)"
  timeRange: string;
  condition: WeatherCondition;
  tempMin: number;
  tempMax: number;
  rainChance: number;
  humidityRange: string;
  outdoorComfort: 'Good' | 'Moderate' | 'Fair' | 'Caution';
}

export interface DailyForecast {
  date: string; // "2026-08-27"
  dayName: string; // "Tomorrow", "Fri", "Sat", "Sun"
  formattedDate: string; // "27 Aug"
  condition: WeatherCondition;
  tempMin: number;
  tempMax: number;
  rainChance: number;
  rainOutlook: 'Isolated Showers' | 'Passing Showers' | 'Late Afternoon Storm' | 'Mostly Dry' | 'Scattered Showers';
  outdoorSuitability: 'Excellent' | 'Good' | 'Moderate' | 'Poor';
}

export interface MicroclimateSummary {
  regionId: SingaporeRegionId;
  name: string;
  zone: SingaporeZone;
  temperature: number;
  condition: WeatherCondition;
  rainChance: number;
  outdoorScore: number;
  nowcastVerdict: string;
  activeAlert?: string;
}

export interface WeatherAlert {
  id: string;
  severity: 'advisory' | 'warning' | 'severe';
  title: string;
  message: string;
  affectedRegions: SingaporeRegionId[] | 'islandwide';
  validUntil: string;
}

export interface NormalizedSingaporeWeather {
  region: SingaporeRegion;
  lastUpdated: string;
  current: CurrentWeather;
  nowcast: Nowcast2Hour;
  dayPeriods: DayPeriodForecast[];
  fourDayOutlook: DailyForecast[];
  alerts: WeatherAlert[];
  allRegions: MicroclimateSummary[];
}

export interface ApiSyncRecord {
  id: string;
  timestamp: string; // ISO string
  formattedDate: string; // "27 Aug 2026"
  formattedTime: string; // "06:13:41 PM"
  relativeTime: string; // "Just now" or "2m ago"
  status: 'success' | 'cached' | 'syncing' | 'error';
  statusCode: number; // 200, 304, etc.
  endpoint: string; // "api.data.gov.sg/v1/environment/..."
  source: string; // "NEA & MSS Open Data API"
  trigger: 'Initial Load' | 'Manual Refresh' | 'Location Change' | 'Scenario Switch' | 'GPS Location' | 'Auto-Sync' | 'Manual Sync';
  durationMs: number;
  payloadSizeKb: number;
  itemsSynced: number;
  regionName: string;
  details?: string;
}
