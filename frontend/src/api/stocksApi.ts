import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { FutureFcfs, Stock, StockPrice } from '../types';
import { API_URL } from '../api';
import { STOCK } from '../constants';

export const stocksApi = createApi({
  reducerPath: 'stocksApi',
  tagTypes: [STOCK],
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  endpoints: (builder) => ({
    getStocks: builder.query<Stock[], void>({
      query: () => '/stocks',
    }),
    getStock: builder.query<Stock, string>({
      query: (ticker) => `/stocks/${ticker}`,
      providesTags: [STOCK],
    }),
    getStockPrice: builder.query<StockPrice, string>({
      query: (ticker) => `/stocks/${ticker}/price`,
    }),
    updateStockDcfPrice: builder.mutation<
      { futureFcfs: FutureFcfs; fairPrice: number },
      { ticker: string; userGrowthRate: number }
    >({
      query: ({ ticker, userGrowthRate }) => ({
        url: `/stocks/${ticker}/dcf`,
        method: 'PUT',
        body: { userGrowthRate },
      }),
      invalidatesTags: [STOCK],
    }),
  }),
});

export const {
  useGetStocksQuery,
  useGetStockQuery,
  useGetStockPriceQuery,
  useUpdateStockDcfPriceMutation,
} = stocksApi;
