import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { FINANCIALS_LS_KEY, FMP_API_BASE_URL } from '../constants';
import { roundToMillions } from '../utils/roundToMillions';
import type { FinancialType } from '../features/dcf/types';

export const useFetchSharesOutstanding = (
  stop: boolean,
  ticker: string,
  setFinancials: Dispatch<SetStateAction<FinancialType>>,
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
          localStorage.getItem(FINANCIALS_LS_KEY) || '{}',
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
        localStorage.setItem(
          FINANCIALS_LS_KEY,
          JSON.stringify(sharesOutstandingLS),
        );
      } catch {
        /* empty */
      }
    };

    fetchBalanceSheet();
  }, [setFinancials, stop, ticker]);
};
