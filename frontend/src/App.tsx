import { useState } from 'react';
import { Dcf } from './features/dcf/Dcf';
import { useGetStocksQuery } from './api/stocksApi';
import { Autocomplete } from './components/Autocomplete';
import type { StockOptionType } from './types';
import { StockOption } from './components/StockOption';

function App() {
  const [selected, setSelected] = useState('');

  const { data: stocks, isLoading, isError } = useGetStocksQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!stocks || isError) {
    return <div>Error...</div>;
  }

  const stockOptions: StockOptionType[] = stocks.map((stock) => ({
    ticker: stock.ticker,
    name: stock.name,
  }));

  const selectedTicker = selected?.split('-')[0].trim();

  return (
    <div className='px-4 py-2'>
      <div className='flex gap-2 mt-10'>
        <span className='font-bold mt-1.5'>Stock:</span>
        <Autocomplete
          name='tickers'
          renderOptions={(setValue, value, setFocused) => {
            const normalizeValue = value.toLowerCase();
            return normalizeValue === selected.toLowerCase()
              ? stockOptions.map((stock) => (
                  <StockOption
                    key={stock.ticker}
                    stock={stock}
                    setSelected={setSelected}
                    setValue={setValue}
                    setFocused={setFocused}
                  />
                ))
              : stockOptions
                  .filter((stock) => {
                    const stockSelect =
                      `${stock.ticker} - ${stock.name}`.toLowerCase();
                    return stockSelect.includes(normalizeValue);
                  })
                  .map((stock) => (
                    <StockOption
                      key={stock.ticker}
                      stock={stock}
                      setSelected={setSelected}
                      setValue={setValue}
                      setFocused={setFocused}
                    />
                  ));
          }}
          onClear={() => setSelected('')}
        />
      </div>
      {selectedTicker && <Dcf ticker={selectedTicker} />}
    </div>
  );
}

export default App;
