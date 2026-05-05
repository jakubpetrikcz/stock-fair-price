import { useState } from 'react';
import './App.css';
import { Dcf } from './features/dcf/Dcf';
import { useFetchStockList } from './hooks/useFetchStockList';
import { STOCK_LIST_LS_KEY } from './constants';

export type StockItem = {
  symbol: string;
  companyName: string;
};

function App() {
  const stockListLS = JSON.parse(
    localStorage.getItem(STOCK_LIST_LS_KEY) || '[]',
  );
  const [stockList, setStockList] = useState<StockItem[]>(stockListLS);
  const [ticker, setTicker] = useState('');

  useFetchStockList(stockList.length > 0, setStockList);

  return (
    <div>
      <select
        name='tickers'
        id='ticker-select'
        onChange={(e) => setTicker(e.target.value)}
      >
        <option value=''>Nothing selected</option>
        {stockList.map((stock) => {
          return (
            <option key={stock.symbol} value={stock.symbol}>
              {stock.symbol} - {stock.companyName}
            </option>
          );
        })}
      </select>
      {ticker && <Dcf ticker={ticker} />}
    </div>
  );
}

export default App;
