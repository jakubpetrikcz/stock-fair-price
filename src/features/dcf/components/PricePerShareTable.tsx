import { useSelector } from 'react-redux';
import { calculateDcfFairPrice } from '../utils/calculateDcfFairPrice';
import {
  cashEquivalentsSelector,
  totalDebtSelector,
} from '../stores/selectors';
import { useGetBalanceSheetQuery } from '../api/dcfFinancialsApi';

type PricePerShareTableProps = {
  ticker: string;
  pvOfFFCF: number[];
  cashFlows: number[];
  sharesOutstanding: number;
  userGrowthRate: number;
};

export const PricePerShareTable = ({
  ticker,
  pvOfFFCF,
  cashFlows,
  sharesOutstanding,
  userGrowthRate,
}: PricePerShareTableProps) => {
  const cashEquivalents = useSelector(cashEquivalentsSelector(ticker));
  const totalDebt = useSelector(totalDebtSelector(ticker));

  const { isLoading: isBalanceSheetLoading } = useGetBalanceSheetQuery(ticker, {
    skip: Boolean(cashEquivalents && totalDebt),
  });
  const sumOfFFCF = Number(pvOfFFCF.reduce((sum, pv) => sum + pv, 0).toFixed());

  if (isBalanceSheetLoading || !cashEquivalents || !totalDebt) {
    return <div>Loading...</div>;
  }

  const equityValue = (sumOfFFCF + cashEquivalents - totalDebt).toFixed();

  const fairPrice = calculateDcfFairPrice(
    cashFlows,
    cashEquivalents,
    totalDebt,
    sharesOutstanding,
    userGrowthRate,
  );

  return (
    <table className='mt-5'>
      <tbody>
        <tr>
          <th>Sum of FFCF</th>
          <td>{sumOfFFCF}</td>
        </tr>
        <tr>
          <th>Cash/Cash Equivalents</th>
          <td>{cashEquivalents}</td>
        </tr>
        <tr>
          <th>Total Debt</th>
          <td>{totalDebt}</td>
        </tr>
        <tr>
          <th>Equity value</th>
          <td>{equityValue}</td>
        </tr>
        <tr>
          <th>Shares Outstanding</th>
          <td>{sharesOutstanding}</td>
        </tr>
        <tr className='bg-green-400'>
          <th>DCF Price Per Share</th>
          <td>
            <strong>{fairPrice}</strong>
          </td>
        </tr>
      </tbody>
    </table>
  );
};
