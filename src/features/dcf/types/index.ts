export type CashFlowData = {
  date: string;
  cashFlow: number;
};

export type TickerData = {
  cashEquivalents?: number;
  cashFlowsData?: CashFlowData[];
  sharesOutstanding?: number;
  totalDebt?: number;
};

export type FinancialType = {
  [ticker: string]: TickerData;
};

export type DcfFinancialsState = {
  financials: FinancialType;
};

export type CashFlowStatementData = {
  freeCashFlow: number;
  date: string;
  [key: string]: unknown;
};

export type BalanceSheetStatementData = {
  cashAndShortTermInvestments: number;
  shortTermDebt: number;
  longTermDebt: number;
  [key: string]: unknown;
};

export type SharesFloatStatementData = {
  outstandingShares: number;
  [key: string]: unknown;
};
