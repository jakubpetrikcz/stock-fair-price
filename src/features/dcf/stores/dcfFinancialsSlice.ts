import { createSlice } from '@reduxjs/toolkit';
import { dcfFinancialsApi } from '../api/dcfFinancialsApi';
import type { CashFlowStatementData, DcfFinancialsState } from '../types';
import { FINANCIALS_LS_KEY } from '../../../constants';
import { roundToMillions } from '../../../utils/roundToMillions';

const initialState: DcfFinancialsState = {
  financials: JSON.parse(localStorage.getItem(FINANCIALS_LS_KEY) || '{}'),
};

export const dcfFinancialsSlice = createSlice({
  name: 'dcfFinancials',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      dcfFinancialsApi.endpoints.getCashFlows.matchFulfilled,
      (state, { payload, meta }) => {
        const ticker = meta.arg.originalArgs;
        const cashFlowsData = payload
          .map((item: CashFlowStatementData) => ({
            date: item.date,
            cashFlow: roundToMillions(item.freeCashFlow),
          }))
          .reverse();
        if (ticker) {
          if (!state.financials[ticker]) {
            state.financials[ticker] = {};
          }
          state.financials[ticker].cashFlowsData = cashFlowsData;
        }
      },
    );
    builder.addMatcher(
      dcfFinancialsApi.endpoints.getBalanceSheet.matchFulfilled,
      (state, { payload, meta }) => {
        const ticker = meta.arg.originalArgs;
        const cashEquivalents = roundToMillions(
          payload[0].cashAndShortTermInvestments,
        );
        const totalDebt = roundToMillions(
          payload[0].shortTermDebt + payload[0].longTermDebt,
        );
        if (ticker) {
          if (!state.financials[ticker]) {
            state.financials[ticker] = {};
          }
          state.financials[ticker].cashEquivalents = cashEquivalents;
          state.financials[ticker].totalDebt = totalDebt;
        }
      },
    );
    builder.addMatcher(
      dcfFinancialsApi.endpoints.getSharesOutstanding.matchFulfilled,
      (state, { payload, meta }) => {
        const ticker = meta.arg.originalArgs;
        const sharesOutstanding = roundToMillions(
          payload[0].outstandingShares,
          1,
        );
        if (ticker) {
          if (!state.financials[ticker]) {
            state.financials[ticker] = {};
          }
          state.financials[ticker].sharesOutstanding = sharesOutstanding;
        }
      },
    );
  },
});
