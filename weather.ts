import { getArgs } from "./helpers/args.ts";
import { printError, printHelp, printSuccess } from "./services/log.service.ts";
import { getWeatherByCity } from "./services/api.weather.ts";

/* -----------------------------
   Fetch weather helper
-------------------------------- */
const fetchWeather = async (city: string) => {
  if (!city.trim()) {
    printError("City cannot be blank");
    return;
  }

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

/* -----------------------------
   CLI Entry point
-------------------------------- */
const initCLI = async () => {
  const { s: city, h: help } = getArgs(Deno.args);

  if (help) {
    printHelp();
    return;
  }

  if (city) {
    await fetchWeather(city);
  } else {
    printError("Please provide a city with -s, or use -h for help.");
  }
};

initCLI();
