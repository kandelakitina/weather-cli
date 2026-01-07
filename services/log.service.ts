import { cyan, green, red } from "@std/fmt/colors";
import { dedent } from "@std/text/unstable-dedent";

const printError = (error: string) => {
  console.log(red(`${error}`));
};

const printSuccess = (message: string) => {
  console.log(green(`${message}`));
};

const printHelp = () => {
  console.log(dedent`${cyan("Help")}
    No params - shows weather
    -s [city] Sets city
    -h Shows help
    `);
};

export { printError, printHelp, printSuccess };
