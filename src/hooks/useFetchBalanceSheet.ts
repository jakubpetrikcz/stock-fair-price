import { useEffect } from 'react';

export const useFetchBalanceSheet = (stop: boolean) => {
  useEffect(() => {
    if (stop) {
      return;
    }
    const fetchBalanceSheet = async () => {
      try {
        const response = await fetch(
          `https://financialmodelingprep.com/stable/balance-sheet-statement?symbol=META&apikey=${import.meta.env.VITE_FMP_API_KEY}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        const data = await response.json();
        const cashEquivalents = Number(
          (Math.round(data[0].cashAndShortTermInvestments) / 1000000).toFixed(
            3,
          ),
        );
        const totalDebt = Number(
          (
            Math.round(data[0].shortTermDebt + data[0].longTermDebt) / 1000000
          ).toFixed(3),
        );
        localStorage.setItem(
          'cashEquivalents',
          JSON.stringify(cashEquivalents),
        );
        localStorage.setItem('totalDebt', JSON.stringify(totalDebt));
      } catch {
        /* empty */
      }
    };

    fetchBalanceSheet();
  }, [stop]);
};
