import { useEffect } from 'react';
import { FMP_API_BASE_URL } from '../constants';
import { roundToMillions } from '../utils/roundToMillions';

export const useFetchSharesOutstanding = (
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
          `${FMP_API_BASE_URL}/shares-float?symbol=${ticker}&apikey=${import.meta.env.VITE_FMP_API_KEY}`,
        );
        const data = await response.json();
        const sharesOutstanding = roundToMillions(data[0].outstandingShares, 1);

        const financials = JSON.parse(
          localStorage.getItem('financials') || '{}',
        );

        const sharesOutstandingLS = {
          ...financials,
          [ticker]: {
            ...financials[ticker],
            sharesOutstanding,
          },
        };
        setFinancials((prev) => {
          return {
            ...prev,
            [ticker]: {
              ...prev[ticker],
              sharesOutstanding,
            },
          };
        });
        localStorage.setItem('financials', JSON.stringify(sharesOutstandingLS));
      } catch {
        /* empty */
      }
    };

    fetchBalanceSheet();
  }, [setFinancials, stop, ticker]);
};
