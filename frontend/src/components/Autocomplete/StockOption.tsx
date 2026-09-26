import { type SetStateAction } from 'react';
import type { StockOptionType } from '../../types/stock';

type StockOptionProps = {
  stock: StockOptionType;
  setSelected: (value: string) => void;
  setValue: (value: SetStateAction<string>) => void;
  setFocused: (value: SetStateAction<boolean>) => void;
};

export const StockOption = ({
  stock,
  setSelected,
  setValue,
  setFocused,
}: StockOptionProps) => {
  return (
    <div
      key={stock.ticker}
      onClick={() => {
        setSelected(`${stock.ticker} - ${stock.name}`);
        setValue(`${stock.ticker} - ${stock.name}`);
        setFocused(false);
      }}
      onMouseDown={(e) => e.preventDefault()}
      className='cursor-pointer px-2 py-2 hover:bg-gray-50 whitespace-nowrap text-ellipsis overflow-hidden'
    >
      {stock.ticker} - {stock.name}
    </div>
  );
};
