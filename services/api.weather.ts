// api.weather.ts

import { type GeoLocation, getTopLocation } from "./api.geocoding.ts";

const FORECAST_API = "https://api.openweathermap.org/data/3.0/onecall";

/* -----------------------------
   Types
-------------------------------- */

export interface WeatherResult {
  city: string;
  country?: string;
  latitude: number;
  longitude: number;
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  time: string;
}

/* -----------------------------
   Public API
-------------------------------- */

export async function getWeatherByCity(
  city: string,
  options?: {
    language?: string;
    countryCode?: string;
    timezone?: string;
    token?: string;
  },
): Promise<WeatherResult> {
  if (!options?.token) {
    throw new Error("OpenWeatherMap API token is required");
  }

  // token is reserved for future authenticated APIs
  const location = await resolveCity(city, {
    language: options?.language,
    countryCode: options?.countryCode,
  });

  const weather = await fetchCurrentWeather(
    location.latitude,
    location.longitude,
    options?.timezone,
    options.token,
  );

  return {
    city: location.name,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude,
    ...weather,
  };
}

/* -----------------------------
   Internal helpers
-------------------------------- */

async function resolveCity(
  city: string,
  options?: {
    language?: string;
    countryCode?: string;
  },
): Promise<GeoLocation> {
  const location = await getTopLocation(city, options);

  if (!location) {
    throw new Error(`City not found: ${city}`);
  }

  return location;
}

async function fetchCurrentWeather(
  latitude: number,
  longitude: number,
  timezone = "auto",
  token: string,
): Promise<{
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
  time: string;
}> {
  if (!token) {
    throw new Error("OpenWeatherMap API token is required");
  }

  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    units: "metric",
    exclude: "minutely,hourly,daily,alerts",
  });

  // token is required for OpenWeatherMap API
  params.set("appid", token);

  const res = await fetch(`${FORECAST_API}?${params}`);
  if (!res.ok) {
    throw new Error(`Weather request failed (${res.status})`);
  }

  const data = await res.json();

  if (!data.current) {
    throw new Error("No current weather data returned");
  }

  const current = data.current;
  const weathercode = Array.isArray(current.weather) && current.weather.length > 0 ? current.weather[0].id : 0;
  return {
    temperature: current.temp,
    windspeed: current.wind_speed,
    winddirection: current.wind_deg,
    weathercode,
    time: new Date(current.dt * 1000).toISOString(),
  };
}
