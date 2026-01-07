import { parseArgs } from "@std/cli/parse-args";

const getArgs = (args: string[]) => {
  return parseArgs(args, {
    string: ["s"],
    boolean: ["h"],
  });
};

export { getArgs };
