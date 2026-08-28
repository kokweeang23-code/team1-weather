import {
  CurrentWeather,
  DailyForecast,
  DayPeriodForecast,
  MicroclimateSummary,
  NormalizedSingaporeWeather,
  Nowcast2Hour,
  NowcastSlot,
  SingaporeRegion,
  SingaporeRegionId,
  WeatherAlert,
} from '../types/weather';

export const SINGAPORE_REGIONS: Record<SingaporeRegionId, SingaporeRegion> = {
  tanjong_pagar: {
    id: 'tanjong_pagar',
    name: 'Tanjong Pagar',
    zone: 'South',
    shortDesc: 'CBD & Southern Historic District',
    popularSpots: ['Rail Corridor South', 'Duxton Plain Park', 'Anson Road', 'Tanjong Pagar Plaza'],
    lat: 1.2764,
    lng: 103.8446,
  },
  orchard: {
    id: 'orchard',
    name: 'Orchard',
    zone: 'Central',
    shortDesc: 'Central Urban Boulevard & Tanglin',
    popularSpots: ['Orchard Road', 'Somerset Skatepark', 'Emerald Hill', 'Fort Canning Link'],
    lat: 1.3048,
    lng: 103.8318,
  },
  bishan: {
    id: 'bishan',
    name: 'Bishan',
    zone: 'Central',
    shortDesc: 'Central Parklands & Kallang River Basin',
    popularSpots: ['Bishan-Ang Mo Kio Park', 'Kallang River Trail', 'Bishan Stadium', 'MacRitchie Reservoir Entry'],
    lat: 1.3526,
    lng: 103.8352,
  },
  jurong: {
    id: 'jurong',
    name: 'Jurong',
    zone: 'West',
    shortDesc: 'Western Lake District & Jurong East',
    popularSpots: ['Jurong Lake Gardens', 'Chinese Garden', 'Pandan Reservoir', 'Jurong Eco-Garden'],
    lat: 1.3329,
    lng: 103.7436,
  },
  east_coast: {
    id: 'east_coast',
    name: 'East Coast',
    zone: 'East',
    shortDesc: 'Coastal Park Connector & Marine Parade',
    popularSpots: ['East Coast Park (ECP)', 'Park Connector Network', 'Bedok Jetty', 'Katong / Joo Chiat'],
    lat: 1.3044,
    lng: 103.9056,
  },
  changi: {
    id: 'changi',
    name: 'Changi',
    zone: 'East',
    shortDesc: 'Eastern Coastline & Changi Village',
    popularSpots: ['Changi Boardwalk', 'Changi Beach Park', 'Tanah Merah Coast Road', 'Jewel / Airport Precinct'],
    lat: 1.3644,
    lng: 103.9915,
  },
  woodlands: {
    id: 'woodlands',
    name: 'Woodlands',
    zone: 'North',
    shortDesc: 'Northern Waterfront & Causeway Belt',
    popularSpots: ['Woodlands Waterfront Park', 'Admiralty Park', 'Marsiling Park'],
    lat: 1.4382,
    lng: 103.7891,
  },
  sentosa: {
    id: 'sentosa',
    name: 'Sentosa',
    zone: 'South',
    shortDesc: 'Southern Island & Coastal Resorts',
    popularSpots: ['Palawan Beach', 'Siloso Trail', 'Tanjong Beach Club', 'Sentosa Boardwalk'],
    lat: 1.2494,
    lng: 103.8303,
  },
  marina_bay: {
    id: 'marina_bay',
    name: 'Marina Bay',
    zone: 'South',
    shortDesc: 'Bayfront Promenade & Gardens',
    popularSpots: ['Marina Bay Waterfront Promenade', 'Gardens by the Bay', 'Helix Bridge', 'Marina Barrage'],
    lat: 1.2838,
    lng: 103.8591,
  },
  punggol: {
    id: 'punggol',
    name: 'Punggol',
    zone: 'North',
    shortDesc: 'Waterfront Promenade & Coney Island Gateway',
    popularSpots: ['Punggol Waterway Park', 'Coney Island', 'Punggol Settlement', 'Northshore PCN'],
    lat: 1.4053,
    lng: 103.9023,
  },
  bedok: {
    id: 'bedok',
    name: 'Bedok',
    zone: 'East',
    shortDesc: 'Eastern Reservoir & Park Connectors',
    popularSpots: ['Bedok Reservoir Park', 'Bedok Town Park', 'Bedok PCN', 'Siglap Canal Path'],
    lat: 1.3236,
    lng: 103.9273,
  },
  bukit_timah: {
    id: 'bukit_timah',
    name: 'Bukit Timah',
    zone: 'Central',
    shortDesc: 'Nature Reserve & Green Rail Corridor',
    popularSpots: ['Bukit Timah Nature Reserve', 'Rail Corridor Central', 'Hindhede Park', 'Rifle Range Nature Park'],
    lat: 1.3547,
    lng: 103.7764,
  },
  yishun: {
    id: 'yishun',
    name: 'Yishun',
    zone: 'North',
    shortDesc: 'Lower Seletar Basin & Northern PCN',
    popularSpots: ['Lower Seletar Reservoir Park', 'Yishun Pond Park', 'Yishun Dam', 'Khatib Park Connector'],
    lat: 1.4294,
    lng: 103.8350,
  },
  tampines: {
    id: 'tampines',
    name: 'Tampines',
    zone: 'East',
    shortDesc: 'Regional Eco Green & Urban Trails',
    popularSpots: ['Tampines Eco Green', 'Tampines Quarry Park', 'Sun Plaza Park', 'Tampines Boulevard'],
    lat: 1.3525,
    lng: 103.9447,
  },
};

export type WeatherScenarioId = 'realistic_afternoon' | 'rainy_west_storm' | 'sunny_clear_weekend' | 'hazy_afternoon';

export interface ScenarioDefinition {
  id: WeatherScenarioId;
  name: string;
  badge: string;
  description: string;
}

export const WEATHER_SCENARIOS: ScenarioDefinition[] = [
  {
    id: 'realistic_afternoon',
    name: 'Typical SG Afternoon (Fair with Evening Cool)',
    badge: 'Live Baseline',
    description: '31.4°C, 74% humidity, UV 7.8 tapering, dry in Tanjong Pagar while passing showers stay in the West.',
  },
  {
    id: 'rainy_west_storm',
    name: 'Tropical Downpour & Passing Shower',
    badge: 'Rain Front Active',
    description: 'Passing thundery cell developing over Central-South, 75% rain probability for the next 45 mins.',
  },
  {
    id: 'sunny_clear_weekend',
    name: 'Breezy Dry Window',
    badge: 'High Outdoor Score',
    description: 'Clear sunny sky, 29.5°C, fresh 18 km/h coastal breeze, great for cycling and dining.',
  },
  {
    id: 'hazy_afternoon',
    name: 'Elevated PSI / Haze Advisory',
    badge: 'Air Quality Alert',
    description: 'Moderate southwest transboundary haze, PSI 88, PM2.5 38 µg/m³, UV 8.4.',
  },
];

/**
 * Generate 2-Hour Nowcast Slots (9 intervals of 15 minutes = 2 hours)
 */
function generateNowcastSlots(baseTemp: number, scenario: WeatherScenarioId): NowcastSlot[] {
  const currentHour = 17; // 5:00 PM prototype reference
  const slots: NowcastSlot[] = [];

  const intervalLabels = [
    '5:00 PM',
    '5:15 PM',
    '5:30 PM',
    '5:45 PM',
    '6:00 PM',
    '6:15 PM',
    '6:30 PM',
    '6:45 PM',
    '7:00 PM',
  ];

  intervalLabels.forEach((time, index) => {
    const mins = index * 15;
    let rainProb = 15;
    let condition: CurrentWeather['condition'] = 'Partly Cloudy';
    let radarIntensity: NowcastSlot['radarIntensity'] = 'none';
    let temp = baseTemp - index * 0.2; // gradual cooling towards dusk
    let outdoorScore = 78;

    if (scenario === 'realistic_afternoon') {
      if (mins < 30) {
        rainProb = 20;
        condition = 'Partly Cloudy';
        radarIntensity = 'none';
        outdoorScore = 72; // warm sun
      } else if (mins <= 90) {
        rainProb = 10;
        condition = 'Fair (Day)';
        radarIntensity = 'none';
        outdoorScore = 84; // optimal window
      } else {
        rainProb = 10;
        condition = 'Fair (Night)';
        radarIntensity = 'none';
        outdoorScore = 88; // dusk
      }
    } else if (scenario === 'rainy_west_storm') {
      if (mins < 45) {
        rainProb = 75;
        condition = 'Passing Showers';
        radarIntensity = 'moderate';
        outdoorScore = 38;
      } else if (mins < 75) {
        rainProb = 45;
        condition = 'Light Rain';
        radarIntensity = 'light';
        outdoorScore = 55;
      } else {
        rainProb = 15;
        condition = 'Cloudy';
        radarIntensity = 'none';
        outdoorScore = 76; // post-rain cool
      }
    } else if (scenario === 'sunny_clear_weekend') {
      rainProb = 5;
      condition = mins >= 75 ? 'Fair (Night)' : 'Fair (Day)';
      radarIntensity = 'none';
      outdoorScore = mins >= 45 ? 90 : 82;
    } else {
      // Hazy
      rainProb = 10;
      condition = 'Hazy';
      radarIntensity = 'none';
      outdoorScore = 52;
    }

    slots.push({
      time,
      relativeMinutes: mins,
      condition,
      rainProbability: rainProb,
      radarIntensity,
      outdoorScore,
      temp: Math.round(temp * 10) / 10,
    });
  });

  return slots;
}

/**
 * Generates 24-Hour Day Periods (Morning, Afternoon, Evening, Night)
 */
function generateDayPeriods(scenario: WeatherScenarioId): DayPeriodForecast[] {
  return [
    {
      periodId: 'morning',
      periodLabel: 'Morning',
      timeRange: '6:00 AM – 12:00 PM',
      condition: 'Fair (Day)',
      tempMin: 26,
      tempMax: 30,
      rainChance: 15,
      humidityRange: '80% – 68%',
      outdoorComfort: 'Good',
    },
    {
      periodId: 'afternoon',
      periodLabel: 'Afternoon',
      timeRange: '12:00 PM – 6:00 PM',
      condition: scenario === 'rainy_west_storm' ? 'Thundery Showers' : 'Partly Cloudy',
      tempMin: 31,
      tempMax: 33,
      rainChance: scenario === 'rainy_west_storm' ? 75 : 30,
      humidityRange: '65% – 75%',
      outdoorComfort: scenario === 'rainy_west_storm' ? 'Caution' : 'Moderate',
    },
    {
      periodId: 'evening',
      periodLabel: 'Evening',
      timeRange: '6:00 PM – 10:00 PM',
      condition: 'Fair (Night)',
      tempMin: 28,
      tempMax: 30,
      rainChance: 10,
      humidityRange: '72% – 82%',
      outdoorComfort: 'Good',
    },
    {
      periodId: 'night',
      periodLabel: 'Night',
      timeRange: '10:00 PM – 6:00 AM',
      condition: 'Fair (Night)',
      tempMin: 25,
      tempMax: 27,
      rainChance: 5,
      humidityRange: '82% – 90%',
      outdoorComfort: 'Good',
    },
  ];
}

/**
 * Generates Singapore 4-Day Weather Outlook
 */
function generateFourDayOutlook(): DailyForecast[] {
  return [
    {
      date: '2026-08-27',
      dayName: 'Tomorrow',
      formattedDate: 'Thu, 27 Aug',
      condition: 'Passing Showers',
      tempMin: 25,
      tempMax: 32,
      rainChance: 45,
      rainOutlook: 'Late Afternoon Storm',
      outdoorSuitability: 'Good',
    },
    {
      date: '2026-08-28',
      dayName: 'Friday',
      formattedDate: 'Fri, 28 Aug',
      condition: 'Partly Cloudy',
      tempMin: 26,
      tempMax: 33,
      rainChance: 25,
      rainOutlook: 'Isolated Showers',
      outdoorSuitability: 'Excellent',
    },
    {
      date: '2026-08-29',
      dayName: 'Saturday',
      formattedDate: 'Sat, 29 Aug',
      condition: 'Fair (Day)',
      tempMin: 26,
      tempMax: 32,
      rainChance: 20,
      rainOutlook: 'Mostly Dry',
      outdoorSuitability: 'Excellent',
    },
    {
      date: '2026-08-30',
      dayName: 'Sunday',
      formattedDate: 'Sun, 30 Aug',
      condition: 'Thundery Showers',
      tempMin: 25,
      tempMax: 31,
      rainChance: 60,
      rainOutlook: 'Scattered Showers',
      outdoorSuitability: 'Moderate',
    },
  ];
}

/**
 * Builds regional microclimate summaries across Singapore to demonstrate geographic weather differences.
 */
function generateMicroclimateSummaries(scenario: WeatherScenarioId): MicroclimateSummary[] {
  return [
    {
      regionId: 'tanjong_pagar',
      name: 'Tanjong Pagar',
      zone: 'South',
      temperature: 31.4,
      condition: 'Partly Cloudy',
      rainChance: 15,
      outdoorScore: 78,
      nowcastVerdict: 'Dry & warm; prime evening window approaching at 5:30 PM.',
    },
    {
      regionId: 'orchard',
      name: 'Orchard',
      zone: 'Central',
      temperature: 32.1,
      condition: 'Cloudy',
      rainChance: 35,
      outdoorScore: 71,
      nowcastVerdict: 'Warm urban canyon; cloud cover thickening overhead.',
    },
    {
      regionId: 'bishan',
      name: 'Bishan',
      zone: 'Central',
      temperature: 30.8,
      condition: 'Passing Showers',
      rainChance: 55,
      outdoorScore: 64,
      nowcastVerdict: 'Scattered light shower passing over parklands; clearing in 20 min.',
    },
    {
      regionId: 'jurong',
      name: 'Jurong',
      zone: 'West',
      temperature: 29.2,
      condition: 'Thundery Showers',
      rainChance: 80,
      outdoorScore: 42,
      nowcastVerdict: 'Active inland convective storm; heavy localized rain.',
      activeAlert: 'Heavy Rain Warning (West)',
    },
    {
      regionId: 'east_coast',
      name: 'East Coast',
      zone: 'East',
      temperature: 30.2,
      condition: 'Fair (Day)',
      rainChance: 10,
      outdoorScore: 86,
      nowcastVerdict: 'Fresh coastal sea breeze (16 km/h); optimal running and cycling.',
    },
    {
      regionId: 'changi',
      name: 'Changi',
      zone: 'East',
      temperature: 30.5,
      condition: 'Fair (Day)',
      rainChance: 10,
      outdoorScore: 88,
      nowcastVerdict: 'Clear coastal horizon; high visibility and dry tarmac.',
    },
    {
      regionId: 'woodlands',
      name: 'Woodlands',
      zone: 'North',
      temperature: 30.0,
      condition: 'Partly Cloudy',
      rainChance: 40,
      outdoorScore: 69,
      nowcastVerdict: 'Moderate cloud cover over Straits; low immediate rain risk.',
    },
    {
      regionId: 'sentosa',
      name: 'Sentosa',
      zone: 'South',
      temperature: 31.8,
      condition: 'Fair (Day)',
      rainChance: 15,
      outdoorScore: 82,
      nowcastVerdict: 'Sunny coastal conditions; high UV index requires sun protection.',
    },
    {
      regionId: 'marina_bay',
      name: 'Marina Bay',
      zone: 'South',
      temperature: 31.2,
      condition: 'Partly Cloudy',
      rainChance: 15,
      outdoorScore: 80,
      nowcastVerdict: 'Steady waterfront breeze; great conditions along the promenade.',
    },
    {
      regionId: 'punggol',
      name: 'Punggol',
      zone: 'North',
      temperature: 30.6,
      condition: 'Partly Cloudy',
      rainChance: 20,
      outdoorScore: 81,
      nowcastVerdict: 'Pleasant waterfront breeze along Serangoon reservoir.',
    },
    {
      regionId: 'bedok',
      name: 'Bedok',
      zone: 'East',
      temperature: 30.8,
      condition: 'Fair (Day)',
      rainChance: 15,
      outdoorScore: 85,
      nowcastVerdict: 'Dry tracks around Bedok Reservoir; optimal for evening run.',
    },
    {
      regionId: 'bukit_timah',
      name: 'Bukit Timah',
      zone: 'Central',
      temperature: 29.8,
      condition: 'Cloudy',
      rainChance: 35,
      outdoorScore: 74,
      nowcastVerdict: 'Cooler canopy temperatures along Rail Corridor Central.',
    },
    {
      regionId: 'yishun',
      name: 'Yishun',
      zone: 'North',
      temperature: 30.9,
      condition: 'Partly Cloudy',
      rainChance: 25,
      outdoorScore: 77,
      nowcastVerdict: 'Mild northern breeze with low shower risk over Lower Seletar.',
    },
    {
      regionId: 'tampines',
      name: 'Tampines',
      zone: 'East',
      temperature: 31.0,
      condition: 'Fair (Day)',
      rainChance: 15,
      outdoorScore: 84,
      nowcastVerdict: 'Dry conditions across Eco Green with pleasant easterly airflow.',
    },
  ];
}

/**
 * Primary Mock Weather Service fetching normalized Singapore weather data.
 * Ready to be swapped with data.gov.sg APIs in Phase 2.
 */
export function getSingaporeWeatherData(
  regionId: SingaporeRegionId = 'tanjong_pagar',
  scenario: WeatherScenarioId = 'realistic_afternoon'
): NormalizedSingaporeWeather {
  const region = SINGAPORE_REGIONS[regionId] || SINGAPORE_REGIONS.tanjong_pagar;

  // Base adjustments based on region and scenario
  let baseTemp = 31.4;
  let humidity = 74;
  let rainProb = 15;
  let rainfallRate = 0.0;
  let windSpeed = 11;
  let windDir = 'SSW';
  let uvIndex = 7.8;
  let psi24h = 42;
  let pm25 = 12;
  let condition: CurrentWeather['condition'] = 'Partly Cloudy';
  let conditionDescription = 'Partly Cloudy with occasional sun intervals';

  if (region.zone === 'East') {
    windSpeed = 16;
    windDir = 'SE';
    baseTemp = 30.4;
    humidity = 71;
    rainProb = 10;
    condition = 'Fair (Day)';
    conditionDescription = 'Fair skies with pleasant maritime breeze';
  } else if (region.zone === 'West') {
    baseTemp = 29.8;
    humidity = 82;
    rainProb = 65;
    condition = 'Passing Showers';
    conditionDescription = 'Overcast with light localized showers';
  } else if (region.id === 'sentosa') {
    baseTemp = 31.9;
    uvIndex = 8.6;
    condition = 'Fair (Day)';
  }

  // Override by scenario if selected
  if (scenario === 'rainy_west_storm') {
    rainfallRate = 4.2;
    rainProb = 75;
    condition = 'Thundery Showers';
    conditionDescription = 'Moderate to heavy thundery showers developing overhead';
    humidity = 88;
    baseTemp = 28.6;
    uvIndex = 2.4;
  } else if (scenario === 'sunny_clear_weekend') {
    rainfallRate = 0.0;
    rainProb = 5;
    condition = 'Fair (Day)';
    conditionDescription = 'Clear tropical skies with low shower risk';
    humidity = 66;
    baseTemp = 30.1;
    windSpeed = 14;
    uvIndex = 8.2;
  } else if (scenario === 'hazy_afternoon') {
    condition = 'Hazy';
    conditionDescription = 'Elevated PM2.5 transboundary haze';
    psi24h = 88;
    pm25 = 38;
    humidity = 70;
  }

  const feelsLike = Math.round((baseTemp + (humidity / 100) * 6 - 2) * 10) / 10;

  const current: CurrentWeather = {
    temperature: baseTemp,
    feelsLike,
    relativeHumidity: humidity,
    rainfallRate,
    rainProbability: rainProb,
    windSpeed,
    windDirection: windDir,
    windDirectionDeg: 205,
    uvIndex,
    psi24h,
    pm25_1h: pm25,
    condition,
    conditionDescription,
    timestamp: '5:00 PM SGT',
    isDaytime: true,
  };

  const nowcastSlots = generateNowcastSlots(baseTemp, scenario);

  const nowcast: Nowcast2Hour = {
    summary:
      scenario === 'rainy_west_storm'
        ? 'Thundery showers active over Central and Western areas. Clearing by ~6:15 PM.'
        : 'Dry conditions expected across Tanjong Pagar & CBD. Shower cells remaining inland over Jurong.',
    rainExpectedInNext2Hours: scenario === 'rainy_west_storm' || rainProb > 50,
    rainOnsetMinute: scenario === 'rainy_west_storm' ? 15 : undefined,
    radarTrajectory:
      scenario === 'rainy_west_storm'
        ? 'Rain band moving slowly northeast at 12 km/h across the Southern Ridge.'
        : 'Singapore Doppler radar indicates no rain clusters approaching Tanjong Pagar within 15 km.',
    slots: nowcastSlots,
    optimalSubWindow: {
      start: '5:30 PM',
      end: '7:15 PM',
      reason: 'UV index drops below 3.0 and solar radiation heat stress decreases by 40%.',
    },
  };

  const alerts: WeatherAlert[] = [];
  if (scenario === 'rainy_west_storm') {
    alerts.push({
      id: 'alert_rain_01',
      severity: 'warning',
      title: 'Heavy Rain Warning',
      message: 'Moderate to heavy thundery showers with gusty wind expected over southern and central Singapore.',
      affectedRegions: ['tanjong_pagar', 'orchard', 'jurong', 'bishan'],
      validUntil: '6:30 PM',
    });
  } else if (scenario === 'hazy_afternoon') {
    alerts.push({
      id: 'alert_haze_01',
      severity: 'advisory',
      title: 'Haze Advisory',
      message: '1-hr PM2.5 concentrations in the Moderate band. Individuals with respiratory conditions should moderate prolonged exertion.',
      affectedRegions: 'islandwide',
      validUntil: '9:00 PM',
    });
  }

  const allRegions = generateMicroclimateSummaries(scenario);

  return {
    region,
    lastUpdated: 'Just now (5:00 PM SGT)',
    current,
    nowcast,
    dayPeriods: generateDayPeriods(scenario),
    fourDayOutlook: generateFourDayOutlook(),
    alerts,
    allRegions,
  };
}
