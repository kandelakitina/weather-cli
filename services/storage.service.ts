import os from "node:os";
import * as path from "@std/path";
import { exists } from "@std/fs";

const filepath = path.join(os.homedir(), "weather-data.json");

type Data = Record<string, string>;

const readData = async (): Promise<Data> => {
  if (!await exists(filepath)) {
    return {};
  }
  const file = await Deno.readTextFile(filepath);
  return JSON.parse(file) as Data;
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
