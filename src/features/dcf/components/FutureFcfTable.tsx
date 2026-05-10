import { getTerminalValue } from '../utils/getTerminalValue';

type FutureFcfTableProps = {
  futureFcf: number[];
  pvOfFFCF: number[];
  lastYear: number;
};

export const FutureFcfTable = ({
  futureFcf,
  pvOfFFCF,
  lastYear,
}: FutureFcfTableProps) => {
  const { terminalValueFCF, terminalValuePVOfFFCF } =
    getTerminalValue(futureFcf);

  const futureYears = Array.from({ length: 9 }).map(
    (_, index) => lastYear + (index + 1),
  );

  return (
    <div className='overflow-x-auto max-w-full'>
      <table className='mt-5 w-full'>
        <tbody>
          <tr>
            <th>Year</th>
            {futureYears.map((futureYear, index) => (
              <td key={`${futureYear}-${index}`}>{futureYear}</td>
            ))}
            <td>Terminal Value</td>
          </tr>
          <tr>
            <th>Future Free Cash Flows</th>
            {futureFcf.map((cashFlow, index) => (
              <td key={`${cashFlow}-${index}`}>{cashFlow}</td>
            ))}
            <td>{terminalValueFCF}</td>
          </tr>
          <tr>
            <th>PV of FFCF</th>
            {pvOfFFCF.map((pv, index) => (
              <td key={`${pv}-${index}`}>{pv}</td>
            ))}
            <td>{terminalValuePVOfFFCF}</td>
          </tr>
        </tbody>
      </table>
      <div className='h-2.5'></div>
    </div>
  );
};
