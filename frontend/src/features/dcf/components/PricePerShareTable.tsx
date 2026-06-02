import { calculateDcfFairPrice } from '../utils/calculateDcfFairPrice';
import { useGetBalanceSheetQuery } from '../api/dcfFinancialsApi';

type PricePerShareTableProps = {
  ticker: string;
  pvOfFFCF: number[];
  sharesOutstanding: number;
  futureFcfs: Record<string, number[]>;
};

export const PricePerShareTable = ({
  ticker,
  pvOfFFCF,
  sharesOutstanding,
  futureFcfs,
}: PricePerShareTableProps) => {
  const { data: balanceSheetData, isLoading: isBalanceSheetLoading } =
    useGetBalanceSheetQuery(ticker);
  const sumOfFFCF = Number(pvOfFFCF.reduce((sum, pv) => sum + pv, 0).toFixed());

  if (isBalanceSheetLoading || !balanceSheetData) {
    return <div>Loading...</div>;
  }

  const { cashEquivalents, totalDebt } = balanceSheetData;

  const equityValue = (sumOfFFCF + cashEquivalents - totalDebt).toFixed();

  const fairPrice = calculateDcfFairPrice(
    cashEquivalents,
    totalDebt,
    sharesOutstanding,
    futureFcfs,
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
