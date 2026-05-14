import { configureStore } from '@reduxjs/toolkit';
import { dcfFinancialsApi } from '../features/dcf/api/dcfFinancialsApi';
import { dcfFinancialsSlice } from '../features/dcf/stores/dcfFinancialsSlice';
import { localStorageMiddleware } from './localStorage.middleware';

const apis = {
  [dcfFinancialsApi.reducerPath]: dcfFinancialsApi.reducer,
};

const slices = {
  [dcfFinancialsSlice.name]: dcfFinancialsSlice.reducer,
};

const middlewares = [dcfFinancialsApi.middleware, localStorageMiddleware];

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
