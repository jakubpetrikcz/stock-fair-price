import { configureStore } from '@reduxjs/toolkit';
import { dcfFinancialsApi } from '../features/dcf/api/dcfFinancialsApi';

const apis = {
  [dcfFinancialsApi.reducerPath]: dcfFinancialsApi.reducer,
};

const slices = {};

const middlewares = [dcfFinancialsApi.middleware];

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
