import { configureStore } from '@reduxjs/toolkit';
import { stocksApi } from '../api/stocksApi';

const apis = {
  [stocksApi.reducerPath]: stocksApi.reducer,
};

const slices = {};

const middlewares = [stocksApi.middleware];

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
