import { cyan, green, red } from "@std/fmt/colors";
import { dedent } from "@std/text/unstable-dedent";

const printError = (error: string) => {
  console.log(red(`Error received: ${error}`));
};

const printSuccess = (message: string) => {
  console.log(green(`Message received: ${message}`));
};

const printHelp = () => {
  console.log(dedent`${cyan("Help")}
    No params - shows weather
    -s [city] Sets city
    -h Shows help
    -t [API_KEY] Sets open-weather API key
    `);
};

export { printError, printHelp, printSuccess };
