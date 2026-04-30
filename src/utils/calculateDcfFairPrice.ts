import { getFutureFcfs } from './getFutureFcfs';
import { getTerminalValue } from './getTerminalValue';

export const USER_DISCOUNT_RATE = 0.085;

export const calculateDcfFairPrice = (
  cashFlows: number[],
  cashEquivalents: number,
  totalDebt: number,
  sharesOutstanding: number,
) => {
  const futureFCFs = getFutureFcfs(cashFlows);

  const { terminalValuePVOfFFCF } = getTerminalValue(futureFCFs.future);

  futureFCFs.pvOfFFCF.splice(
    futureFCFs.pvOfFFCF.length,
    0,
    terminalValuePVOfFFCF,
  );

  const sumOfFFCF = Number(
    futureFCFs.pvOfFFCF
      .reduce((sum, pv) => {
        return sum + pv;
      }, 0)
      .toFixed(),
  );

  const equityValue = sumOfFFCF + cashEquivalents - totalDebt;

  const fairPrice = Number((equityValue / sharesOutstanding).toFixed(2));

  return fairPrice;
};
