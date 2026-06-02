export const roundToMillions = (value: number, toFixed = 3) =>
  Number((Math.round(value) / 1000000).toFixed(toFixed));
