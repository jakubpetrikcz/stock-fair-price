type TickerData = {
  cashEquivalents: number;
  cashFlowsData: number[];
  sharesOutstanding: number;
  totalDebt: number;
};

export type FinancialType = {
  [ticker: string]: TickerData;
};
