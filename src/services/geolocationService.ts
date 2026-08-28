import { SingaporeRegion, SingaporeRegionId, GeolocationState } from '../types/weather';
import { SINGAPORE_REGIONS } from './mockWeatherService';

/**
 * Calculates Haversine distance in kilometers between two GPS coordinates.
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Approximate bounding box for Singapore mainland and territorial islands.
 */
export function isWithinSingapore(lat: number, lng: number): boolean {
  return lat >= 1.15 && lat <= 1.48 && lng >= 103.58 && lng <= 104.1;
}

/**
 * Find the closest Singapore microclimate station / region based on coordinates.
 */
export function findNearestSingaporeRegion(
  lat: number,
  lng: number
): { region: SingaporeRegion; distanceKm: number; isWithinSGBounds: boolean } {
  const regions = Object.values(SINGAPORE_REGIONS);
  let closestRegion = regions[0];
  let minDistance = calculateDistanceKm(lat, lng, closestRegion.lat, closestRegion.lng);

  for (const reg of regions) {
    const dist = calculateDistanceKm(lat, lng, reg.lat, reg.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestRegion = reg;
    }
  }

  const isWithinSGBounds = isWithinSingapore(lat, lng);

  return {
    region: closestRegion,
    distanceKm: minDistance,
    isWithinSGBounds,
  };
}

/**
 * Requests browser GPS position and resolves nearest Singapore weather station.
 */
export async function getGPSLocation(): Promise<GeolocationState> {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    return {
      status: 'unavailable',
      coords: null,
      nearestRegion: null,
      distanceKm: null,
      errorMessage: 'Geolocation is not supported by your browser.',
    };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const match = findNearestSingaporeRegion(latitude, longitude);

        if (!match.isWithinSGBounds) {
          resolve({
            status: 'outside_singapore',
            coords: { lat: latitude, lng: longitude, accuracy },
            nearestRegion: match.region,
            distanceKm: match.distanceKm,
            errorMessage: `Detected coordinates outside SG (${match.distanceKm} km away). Defaulted to nearest station: ${match.region.name}.`,
            lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
        } else {
          resolve({
            status: 'success',
            coords: { lat: latitude, lng: longitude, accuracy },
            nearestRegion: match.region,
            distanceKm: match.distanceKm,
            errorMessage: null,
            lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          });
        }
      },
      (error) => {
        let msg = 'Could not access location.';
        let status: GeolocationState['status'] = 'unavailable';

        if (error.code === error.PERMISSION_DENIED) {
          status = 'permission_denied';
          msg = 'Location permission was denied. You can select your area manually.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Please try again or select manually.';
        }

        resolve({
          status,
          coords: null,
          nearestRegion: null,
          distanceKm: null,
          errorMessage: msg,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000,
      }
    );
  });
}
