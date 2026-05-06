type CashFlowData = {
  date: string;
  cashFlow: number;
};

type TickerData = {
  cashEquivalents: number;
  cashFlowsData: CashFlowData[];
  sharesOutstanding: number;
  totalDebt: number;
};

export type FinancialType = {
  [ticker: string]: TickerData;
};
