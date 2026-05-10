import type { Dispatch, SetStateAction, KeyboardEvent } from 'react';
import { getGrowthRate } from '../utils/getGrowthRate';

const blockInvalidChar = (e: KeyboardEvent<HTMLInputElement>) =>
  ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault();

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
            <th>Year</th>
            {years.map((year) => (
              <td key={year}>{year}</td>
            ))}
          </tr>
          <tr>
            <th>Free Cash Flow</th>
            {cashFlows.map((cashFlow) => (
              <td key={cashFlow}>{cashFlow}</td>
            ))}
          </tr>
          <tr>
            <th>Growth</th>
            <td>-</td>
            {growths.map((growth) => (
              <td key={growth}>{growth}</td>
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
                  type='number'
                  value={userGrowthRate}
                  onChange={(e) => {
                    const value = e.target.value;
                    setUserGrowthRate(value);
                  }}
                  onKeyDown={blockInvalidChar}
                  className='h-full border-0 p-0 bg-red-500'
                />
              </td>
            </tr>
            <tr>
              <th>Average Growth Rate</th>
              <td>{averageGrowthRate}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
