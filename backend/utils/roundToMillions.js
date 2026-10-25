const roundToMillions = (value, toFixed = 3) =>
  Number((Math.round(value) / 1000000).toFixed(toFixed));

module.exports = roundToMillions;
