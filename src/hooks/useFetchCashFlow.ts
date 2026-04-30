import { useEffect } from 'react';
import { FMP_API_BASE_URL } from '../constants';
import { roundToMillions } from '../utils/roundToMillions';

export const useFetchCashFlow = (
  stop: boolean,
  ticker: string,
  setFinancials: React.Dispatch<any>,
) => {
  useEffect(() => {
    if (stop) {
      return;
    }

    const fetchCashFlow = async () => {
      try {
        const response = await fetch(
          `${FMP_API_BASE_URL}/cash-flow-statement?symbol=${ticker}&limit=5&apikey=${import.meta.env.VITE_FMP_API_KEY}`,
        );
        const data = await response.json();
        const cashFlowsData = data
          .map((item) => roundToMillions(item.freeCashFlow))
          .reverse();

        const financials = JSON.parse(
          localStorage.getItem('financials') || '{}',
        );

        const cashFlowsLS = {
          ...financials,
          [ticker]: {
            ...financials[ticker],
            cashFlowsData,
          },
        };
        setFinancials((prev) => {
          return {
            ...prev,
            [ticker]: {
              ...prev[ticker],
              cashFlowsData,
            },
          };
        });
        localStorage.setItem('financials', JSON.stringify(cashFlowsLS));
      } catch {
        /* empty */
      }
    };

    fetchCashFlow();
  }, [setFinancials, stop, ticker]);
};
