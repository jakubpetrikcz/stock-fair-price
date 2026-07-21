import { configureStore } from '@reduxjs/toolkit';
import { stocksApi } from '../api/stocksApi';
import { stocksSlice } from '../components/StockAutocomplete/stores/stocksSlice';
import { favoritesApi } from '../features/favorites/api/favoritesApi';

const apis = {
  [stocksApi.reducerPath]: stocksApi.reducer,
  [favoritesApi.reducerPath]: favoritesApi.reducer,
};

const slices = {
  [stocksSlice.name]: stocksSlice.reducer,
};

const middlewares = [stocksApi.middleware, favoritesApi.middleware];

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
