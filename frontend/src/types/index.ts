export type Stock = {
  id: string;
  name: string;
  ticker: string;
  cik: string;
  exchange: string;
  free_cash_flow: FreeCashFlow[];
  cash_equivalents: string;
  total_debt: string;
  shares_outstanding: string;
};

type FreeCashFlow = {
  date: string;
  value: number;
};
