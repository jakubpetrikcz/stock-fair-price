import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const stocksApi = createApi({
  reducerPath: 'stocksApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
  endpoints: (builder) => ({
    getStocks: builder.query<Record<string, any>[], void>({
      query: () => '/stocks',
    }),
    getStock: builder.query<Record<string, any>, string>({
      query: (ticker) => `/stocks/${ticker}`,
    }),
  }),
});

export const { useGetStocksQuery, useGetStockQuery } = stocksApi;
