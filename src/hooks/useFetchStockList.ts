import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { FMP_API_BASE_URL, STOCK_LIST_LS_KEY } from '../constants';
import type { StockItem } from '../App';

export const useFetchStockList = (
  stop: boolean,
  setStockList: Dispatch<SetStateAction<StockItem[]>>,
) => {
  useEffect(() => {
    if (stop) {
      return;
    }

    const fetchBalanceSheet = async () => {
      try {
        const response = await fetch(
          `${FMP_API_BASE_URL}/stock-list?apikey=${import.meta.env.VITE_FMP_API_KEY}`,
        );
        const data = await response.json();

        setStockList(data);
        localStorage.setItem(STOCK_LIST_LS_KEY, JSON.stringify(data));
      } catch {
        /* empty */
      }
    };

    fetchBalanceSheet();
  }, [setStockList, stop]);
};
