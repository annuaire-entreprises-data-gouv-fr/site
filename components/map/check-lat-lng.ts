import { LngLatLike } from 'maplibre-gl';

export function checkLatLng(
  latitude: string,
  longitude: string
): LngLatLike | null {
  try {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    if (
      isNaN(lat) ||
      isNaN(lng) ||
      lat < -90 ||
      lat > 90 ||
      lng < -180 ||
      lng > 180
    ) {
      throw new Error('Invalid coords');
    }

    return {
      lat,
      lng,
    };
  } catch {}
  return null;
}
