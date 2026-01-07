# Weather CLI - Deno-based Weather Application

A command-line interface for fetching current weather data using free APIs. This project demonstrates clean API integration patterns in Deno/TypeScript.

## Features

- 🌤️ Fetch current weather for any city
- 🆓 **No API keys required** - uses free Open-Meteo APIs
- 🚀 Fast and lightweight Deno application
- 📍 Automatic geocoding (city name → coordinates)
- 🎯 Simple CLI interface

## Usage

```bash
# Show help
deno run dev -h

# Get weather for a city
deno run dev -s London
```

### Output Example

```
Message received: Weather for London, United Kingdom:
🌡 Temperature: 2.1°C
💨 Wind: 13 m/s, direction 256°
☁ Weather code: 2
⏰ Time: 2026-01-07T09:15
```

## API Integration Architecture

This project demonstrates a clean separation of concerns for API integration:

### 1. Geocoding API (`services/api.geocoding.ts`)

**Purpose**: Convert city names to geographic coordinates.

**API Used**: Open-Meteo Geocoding API
- **Endpoint**: `https://geocoding-api.open-meteo.com/v1/search`
- **No authentication required**
- **Features**: Fuzzy search, country filtering, multiple results

**Implementation Pattern**:
```typescript
// Clean interface abstraction
export async function getTopLocation(
  name: string,
  options?: { language?: string; countryCode?: string }
): Promise<GeoLocation | null>

// Internal implementation handles API calls and error handling
async function geocodeLocation(name: string, options?: {...})
```

**Key Features**:
- Returns top match for city names
- Supports language and country filtering
- Handles API errors gracefully
- Returns structured location data (lat/lng, country, etc.)

### 2. Weather API (`services/api.weather.ts`)

**Purpose**: Fetch current weather data using coordinates.

**API Used**: Open-Meteo Weather Forecast API
- **Endpoint**: `https://api.open-meteo.com/v1/forecast`
- **No authentication required**
- **Features**: Current weather, forecasts, multiple data sources

**Implementation Pattern**:
```typescript
// Public API - clean interface
export async function getWeatherByCity(
  city: string,
  options?: { language?: string; countryCode?: string; timezone?: string }
): Promise<WeatherResult>

// Pipeline: City → Geocode → Weather → Formatted Result
const location = await resolveCity(city, options);
const weather = await fetchCurrentWeather(location.latitude, location.longitude);
return { city: location.name, country: location.country, ...weather };
```

**API Request Structure**:
```typescript
// Current weather request
const params = new URLSearchParams({
  latitude: String(latitude),
  longitude: String(longitude),
  current: "temperature_2m,wind_speed_10m,wind_direction_10m,weather_code",
  timezone: "auto"
});

const response = await fetch(`${FORECAST_API}?${params}`);
```

**Data Mapping**:
- Open-Meteo field names → Application field names
- `temperature_2m` → `temperature`
- `wind_speed_10m` → `windspeed`
- `wind_direction_10m` → `winddirection`
- `weather_code` → `weathercode` (WMO codes)

### 3. Error Handling Strategy

**Network Errors**:
```typescript
const res = await fetch(url);
if (!res.ok) {
  throw new Error(`API request failed (${res.status}): ${res.statusText}`);
}
```

**Data Validation**:
```typescript
if (!data.current) {
  throw new Error("No current weather data returned");
}
```

**User-Friendly Messages**:
- API errors → Clear user messages
- Network issues → Helpful guidance
- Invalid cities → "City not found" messages

### 4. CLI Integration (`weather.ts`)

**Clean Separation**:
- CLI parsing (args.ts)
- Business logic (api services)
- Output formatting (log service)

**Command Flow**:
```
CLI Args → Parse → Validate → Fetch Weather → Format Output
```

## Code Structure

```
weatherCliDeno/
├── weather.ts              # Main CLI entry point
├── helpers/
│   └── args.ts            # CLI argument parsing
└── services/
    ├── api.geocoding.ts   # City → Coordinates
    ├── api.weather.ts     # Coordinates → Weather
    ├── log.service.ts     # Output formatting
```
