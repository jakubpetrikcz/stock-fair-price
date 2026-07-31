import { useEffect, useEffectEvent, useState } from 'react';
import { getGrowthRate } from '../utils/getGrowthRate';
import { blockInvalidCharacters } from '../../../utils/blockInvalidCharacters';
import { useUpdateStockDcfPriceMutation } from '../../../api/stocksApi';
import { DEFAULT_GROWTH_RATE } from '../../../constants';
import { useDebounce } from '../../../hooks/useDebounce';

type FcfTableProps = {
  ticker: string;
  cashFlows: number[];
  years: number[];
  dcf_growth_rate: number;
};

export const FcfTable = ({
  ticker,
  cashFlows,
  years,
  dcf_growth_rate,
}: FcfTableProps) => {
  const [updateStockDcfPrice] = useUpdateStockDcfPriceMutation();

  const [userGrowthRate, setUserGrowthRate] = useState<string | number>(
    dcf_growth_rate || DEFAULT_GROWTH_RATE,
  );
  const debouncedGrowthRate = useDebounce(userGrowthRate);

  const onUpdateStockDcfPrice = useEffectEvent(
    (debouncedSearch: string | number) => {
      updateStockDcfPrice({
        ticker,
        userGrowthRate: Number(debouncedSearch),
      });
    },
  );

  useEffect(() => {
    onUpdateStockDcfPrice(debouncedGrowthRate);
  }, [debouncedGrowthRate]);

  useEffect(() => {
    setUserGrowthRate(dcf_growth_rate);
  }, [dcf_growth_rate]);

  const { growths, averageGrowthRate } = getGrowthRate(cashFlows);

  return (
    <>
      <table className='mt-5 w-full'>
        <tbody>
          <tr>
            <th className='bg-amber-300'>Year</th>
            {years.map((year) => (
              <th key={year} className='bg-blue-200'>
                {year}
              </th>
            ))}
          </tr>
          <tr>
            <th className='bg-amber-300'>Free Cash Flow</th>
            {cashFlows.map((cashFlow, index) => (
              <td key={years[index]}>{cashFlow}</td>
            ))}
          </tr>
          <tr>
            <th className='bg-amber-300'>Growth</th>
            <td>-</td>
            {growths.map((growth, index) => (
              <td key={years[index + 1]}>{growth}%</td>
            ))}
          </tr>
        </tbody>
      </table>
      <div className='flex justify-end'>
        <table className='mt-5'>
          <tbody>
            <tr>
              <th>User-Growth Rate</th>
              <td className='p-0! h-7.25'>
                <input
                  name='userGrowthRate'
                  type='text'
                  value={`${userGrowthRate}%`}
                  onChange={(e) => {
                    const val = e.target.value.replace('%', '');
                    if (!isNaN(Number(val))) {
                      setUserGrowthRate(val);
                    }
                  }}
                  onKeyDown={blockInvalidCharacters}
                  className='w-full h-full border border-yellow-200 p-0 bg-yellow-50 text-center font-bold outline-0'
                />
              </td>
            </tr>
            <tr>
              <th>Average Growth Rate</th>
              <td>{averageGrowthRate}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
