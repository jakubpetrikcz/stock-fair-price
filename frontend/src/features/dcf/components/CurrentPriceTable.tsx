import classNames from 'classnames';
import { useGetStockPriceQuery } from '../../../api/stocksApi';

const formatPrice = (price: number, currency?: string | null) => {
  const options: Intl.NumberFormatOptions = {
    style: currency ? 'currency' : 'decimal',
    maximumFractionDigits: 2,
  };

  if (currency) {
    options.currency = currency;
  }

  return new Intl.NumberFormat('en-US', options).format(price);
};

type CurrentPriceTableProps = {
  ticker: string;
  fairPrice: number;
};

export const CurrentPriceTable = ({
  ticker,
  fairPrice,
}: CurrentPriceTableProps) => {
  const {
    data: stockPrice,
    isLoading,
    isError,
  } = useGetStockPriceQuery(ticker, {
    pollingInterval: 15000,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!stockPrice || isError) {
    return <div>Error...</div>;
  }

  const difference = Number(
    (((fairPrice - stockPrice.price) / stockPrice.price) * 100).toFixed(2),
  );

  return (
    <table className='mt-5'>
      <tbody>
        <tr>
          <th>Current Price</th>
          <td>{formatPrice(stockPrice.price, stockPrice.currency)}</td>
        </tr>
        <tr
          className={classNames({
            'bg-red-400': difference < 0,
            'bg-green-400': difference > 0,
          })}
        >
          <th>Difference</th>
          <td>{difference}%</td>
          <td className='font-bold'>{difference < 0 ? 'SELL' : 'BUY'}</td>
        </tr>
      </tbody>
    </table>
  );
};
