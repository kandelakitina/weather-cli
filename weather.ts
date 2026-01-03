import { getArgs } from "./helpers/args.ts";

const initCLI = () => {
  const args = getArgs();
  console.log(args);
};

initCLI();
