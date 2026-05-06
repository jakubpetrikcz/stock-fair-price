import { useEffect, type Dispatch, type SetStateAction } from 'react';
import type { FinancialType } from '../types';
import { FINANCIALS_LS_KEY, FMP_API_BASE_URL } from '../../../constants';
import { roundToMillions } from '../../../utils/roundToMillions';

type CashFlowStatementData = {
  freeCashFlow: number;
  date: string;
  [key: string]: unknown;
};

export const useFetchCashFlow = (
  stop: boolean,
  ticker: string,
  setFinancials: Dispatch<SetStateAction<FinancialType>>,
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
          .map((item: CashFlowStatementData) => {
            return {
              date: item.date,
              cashFlow: roundToMillions(item.freeCashFlow),
            };
          })
          .reverse();

        const financials = JSON.parse(
          localStorage.getItem(FINANCIALS_LS_KEY) || '{}',
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
        localStorage.setItem(FINANCIALS_LS_KEY, JSON.stringify(cashFlowsLS));
      } catch {
        /* empty */
      }
    };

    fetchCashFlow();
  }, [setFinancials, stop, ticker]);
};
