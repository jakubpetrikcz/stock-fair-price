import { configureStore } from '@reduxjs/toolkit';
import { dcfFinancialsApi } from '../features/dcf/api/dcfFinancialsApi';
import { stocksApi } from '../features/dcf/api/stocksApi';

const apis = {
  [dcfFinancialsApi.reducerPath]: dcfFinancialsApi.reducer,
  [stocksApi.reducerPath]: stocksApi.reducer,
};

const slices = {};

const middlewares = [dcfFinancialsApi.middleware, stocksApi.middleware];

export const store = configureStore({
  reducer: {
    ...apis,
    ...slices,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(...middlewares),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
