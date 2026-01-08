import os from "node:os";
import * as path from "@std/path";
import { printSuccess } from "./log.service.ts";

const filepath = path.join(os.homedir(), "weather-data.json");

type Data = Record<string, string | string[]>;

const isValidData = (data: unknown): data is Data => {
  if (typeof data !== "object" || data === null) return false;
  return Object.entries(data).every(
    ([key, value]) => typeof key === "string" && (typeof value === "string" || (Array.isArray(value) && value.every(v => typeof v === "string"))),
  );
};

const readData = async (): Promise<Data> => {
  try {
    const file = await Deno.readTextFile(filepath);
    const parsed = JSON.parse(file);
    if (!isValidData(parsed)) {
      throw new Error("Invalid data format in storage file");
    }
    return parsed;
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) {
      return {};
    }
    throw err;
  }
};

const getKeyValue = async (key: string): Promise<string | string[] | undefined> => {
  const data = await readData();
  return data[key];
};

const saveKeyValue = async (key: string, value: string | string[]): Promise<void> => {
  const data = await readData();
  data[key] = value;
  await Deno.writeTextFile(filepath, JSON.stringify(data, null, 2));
  printSuccess(`${key} saved`);
};

const getCities = async (): Promise<string[]> => {
  const data = await readData();
  const cities = data["cities"];
  if (Array.isArray(cities) && cities.every(c => typeof c === "string")) {
    return cities;
  }
  return [];
};

const saveCities = async (cities: string[]): Promise<void> => {
  const data = await readData();
  data["cities"] = cities;
  await Deno.writeTextFile(filepath, JSON.stringify(data, null, 2));
  printSuccess(`Cities saved`);
};

export { getKeyValue, saveKeyValue, getCities, saveCities };
