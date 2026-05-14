import type { RootState } from '../../../stores/store';
import type { CashFlowData } from '../types';

export const cashFlowsSelector =
  (ticker: string) =>
  (state: RootState): CashFlowData[] | undefined =>
    state.dcfFinancials.financials[ticker]?.cashFlowsData;

export const cashEquivalentsSelector =
  (ticker: string) =>
  (state: RootState): number | undefined =>
    state.dcfFinancials.financials[ticker]?.cashEquivalents;

export const totalDebtSelector =
  (ticker: string) =>
  (state: RootState): number | undefined =>
    state.dcfFinancials.financials[ticker]?.totalDebt;

export const sharesOutstandingSelector =
  (ticker: string) =>
  (state: RootState): number | undefined =>
    state.dcfFinancials.financials[ticker]?.sharesOutstanding;
