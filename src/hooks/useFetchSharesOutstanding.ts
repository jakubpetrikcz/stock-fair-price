import { useEffect } from 'react';

export const useFetchSharesOutstanding = (stop: boolean) => {
  useEffect(() => {
    if (stop) {
      return;
    }
    const fetchBalanceSheet = async () => {
      try {
        const response = await fetch(
          `https://financialmodelingprep.com/stable/shares-float?symbol=META&apikey=${import.meta.env.VITE_FMP_API_KEY}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        const data = await response.json();
        const sharesOutstanding = Number(
          Math.round(data[0].outstandingShares / 1000000).toFixed(1),
        );
        localStorage.setItem(
          'sharesOutstanding',
          JSON.stringify(sharesOutstanding),
        );
      } catch {
        /* empty */
      }
    };

    fetchBalanceSheet();
  }, [stop]);
};
