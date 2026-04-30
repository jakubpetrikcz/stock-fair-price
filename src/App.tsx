import { useState } from 'react';
import './App.css';
import { useFetchBalanceSheet } from './hooks/useFetchBalanceSheet';
import { useFetchCashFlow } from './hooks/useFetchCashFlow';
import { useFetchSharesOutstanding } from './hooks/useFetchSharesOutstanding';
import { calculateDcfFairPrice } from './utils/calculateDcfFairPrice';

function App() {
  const [ticker, setTicker] = useState('AAPL');

  const financialsLS = JSON.parse(localStorage.getItem('financials') || '{}');

  const [financials, setFinancials] = useState(financialsLS);
  const tickerFinancials = financials?.[ticker];

  console.log('financials', financials);
  console.log('tickerFinancials', tickerFinancials);

  const cashFlows = tickerFinancials?.cashFlowsData || [];
  const cashEquivalents = tickerFinancials?.cashEquivalents;
  const totalDebt = tickerFinancials?.totalDebt;
  const sharesOutstanding = tickerFinancials?.sharesOutstanding;

  console.log('cashFlows', cashFlows);
  console.log('cashEquivalents', cashEquivalents);
  console.log('totalDebt', totalDebt);
  console.log('sharesOutstanding', sharesOutstanding);

  useFetchCashFlow(cashFlows.length > 0, ticker, setFinancials);
  useFetchBalanceSheet(
    Boolean(cashEquivalents && totalDebt),
    ticker,
    setFinancials,
  );
  useFetchSharesOutstanding(Boolean(sharesOutstanding), ticker, setFinancials);

  const fairPrice = calculateDcfFairPrice(
    cashFlows,
    cashEquivalents,
    totalDebt,
    sharesOutstanding,
  );

  return (
    <div>
      <select
        name='tickers'
        id='ticker-select'
        onChange={(e) => setTicker(e.target.value)}
      >
        {['AAPL', 'META'].map((ticker) => {
          return (
            <option key={ticker} value={ticker}>
              {ticker}
            </option>
          );
        })}
      </select>
      {ticker}: {fairPrice}
    </div>
  );
}

export default App;
