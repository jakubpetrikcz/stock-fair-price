import { useState } from 'react';
import './App.css';
import { Dcf } from './features/dcf/Dcf';
import { STOCK_TICKERS } from './constants';

function App() {
  const [ticker, setTicker] = useState(STOCK_TICKERS[0]);

  return (
    <div>
      <select
        name='tickers'
        id='ticker-select'
        onChange={(e) => setTicker(e.target.value)}
      >
        {STOCK_TICKERS.map((ticker) => {
          return (
            <option key={ticker} value={ticker}>
              {ticker}
            </option>
          );
        })}
      </select>
      <Dcf ticker={ticker} />
    </div>
  );
}

export default App;
