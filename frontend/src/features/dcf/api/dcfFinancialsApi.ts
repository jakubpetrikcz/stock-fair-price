import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { FINANCIALS_LS_KEY, FMP_API_BASE_URL } from '../../../constants';
import type {
  BalanceSheetStatementData,
  CashFlowData,
  CashFlowStatementData,
  SharesFloatStatementData,
} from '../types';
import { roundToMillions } from '../../../utils/roundToMillions';

const FMP_API_KEY = import.meta.env.VITE_FMP_API_KEY;

const getCachedFinancials = () => {
  const cached = localStorage.getItem(FINANCIALS_LS_KEY);
  return cached ? JSON.parse(cached) : {};
};

const updateCachedFinancials = (
  ticker: string,
  updates: Record<string, unknown>,
) => {
  const financials = getCachedFinancials();
  financials[ticker] = {
    ...(financials[ticker] || {}),
    ...updates,
  };
  localStorage.setItem(FINANCIALS_LS_KEY, JSON.stringify(financials));
};

export const dcfFinancialsApi = createApi({
  reducerPath: 'dcfFinancialsApi',
  baseQuery: fetchBaseQuery({ baseUrl: FMP_API_BASE_URL }),
  endpoints: (build) => ({
    getCashFlows: build.query<CashFlowData[], string>({
      async queryFn(ticker, _api, _extraOptions, baseQuery) {
        const financials = getCachedFinancials();

        if (financials[ticker]?.cashFlowsData) {
          return { data: financials[ticker].cashFlowsData };
        }

        const result = await baseQuery(
          `cash-flow-statement?symbol=${ticker}&limit=5&apikey=${FMP_API_KEY}`,
        );

        const rawData = result.data as CashFlowStatementData[];
        const cashFlowsData = rawData
          .map((item) => ({
            date: item.date,
            cashFlow: roundToMillions(item.freeCashFlow),
          }))
          .reverse();

        updateCachedFinancials(ticker, { cashFlowsData });

        return { data: cashFlowsData };
      },
    }),
    getBalanceSheet: build.query<
      { cashEquivalents: number; totalDebt: number },
      string
    >({
      async queryFn(ticker, _api, _extraOptions, baseQuery) {
        const financials = getCachedFinancials();

        if (
          financials[ticker]?.cashEquivalents &&
          financials[ticker]?.totalDebt
        ) {
          return {
            data: {
              cashEquivalents: financials[ticker].cashEquivalents,
              totalDebt: financials[ticker].totalDebt,
            },
          };
        }

        const result = await baseQuery(
          `balance-sheet-statement?symbol=${ticker}&apikey=${FMP_API_KEY}`,
        );

        const rawData = result.data as BalanceSheetStatementData[];
        const cashEquivalents = roundToMillions(
          rawData[0].cashAndShortTermInvestments,
        );
        const totalDebt = roundToMillions(
          rawData[0].shortTermDebt + rawData[0].longTermDebt,
        );

        updateCachedFinancials(ticker, {
          cashEquivalents,
          totalDebt,
        });

        return { data: { cashEquivalents, totalDebt } };
      },
    }),
    getSharesOutstanding: build.query<number, string>({
      async queryFn(ticker, _api, _extraOptions, baseQuery) {
        const financials = getCachedFinancials();

        if (financials[ticker]?.sharesOutstanding) {
          return { data: financials[ticker].sharesOutstanding };
        }

        const result = await baseQuery(
          `shares-float?symbol=${ticker}&apikey=${FMP_API_KEY}`,
        );

        const rawData = result.data as SharesFloatStatementData[];
        const sharesOutstanding = roundToMillions(
          rawData[0].outstandingShares,
          1,
        );

        updateCachedFinancials(ticker, { sharesOutstanding });

        return { data: sharesOutstanding };
      },
    }),
  }),
});

export const {
  useGetCashFlowsQuery,
  useGetBalanceSheetQuery,
  useGetSharesOutstandingQuery,
} = dcfFinancialsApi;
