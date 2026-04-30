export const roundToMillions = (value: number, toFixed = 3) => {
  return Number((Math.round(value) / 1000000).toFixed(toFixed));
};
