import { useEffect } from 'react';
import { FMP_API_BASE_URL } from '../constants';
import { roundToMillions } from '../utils/roundToMillions';

export const useFetchBalanceSheet = (
  stop: boolean,
  ticker: string,
  setFinancials: React.Dispatch<any>,
) => {
  useEffect(() => {
    if (stop) {
      return;
    }

    const fetchBalanceSheet = async () => {
      try {
        const response = await fetch(
          `${FMP_API_BASE_URL}/balance-sheet-statement?symbol=${ticker}&apikey=${import.meta.env.VITE_FMP_API_KEY}`,
        );
        const data = await response.json();
        const cashEquivalents = roundToMillions(
          data[0].cashAndShortTermInvestments,
        );
        const totalDebt = roundToMillions(
          data[0].shortTermDebt + data[0].longTermDebt,
        );

        const financials = JSON.parse(
          localStorage.getItem('financials') || '{}',
        );

        const balanceSheetsLS = {
          ...financials,
          [ticker]: {
            ...financials[ticker],
            cashEquivalents,
            totalDebt,
          },
        };

        setFinancials((prev) => {
          return {
            ...prev,
            [ticker]: {
              ...prev[ticker],
              cashEquivalents,
              totalDebt,
            },
          };
        });
        localStorage.setItem('financials', JSON.stringify(balanceSheetsLS));
      } catch {
        /* empty */
      }
    };

    fetchBalanceSheet();
  }, [setFinancials, stop, ticker]);
};
