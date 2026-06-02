import { getTerminalValue } from './getTerminalValue';

export const calculateDcfFairPrice = (
  cashEquivalents: number,
  totalDebt: number,
  sharesOutstanding: number,
  futureFcfs: Record<string, number[]>,
) => {
  const { terminalValuePVOfFFCF } = getTerminalValue(futureFcfs.future);

  const allPvOfFfcf = [...futureFcfs.pvOfFFCF, terminalValuePVOfFFCF];

  const sumOfFFCF = Number(
    allPvOfFfcf.reduce((sum, pv) => sum + pv, 0).toFixed(),
  );

  const equityValue = sumOfFFCF + cashEquivalents - totalDebt;

  const fairPrice = Number((equityValue / sharesOutstanding).toFixed(2));

  return fairPrice;
};
