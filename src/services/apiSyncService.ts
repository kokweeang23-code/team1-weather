import { ApiSyncRecord } from '../types/weather';

const STORAGE_KEY = 'sg_weather_api_sync_history_v1';
const MAX_RECORDS = 10;

/**
 * Formats a Date object into human-readable Date (e.g., "27 Aug 2026")
 */
export function formatSyncDate(d: Date): string {
  return d.toLocaleDateString('en-SG', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Formats a Date object into human-readable Time (e.g., "06:14:22 PM")
 */
export function formatSyncTime(d: Date): string {
  return d.toLocaleTimeString('en-SG', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

/**
 * Calculates human relative time string
 */
export function formatRelativeTime(d: Date, now: Date = new Date()): string {
  const diffSec = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diffSec < 5) return 'Just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  return `${diffHour}h ago`;
}

const API_ENDPOINTS = [
  'api.data.gov.sg/v1/environment/2-hour-weather-forecast',
  'api.data.gov.sg/v1/environment/air-temperature',
  'api.data.gov.sg/v1/environment/relative-humidity',
  'api.data.gov.sg/v1/environment/rainfall',
  'api.data.gov.sg/v1/environment/pm25',
  'api.data.gov.sg/v1/environment/psi',
  'api.data.gov.sg/v1/environment/uv-index',
];

/**
 * Creates a new sync record
 */
export function createSyncRecord(
  trigger: ApiSyncRecord['trigger'] = 'Manual Sync',
  regionName: string = 'Tanjong Pagar',
  customDate?: Date
): ApiSyncRecord {
  const now = customDate || new Date();
  const randomEndpoint = API_ENDPOINTS[Math.floor(Math.random() * API_ENDPOINTS.length)];
  const durationMs = Math.floor(Math.random() * 140) + 85; // 85ms - 225ms
  const payloadSizeKb = Number((Math.random() * 25 + 18).toFixed(1)); // 18 - 43 KB
  const itemsSynced = Math.floor(Math.random() * 12) + 24; // 24 - 36 items

  return {
    id: `sync_${now.getTime()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: now.toISOString(),
    formattedDate: formatSyncDate(now),
    formattedTime: formatSyncTime(now),
    relativeTime: 'Just now',
    status: 'success',
    statusCode: 200,
    endpoint: randomEndpoint,
    source: 'Data.gov.sg (NEA & MSS)',
    trigger,
    durationMs,
    payloadSizeKb,
    itemsSynced,
    regionName,
    details: `Successfully fetched & normalized telemetry for ${regionName} (${itemsSynced} station sensors, ${payloadSizeKb} KB).`,
  };
}

/**
 * Generates initial seed history of 10 records leading up to now if storage is empty
 */
export function getInitialSyncHistory(currentRegionName: string = 'Tanjong Pagar'): ApiSyncRecord[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: ApiSyncRecord[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Re-update relative times
          const now = new Date();
          return parsed.slice(0, MAX_RECORDS).map((rec) => {
            const d = new Date(rec.timestamp);
            return {
              ...rec,
              relativeTime: formatRelativeTime(d, now),
            };
          });
        }
      }
    } catch {
      // ignore
    }
  }

  // Generate 10 realistic past sync entries spaced over the last 90 minutes
  const now = new Date();
  const seedTriggers: Array<{ trigger: ApiSyncRecord['trigger']; minutesAgo: number; region: string }> = [
    { trigger: 'Initial Load', minutesAgo: 0, region: currentRegionName },
    { trigger: 'Auto-Sync', minutesAgo: 5, region: currentRegionName },
    { trigger: 'Location Change', minutesAgo: 12, region: 'Marina Bay' },
    { trigger: 'Auto-Sync', minutesAgo: 18, region: 'Marina Bay' },
    { trigger: 'Manual Refresh', minutesAgo: 26, region: 'East Coast' },
    { trigger: 'Auto-Sync', minutesAgo: 35, region: 'East Coast' },
    { trigger: 'GPS Location', minutesAgo: 45, region: 'Orchard' },
    { trigger: 'Auto-Sync', minutesAgo: 58, region: 'Orchard' },
    { trigger: 'Scenario Switch', minutesAgo: 72, region: 'Tanjong Pagar' },
    { trigger: 'Auto-Sync', minutesAgo: 85, region: 'Tanjong Pagar' },
  ];

  const records: ApiSyncRecord[] = seedTriggers.map((item, idx) => {
    const d = new Date(now.getTime() - item.minutesAgo * 60 * 1000 - (idx * 14 + 10) * 1000);
    const rec = createSyncRecord(item.trigger, item.region, d);
    rec.relativeTime = formatRelativeTime(d, now);
    return rec;
  });

  saveSyncHistory(records);
  return records;
}

/**
 * Saves sync history to localStorage
 */
export function saveSyncHistory(records: ApiSyncRecord[]): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(0, MAX_RECORDS)));
    } catch {
      // ignore
    }
  }
}

/**
 * Adds a new sync entry and keeps exactly the last 10 entries
 */
export function recordNewSync(
  existingRecords: ApiSyncRecord[],
  trigger: ApiSyncRecord['trigger'],
  regionName: string
): ApiSyncRecord[] {
  const newRec = createSyncRecord(trigger, regionName);
  const updated = [newRec, ...existingRecords].slice(0, MAX_RECORDS);
  saveSyncHistory(updated);
  return updated;
}
