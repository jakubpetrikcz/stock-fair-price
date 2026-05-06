import { USER_DISCOUNT_RATE } from './calculateDcfFairPrice';

const PERPETUAL_GROWTH_RATE = 0.025;

export const getTerminalValue = (futureFCFs: number[]) => {
  const terminalValueFCF = Number(
    (
      futureFCFs[futureFCFs.length - 1] *
      ((1 + PERPETUAL_GROWTH_RATE) /
        (USER_DISCOUNT_RATE - PERPETUAL_GROWTH_RATE))
    ).toFixed(1),
  );

  const terminalValuePVOfFFCF = Number(
    (terminalValueFCF / Math.pow(1 + USER_DISCOUNT_RATE, 10)).toFixed(1),
  );

  return { terminalValueFCF, terminalValuePVOfFFCF };
};
