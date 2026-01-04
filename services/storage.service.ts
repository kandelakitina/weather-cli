import os from "node:os";
import * as path from "@std/path";
import { exists } from "@std/fs";

// Requires --allow-sys permission
const filepath = path.join(os.homedir(), "weather-data.json");

type Data = Record<string, string>;

const saveKeyValue = async (key: string, value: string): Promise<void> => {
  let data: Data = {};

  // Check for file existence
  if (await exists(filepath)) {
    const file = await Deno.readTextFile(filepath);
    data = JSON.parse(file);
  }

  data[key] = value;
  await Deno.writeTextFile(filepath, JSON.stringify(data, null, 2));
};

export { saveKeyValue };
