import { getArgs } from "./helpers/args.ts";
import { printError, printHelp, printSuccess } from "./services/log.service.ts";
import { getWeatherByCity } from "./services/api.weather.ts";
import { getKeyValue, saveKeyValue, getCities, saveCities } from "./services/storage.service.ts";

/* -----------------------------
   Fetch weather helper
-------------------------------- */
const fetchWeatherForCity = async (city: string) => {
  try {
    const weather = await getWeatherByCity(city);

    printSuccess(
      `Weather for ${weather.city}${
        weather.country ? ", " + weather.country : ""
      }:\n` +
        `🌡 Temperature: ${weather.temperature}°C\n` +
        `💨 Wind: ${weather.windspeed} m/s, direction ${weather.winddirection}°\n` +
        `☁ Weather code: ${weather.weathercode}\n` +
        `⏰ Time: ${weather.time}`,
    );
  } catch (error) {
    printError(error instanceof Error ? error.message : String(error));
  }
};

const fetchWeatherForAll = async (cities: string[]) => {
  for (const city of cities) {
    await fetchWeatherForCity(city);
  }
};

/* -----------------------------
   CLI Entry point
-------------------------------- */
const initCLI = async () => {
  const { s: cities, h: help, l: language } = getArgs(Deno.args);

  if (help) {
    printHelp();
    return;
  }

  if (language) {
    await saveKeyValue("language", language);
  }

  if (cities && cities.length > 0) {
    const currentCities = await getCities();
    for (const city of cities) {
      if (!currentCities.includes(city)) {
        currentCities.push(city);
      }
    }
    await saveCities(currentCities);
    await fetchWeatherForAll(cities);
  } else {
    const savedCities = await getCities();
    if (savedCities.length > 1) {
      await fetchWeatherForAll(savedCities.slice(0, 5));
    } else if (savedCities.length === 1) {
      await fetchWeatherForCity(savedCities[0]);
    } else {
      printError("No cities saved. Please provide a city with -s, or use -h for help.");
    }
  }
};

initCLI();
