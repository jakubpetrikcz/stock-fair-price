import { useEffect } from 'react';

export const useFetchCashFlow = (stop: boolean) => {
  useEffect(() => {
    if (stop) {
      return;
    }
    const fetchCashFlow = async () => {
      try {
        const response = await fetch(
          `https://financialmodelingprep.com/stable/cash-flow-statement?symbol=META&limit=5&apikey=${import.meta.env.VITE_FMP_API_KEY}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        const data = await response.json();
        const cashFlowsData = data
          .map((item) =>
            Number((Math.round(item.freeCashFlow) / 1000000).toFixed(3)),
          )
          .reverse();
        localStorage.setItem('cashFlows', JSON.stringify(cashFlowsData));
      } catch {
        /* empty */
      }
    };

    fetchCashFlow();
  }, [stop]);
};
