import { useState } from 'react';
import { Dcf } from './features/dcf/Dcf';
import { STOCK_LIST } from './constants';

function App() {
  const [ticker, setTicker] = useState('');

  return (
    <div className='px-4 py-2'>
      <div className='flex gap-2 mt-10'>
        <span className='font-bold'>Stock:</span>
        <select
          name='tickers'
          id='ticker-select'
          onChange={(e) => setTicker(e.target.value)}
          className='border-b'
        >
          <option value=''>Nothing selected</option>
          {STOCK_LIST.map((stock) => (
            <option key={stock} value={stock}>
              {stock}
            </option>
          ))}
        </select>
      </div>
      {ticker && <Dcf ticker={ticker} />}
    </div>
  );
}

export default App;
