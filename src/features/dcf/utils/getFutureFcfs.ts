import { USER_DISCOUNT_RATE } from './calculateDcfFairPrice';

export const getFutureFcfs = (cashFlows: number[], userGrowthRate: number) => {
  const lastValue = cashFlows[cashFlows.length - 1];

  const futureFCFs: Record<string, number[]> = {
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

  return futureFCFs;
};
