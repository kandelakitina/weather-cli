// api.geocoding.ts

const GEOCODING_BASE = "https://geocoding-api.open-meteo.com/v1/search";

export interface CityLocation {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
}

/**
 * Looks up a city's geographic location by name using the Open-Meteo geocoding API.
 *
 * @param name - The city or place name to search for; must be non-empty.
 * @returns The first matching CityLocation if found, `undefined` if no results.
 * @throws Error if `name` is missing or empty, or if the geocoding API responds with a non-OK status.
 */
export async function getCityLocation(
  name: string,
): Promise<CityLocation | undefined> {
  if (!name || name.trim().length === 0) {
    throw new Error("Name is required for geocoding");
  }

  const url = `${GEOCODING_BASE}?name=${encodeURIComponent(name)}&count=1`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(
      `Geocoding API request failed (${res.status}): ${res.statusText}`,
    );
  }
  const json = await res.json();
  const results = json.results ?? [];

  return results[0];
}