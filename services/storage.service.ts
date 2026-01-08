import os from "node:os";
import * as path from "@std/path";

const filepath = path.join(os.homedir(), "weather-data.json");

type Data = Record<string, string>;

const isValidData = (data: unknown): data is Data => {
  if (typeof data !== "object" || data === null) return false;
  return Object.entries(data).every(
    ([key, value]) => typeof key === "string" && typeof value === "string",
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

const getKeyValue = async (key: string): Promise<string | undefined> => {
  const data = await readData();
  return data[key];
};

const saveKeyValue = async (key: string, value: string): Promise<void> => {
  const data = await readData();
  data[key] = value;
  await Deno.writeTextFile(filepath, JSON.stringify(data, null, 2));
};

export { getKeyValue, saveKeyValue };
