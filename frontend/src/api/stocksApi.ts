import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Stock, StockPrice } from '../types';

export const stocksApi = createApi({
  reducerPath: 'stocksApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
  endpoints: (builder) => ({
    getStocks: builder.query<Stock[], void>({
      query: () => '/stocks',
    }),
    getStock: builder.query<Stock, string>({
      query: (ticker) => `/stocks/${ticker}`,
    }),
    getStockPrice: builder.query<StockPrice, string>({
      query: (ticker) => `/stocks/${ticker}/price`,
    }),
  }),
});

export const { useGetStocksQuery, useGetStockQuery, useGetStockPriceQuery } =
  stocksApi;
