import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { FMP_API_BASE_URL } from '../../../constants';

const FMP_API_KEY = import.meta.env.VITE_FMP_API_KEY;

export const dcfFinancialsApi = createApi({
  reducerPath: 'dcfFinancialsApi',
  baseQuery: fetchBaseQuery({ baseUrl: FMP_API_BASE_URL }),
  endpoints: (build) => ({
    getCashFlows: build.query({
      query: (ticker: string) =>
        `cash-flow-statement?symbol=${ticker}&limit=5&apikey=${FMP_API_KEY}`,
    }),
    getBalanceSheet: build.query({
      query: (ticker: string) =>
        `balance-sheet-statement?symbol=${ticker}&apikey=${FMP_API_KEY}`,
    }),
    getSharesOutstanding: build.query({
      query: (ticker: string) =>
        `shares-float?symbol=${ticker}&apikey=${FMP_API_KEY}`,
    }),
  }),
});

export const {
  useGetCashFlowsQuery,
  useGetBalanceSheetQuery,
  useGetSharesOutstandingQuery,
} = dcfFinancialsApi;
