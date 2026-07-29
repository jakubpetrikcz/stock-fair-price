import { useGetStocksQuery } from '../../api/stocksApi';
import type { StockOptionType } from '../../types';
import { Autocomplete } from '../Autocomplete/Autocomplete';
import { StockOption } from '../Autocomplete/StockOption';
import { useDispatch, useSelector } from 'react-redux';
import { selectStock } from './stores/stocksSlice';
import type { AppDispatch } from '../../stores/store';
import { selectedStockSelector } from './stores/selectors';

export const StockAutocomplete = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedStock = useSelector(selectedStockSelector);

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

  const onSelected = (value: string) => dispatch(selectStock(value));

  return (
    <div className='flex gap-2'>
      <span className='font-bold mt-1.5'>Stock:</span>
      <Autocomplete
        name='tickers'
        renderOptions={(setValue, value, setFocused) => {
          const normalizeValue = value.toLowerCase();
          return normalizeValue === selectedStock.toLowerCase()
            ? stockOptions.map((stock) => (
                <StockOption
                  key={stock.ticker}
                  stock={stock}
                  setSelected={onSelected}
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
                    setSelected={onSelected}
                    setValue={setValue}
                    setFocused={setFocused}
                  />
                ));
        }}
        onClear={() => dispatch(selectStock(''))}
        selectedValue={selectedStock}
      />
    </div>
  );
};
