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

export type StockPrice = {
  ticker: string;
  price: number;
  currency?: string | null;
};

type FreeCashFlow = {
  date: string;
  value: number;
};

export type StockOptionType = Pick<Stock, 'ticker' | 'name'>;
