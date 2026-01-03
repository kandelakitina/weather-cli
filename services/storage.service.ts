import os from "node:os";
import * as path from "@std/path";

// Requires --allow-sys permission
const filePath = path.join(os.homedir(), "weather-data.json");

const saveKeyValue = (key: string, value: string) => {
  console.log(filePath);
  console.log(key, value);
};

export { saveKeyValue };
