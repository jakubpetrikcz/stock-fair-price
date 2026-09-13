import { configureStore } from '@reduxjs/toolkit';
import { stocksApi } from '../api/stocksApi';
import { stocksSlice } from '../components/StockAutocomplete/stores/stocksSlice';
import { favoritesApi } from '../features/favorites/api/favoritesApi';
import { authApi } from './service/authApi';

const apis = {
  [stocksApi.reducerPath]: stocksApi.reducer,
  [favoritesApi.reducerPath]: favoritesApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
};

const slices = {
  [stocksSlice.name]: stocksSlice.reducer,
};

const middlewares = [
  stocksApi.middleware,
  favoritesApi.middleware,
  authApi.middleware,
];

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
