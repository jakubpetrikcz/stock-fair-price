import { calculateDcfFairPrice } from '../utils/calculateDcfFairPrice';

type PricePerShareTableProps = {
  pvOfFFCF: number[];
  cashEquivalents: number;
  totalDebt: number;
  cashFlows: number[];
  sharesOutstanding: number;
  userGrowthRate: number;
};

export const PricePerShareTable = ({
  pvOfFFCF,
  cashEquivalents,
  totalDebt,
  cashFlows,
  sharesOutstanding,
  userGrowthRate,
}: PricePerShareTableProps) => {
  const sumOfFFCF = Number(pvOfFFCF.reduce((sum, pv) => sum + pv, 0).toFixed());

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
        <tr>
          <th>DCF Price Per Share</th>
          <td>{fairPrice}</td>
        </tr>
      </tbody>
    </table>
  );
};
