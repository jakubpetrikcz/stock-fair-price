import { getTerminalValue } from '../utils/getTerminalValue';

type FutureFcfTableProps = {
  futureFcf: number[];
  pvOfFFCF: number[];
};

export const FutureFcfTable = ({
  futureFcf,
  pvOfFFCF,
}: FutureFcfTableProps) => {
  const { terminalValueFCF, terminalValuePVOfFFCF } =
    getTerminalValue(futureFcf);

  return (
    <table
      style={{
        marginTop: 20,
        width: '100%',
      }}
    >
      <tbody>
        <tr>
          <th>Year</th>
          <td>2026</td>
          <td>2027</td>
          <td>2028</td>
          <td>2029</td>
          <td>2030</td>
          <td>2031</td>
          <td>2032</td>
          <td>2033</td>
          <td>2034</td>
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
          {pvOfFFCF.map((pv) => (
            <td key={pv}>{pv}</td>
          ))}
          <td>{terminalValuePVOfFFCF}</td>
        </tr>
      </tbody>
    </table>
  );
};
