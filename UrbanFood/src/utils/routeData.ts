import {
    ORS_API_KEY,
    ORS_DIRECTIONS_URL
} from '@/src/constants/delivery';

export interface LatLng {
  latitude: number;
  longitude: number;
}

// ── ORS real road route ───────────────────────────────────────────────────────
/**
 * Fetches a real driving route from OpenRouteService.
 * Returns an array of LatLng points decoded from the GeoJSON response.
 * Falls back to a generated route on any error.
 */
export async function fetchRealRoute(
  start: LatLng,
  end: LatLng,
): Promise<LatLng[]> {
  try {
    const body = {
      coordinates: [
        [start.longitude, start.latitude],
        [end.longitude, end.latitude],
      ],
    };

    const res = await fetch(ORS_DIRECTIONS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: ORS_API_KEY,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.warn(`ORS API returned ${res.status}, using fallback route`);
      return generateRoute(start, end);
    }

    const json = await res.json();
    
    if (!json.features || !json.features[0] || !json.features[0].geometry) {
      console.warn('Invalid ORS response format, using fallback route');
      return generateRoute(start, end);
    }

    // GeoJSON LineString coordinates are [lng, lat]
    const coords: [number, number][] = json.features[0].geometry.coordinates;

    console.log('✅ ORS route fetched successfully:', coords.length, 'points');

    return coords.map(([lng, lat]) => ({ latitude: lat, longitude: lng }));
  } catch (e) {
    console.warn('ORS route fetch failed, using fallback route:', e);
    return generateRoute(start, end);
  }
}

// ── Interpolated fallback route ───────────────────────────────────────────────
/**
 * Generates a smooth simulated route between two points.
 * Used as fallback when ORS is unavailable.
 */
export function generateRoute(start: LatLng, end: LatLng): LatLng[] {
  const points: LatLng[] = [];
  const steps = 50; // More points for smoother animation

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = start.latitude + (end.latitude - start.latitude) * t;
    const lng = start.longitude + (end.longitude - start.longitude) * t;
    // Slight sinusoidal curve to simulate road bends
    const curve = Math.sin(t * Math.PI) * 0.002;
    const perpLat = -(end.longitude - start.longitude) * curve;
    const perpLng = (end.latitude - start.latitude) * curve;
    points.push({ latitude: lat + perpLat, longitude: lng + perpLng });
  }

  return points;
}

// ── Geometry helpers ──────────────────────────────────────────────────────────
/** Bearing angle between two coords (for marker rotation). */
export function getBearing(from: LatLng, to: LatLng): number {
  const dLng = to.longitude - from.longitude;
  const y =
    Math.sin((dLng * Math.PI) / 180) * Math.cos((to.latitude * Math.PI) / 180);
  const x =
    Math.cos((from.latitude * Math.PI) / 180) *
      Math.sin((to.latitude * Math.PI) / 180) -
    Math.sin((from.latitude * Math.PI) / 180) *
      Math.cos((to.latitude * Math.PI) / 180) *
      Math.cos((dLng * Math.PI) / 180);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/** Midpoint between two coords. */
export function getMidpoint(a: LatLng, b: LatLng): LatLng {
  return {
    latitude: (a.latitude + b.latitude) / 2,
    longitude: (a.longitude + b.longitude) / 2,
  };
}

/** Map region that fits both points with padding. */
export function getRegionForPoints(a: LatLng, b: LatLng, padding = 1.6) {
  const mid = getMidpoint(a, b);
  const latDelta = Math.abs(a.latitude - b.latitude) * padding + 0.01;
  const lngDelta = Math.abs(a.longitude - b.longitude) * padding + 0.01;
  return {
    latitude: mid.latitude,
    longitude: mid.longitude,
    latitudeDelta: latDelta,
    longitudeDelta: lngDelta,
  };
}
