// services/api.weather.ts

const WEATHER_BASE = "https://api.openweathermap.org/data/3.0/onecall";

export interface WeatherResult {
  temperature: number;
  time: string; // city-local HH:MM
}

/**
 * Format a city's local time as "HH:MM" from a UTC timestamp and timezone offset.
 *
 * @param utcSeconds - Seconds since Unix epoch in UTC.
 * @param timezoneOffsetSeconds - Number of seconds to add to UTC to obtain the local time (positive east of UTC, negative west).
 * @returns The city-local time formatted as `HH:MM` (24-hour, zero-padded).
 */
function formatCityLocalTime(
  utcSeconds: number,
  timezoneOffsetSeconds: number,
): string {
  const localTimeMs = (utcSeconds + timezoneOffsetSeconds) * 1000;
  const date = new Date(localTimeMs);

  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
}

/**
 * Fetches current weather for the given geographic coordinates and returns the temperature and city-local time.
 *
 * @param latitude - Latitude in decimal degrees
 * @param longitude - Longitude in decimal degrees
 * @param token - OpenWeatherMap API key
 * @returns An object with `temperature` in degrees Celsius and `time` as city-local "HH:MM"
 * @throws Error when the HTTP request fails (includes status code)
 * @throws Error when the response does not contain expected weather data
 */
export async function getWeather(
  latitude: number,
  longitude: number,
  token: string,
): Promise<WeatherResult> {
  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    appid: token,
    units: "metric",
    exclude: "minutely,hourly,daily,alerts",
  });

  const res = await fetch(`${WEATHER_BASE}?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`Weather request failed (${res.status})`);
  }

  const data = await res.json();

  if (!data.current || typeof data.timezone_offset !== "number") {
    throw new Error("Invalid weather data returned");
  }

  return {
    temperature: data.current.temp,
    time: formatCityLocalTime(
      data.current.dt,
      data.timezone_offset,
    ),
  };
}