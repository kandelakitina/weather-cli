import { getArgs } from "./helpers/args.ts";
import { printError, printHelp, printSuccess } from "./services/log.service.ts";
import { getKeyValue, saveKeyValue } from "./services/storage.service.ts";
import { getWeatherByCity } from "./services/api.weather.ts";

/* -----------------------------
   Save token helper
-------------------------------- */
const saveToken = async (token: string) => {
  if (!token.trim()) {
    printError("Token cannot be blank");
    return;
  }

  try {
    await saveKeyValue("token", token);
    printSuccess("Token saved successfully.");
  } catch (error) {
    printError(error instanceof Error ? error.message : String(error));
  }
};

/* -----------------------------
   Fetch weather helper
-------------------------------- */
const fetchWeather = async (city: string, token: string) => {
  if (!city.trim()) {
    printError("City cannot be blank");
    return;
  }

  try {
    const maskedToken = token.length >= 8 ? `${token.slice(0, 4)}...${token.slice(-4)}` : '****';
    printSuccess(`Using token: ${maskedToken}`);

    const weather = await getWeatherByCity(city, { token });

    printSuccess(
      `Weather for ${weather.city}${
        weather.country ? ", " + weather.country : ""
      }:`,
    );
    console.log(`🌡 Temperature: ${weather.temperature}°C`);
    console.log(
      `💨 Wind: ${weather.windspeed} m/s, direction ${weather.winddirection}°`,
    );
    console.log(`☁ Weather code: ${weather.weathercode}`);
    console.log(`⏰ Time: ${weather.time}`);
  } catch (error) {
    printError(error instanceof Error ? error.message : String(error));
  }
};

/* -----------------------------
   CLI Entry point
-------------------------------- */
const initCLI = async () => {
  const { s: city, h: help, t: tokenArg } = getArgs(Deno.args);

  if (help) {
    printHelp();
    return;
  }

  let token: string;

  if (tokenArg !== undefined) {
    // If token provided in CLI, use it and save it
    token = tokenArg.trim();
    await saveToken(token);
  } else {
    // Attempt to read saved token
    const savedToken = await getKeyValue("token");
    if (!savedToken) {
      printError(
        "No token provided with -t and no token is saved. Please provide a token using -t.",
      );
      return;
    }
    token = savedToken;
  }

  if (city) {
    await fetchWeather(city, token);
  } else {
    printError("Please provide a city with -s, or use -h for help.");
  }
};

initCLI();
