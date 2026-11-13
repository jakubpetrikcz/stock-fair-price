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
  dcf_fair_value: number;
  dcf_growth_rate: number;
  dcf_future_fcfs: FutureFcfs;
};

export type DcfStock = {
  growth_rate: number;
  future_fcfs: FutureFcfs;
  fair_value: number;
}

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

type FutureFcfs = {
  future: number[];
  pvOfFFCF: number[];
};

export type UpdateStockDcfPriceRequest = {
  ticker: string;
  userGrowthRate: number;
};

export type UpdateStockDcfPriceResponse = {
  futureFcfs: FutureFcfs;
  fairPrice: number;
};
