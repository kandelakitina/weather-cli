import { getArgs } from "./helpers/args.ts";
import { printError, printHelp, printSuccess } from "./services/log.service.ts";
import { saveKeyValue } from "./services/storage.service.ts";

const initCLI = () => {
  const { s: city, h: help, t: token } = getArgs(Deno.args);
  if (help) printHelp();
  if (token) saveKeyValue("token", token);
};

initCLI();
