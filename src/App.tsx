import './App.css';
import { useFetchBalanceSheet } from './hooks/useFetchBalanceSheet';
import { useFetchCashFlow } from './hooks/useFetchCashFlow';
import { useFetchSharesOutstanding } from './hooks/useFetchSharesOutstanding';

const USER_GROWTH_RATE = 0.18;
const PERPETUAL_GROWTH_RATE = 0.025;
const USER_DISCOUNT_RATE = 0.085;

function App() {
  const cashFlows = JSON.parse(localStorage.getItem('cashFlows') || '');
  const cashEquivalents = JSON.parse(
    localStorage.getItem('cashEquivalents') || '',
  );
  const totalDebt = JSON.parse(localStorage.getItem('totalDebt') || '');
  const sharesOutstanding = JSON.parse(
    localStorage.getItem('sharesOutstanding') || '',
  );

  useFetchCashFlow(Boolean(cashFlows));
  useFetchBalanceSheet(Boolean(cashEquivalents && totalDebt));
  useFetchSharesOutstanding(Boolean(sharesOutstanding));

  const growths = cashFlows
    .map((cashFlow, index) => {
      if (index === 0) {
        return;
      }
      return Number(
        (
          ((cashFlow - cashFlows[index - 1]) / cashFlows[index - 1]) *
          100
        ).toFixed(2),
      );
    })
    .filter(Boolean);

  const averageGrowthRate = Number(
    growths
      .reduce((sum, growth) => {
        return sum + growth;
      }, 0)
      .toFixed(2),
  );

  const lastValue = cashFlows[cashFlows.length - 1];

  const futureFCFs: Record<string, number[]> = {
    future: [lastValue],
    pvOfFFCF: [],
  };

  Array.from({ length: 9 }).forEach((_, index) => {
    const nextFCF = Number(
      (
        futureFCFs.future[futureFCFs.future.length - 1] *
        (1 + USER_GROWTH_RATE)
      ).toFixed(3),
    );
    futureFCFs.future.push(nextFCF);

    const nextPvOfFFCF = Number(
      (
        futureFCFs.future[futureFCFs.future.length - 1] /
        Math.pow(1 + USER_DISCOUNT_RATE, index + 1)
      ).toFixed(3),
    );
    futureFCFs.pvOfFFCF.push(nextPvOfFFCF);
  });

  futureFCFs.future.splice(0, 1);

  const terminalValueFCF = Number(
    (
      futureFCFs.future[futureFCFs.future.length - 1] *
      ((1 + PERPETUAL_GROWTH_RATE) /
        (USER_DISCOUNT_RATE - PERPETUAL_GROWTH_RATE))
    ).toFixed(3),
  );

  const terminalValuePVOfFFCF = Number(
    (terminalValueFCF / Math.pow(1 + USER_DISCOUNT_RATE, 10)).toFixed(3),
  );

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

  return <div>META: {fairPrice}</div>;
}

export default App;
