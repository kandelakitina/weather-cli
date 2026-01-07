import { getArgs } from "./helpers/args.ts";
import { printError, printHelp, printSuccess } from "./services/log.service.ts";
import { getKeyValue, saveKeyValue } from "./services/storage.service.ts";
import { getWeather, type WeatherResult } from "./services/api.weather.ts";
import { getCityLocation } from "./services/api.geocoding.ts";
import { dedent } from "@std/text/unstable-dedent";

const saveToken = async (token: string) => {
  if (!token.length) {
    printError("Token cannot be blank");
    return;
  }
  try {
    await saveKeyValue("token", token);
    printSuccess("Token saved");
  } catch (error) {
    if (error instanceof Error) {
      printError(error.message);
    } else {
      printError(String(error));
    }
    return;
  }
};

const fetchWeather = async function (
  city: string,
): Promise<WeatherResult> {
  const token = await getKeyValue("token");

  if (!token || !token.trim().length) {
    throw new Error("API token not found. Please save it using -t <token>");
  }

  const location = await getCityLocation(city);
  if (!location) {
    throw new Error(`City not found: ${city}`);
  }

  const weather = await getWeather(
    location.latitude,
    location.longitude,
    token, // now guaranteed to be string
  );

  return weather;
};

const showWeather = async (city: string) => {
  try {
    const weather = await fetchWeather(city);

    const output = dedent`
      Temperature: ${weather.temperature}°C
      Local Time: ${weather.time}
    `;

    printSuccess(output);
  } catch (error) {
    if (error instanceof Error) {
      printError(error.message);
    } else {
      printError(String(error));
    }
  }
};

const initCLI = async () => {
  const { s: city, h: help, t: token } = getArgs(Deno.args);

  if (help) {
    printHelp();
    return;
  }

  if (token !== undefined) {
    await saveToken(token);
  }

  if (city !== undefined) {
    await showWeather(city);
  }
};

initCLI();
