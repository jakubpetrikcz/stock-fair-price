import type { Dispatch, SetStateAction } from 'react';
import { getGrowthRate } from '../utils/getGrowthRate';
import { blockInvalidCharacters } from '../../../utils/blockInvalidCharacters';

type FcfTableProps = {
  cashFlows: number[];
  userGrowthRate: string | number;
  setUserGrowthRate: Dispatch<SetStateAction<string | number>>;
  years: number[];
};

export const FcfTable = ({
  cashFlows,
  userGrowthRate,
  setUserGrowthRate,
  years,
}: FcfTableProps) => {
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
