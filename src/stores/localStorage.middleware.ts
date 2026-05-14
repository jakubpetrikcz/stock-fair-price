import type { Middleware } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { FINANCIALS_LS_KEY } from '../constants';

export const localStorageMiddleware: Middleware =
  (storeApi) => (next) => (action) => {
    const result = next(action);

    const state = storeApi.getState() as RootState;

    localStorage.setItem(
      FINANCIALS_LS_KEY,
      JSON.stringify(state.dcfFinancials.financials),
    );

    return result;
  };
