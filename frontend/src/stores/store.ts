import { configureStore } from '@reduxjs/toolkit';
import { stocksApi } from '../api/stocksApi';
import { stocksSlice } from '../components/StockAutocomplete/stores/stocksSlice';

const apis = {
  [stocksApi.reducerPath]: stocksApi.reducer,
};

const slices = {
  [stocksSlice.name]: stocksSlice.reducer,
};

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
