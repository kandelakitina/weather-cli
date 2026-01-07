// api.geocoding.ts

const GEOCODING_BASE = "https://geocoding-api.open-meteo.com/v1/search";

/* -----------------------------
   Types
-------------------------------- */

/**
 * A single location returned by Open-Meteo geocoding API
 * Docs reference: https://open-meteo.com/en/docs/geocoding-api
 */
export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country_code?: string;
  country?: string;
  timezone?: string;
  population?: number;
  elevation?: number;
  postcodes?: string[];
  admin1?: string;
  admin2?: string;
  admin3?: string;
  admin4?: string;
}

/**
 * The raw JSON response object from the API.
 */
interface GeoResponse {
  results?: GeoLocation[];
}

/* -----------------------------
   1️⃣ Fetch matching locations
-------------------------------- */

/**
 * Returns up to `count` matching locations for a city or place name string.
 *
 * @param name - City or place name (fuzzy match). Required.
 * @param options - Optional parameters:
 *    - count: How many results to return (max 100)
 *    - language: Localized language for returned names
 *    - countryCode: ISO 3166-1 alpha2 filter
 */
export async function geocodeLocation(
  name: string,
  options?: {
    count?: number;
    language?: string;
    countryCode?: string;
  },
): Promise<GeoLocation[]> {
  if (!name || name.trim().length === 0) {
    throw new Error("Name is required for geocoding");
  }

  const params = new URLSearchParams({
    name: name.trim(),
    count: String(options?.count ?? 10),
    format: "json", // JSON is default
    language: options?.language ?? "en",
  });

  if (options?.countryCode) {
    params.set("countryCode", options.countryCode);
  }

  const url = `${GEOCODING_BASE}?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `Geocoding API request failed (${res.status}): ${res.statusText}`,
    );
  }

  const json = (await res.json()) as GeoResponse;

  // The API returns an object with `results` array if found.
  return json.results ?? [];
}

/* -----------------------------
   2️⃣ Get the top match
-------------------------------- */

/**
 * Returns the first (best) matching location
 *
 * @param name - City or place name
 * @param options - Same options as geocodeLocation
 */
export async function getTopLocation(
  name: string,
  options?: {
    language?: string;
    countryCode?: string;
  },
): Promise<GeoLocation | null> {
  const results = await geocodeLocation(name, {
    ...options,
    count: 1,
  });

  return results.length > 0 ? results[0] : null;
}
