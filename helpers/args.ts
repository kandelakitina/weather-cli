const getArgs = (args: string[]) => {
  const result: { s?: string[], l?: string, h?: boolean } = {};
  const cities: string[] = [];
  let i = 0;
  while (i < args.length) {
    if (args[i] === '-s') {
      i++;
      while (i < args.length && !args[i].startsWith('-')) {
        cities.push(args[i]);
        i++;
      }
      result.s = cities;
    } else if (args[i] === '-l') {
      i++;
      if (i < args.length) {
        result.l = args[i];
        i++;
      }
    } else if (args[i] === '-h') {
      result.h = true;
      i++;
    } else {
      i++;
    }
  }
  return result;
};

export { getArgs };
