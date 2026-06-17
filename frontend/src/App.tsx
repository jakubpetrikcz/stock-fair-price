import { useState } from 'react';
import { Dcf } from './features/dcf/Dcf';
import { useGetStocksQuery } from './features/dcf/api/stocksApi';

function App() {
  const [ticker, setTicker] = useState('');
  const { data: stocks, isLoading, isError } = useGetStocksQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!stocks || isError) {
    return <div>Error...</div>;
  }

  const stockTickers = stocks?.map((stock) => ({
    ticker: stock.ticker,
    name: stock.name,
  }));

  return (
    <div className='px-4 py-2'>
      <div className='flex gap-2 mt-10'>
        <span className='font-bold'>Stock:</span>
        <select
          name='tickers'
          id='ticker-select'
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          className='border-b'
        >
          <option value=''>Nothing selected</option>
          {stockTickers.map((stock) => (
            <option key={stock.ticker} value={stock.ticker}>
              {stock.name} - {stock.ticker}
            </option>
          ))}
        </select>
      </div>
      {ticker && <Dcf ticker={ticker} />}
    </div>
  );
}

export default App;
