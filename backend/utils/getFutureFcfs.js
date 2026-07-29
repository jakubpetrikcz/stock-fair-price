const getTerminalValue = require("./getTerminalValue.js");

const USER_DISCOUNT_RATE = 0.085;

const getFutureFcfs = (cashFlows, userGrowthRate) => {
  const lastValue = cashFlows[cashFlows.length - 1];

  const futureFCFs = {
    future: [lastValue],
    pvOfFFCF: [],
  };

  Array.from({ length: 9 }).forEach((_, index) => {
    const nextFCF = Number(
      (
        futureFCFs.future[futureFCFs.future.length - 1] *
        (1 + userGrowthRate / 100)
      ).toFixed(1),
    );
    futureFCFs.future.push(nextFCF);

    const nextPvOfFFCF = Number(
      (
        futureFCFs.future[futureFCFs.future.length - 1] /
        Math.pow(1 + USER_DISCOUNT_RATE, index + 1)
      ).toFixed(1),
    );
    futureFCFs.pvOfFFCF.push(nextPvOfFFCF);
  });

  futureFCFs.future.splice(0, 1);

  const { terminalValueFCF, terminalValuePVOfFFCF } = getTerminalValue(
    futureFCFs.future,
  );

  futureFCFs.future.push(terminalValueFCF);
  futureFCFs.pvOfFFCF.push(terminalValuePVOfFFCF);

  return futureFCFs;
};

module.exports = getFutureFcfs;
