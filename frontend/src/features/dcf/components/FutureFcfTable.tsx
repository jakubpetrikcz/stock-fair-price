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
  const terminalValueFCF = futureFcf[futureFcf.length - 1];
  const terminalValuePVOfFFCF = pvOfFFCF[pvOfFFCF.length - 1];

  const futureYears = Array.from({ length: 9 }).map(
    (_, index) => lastYear + (index + 1),
  );

  return (
    <div className='overflow-x-auto max-w-full'>
      <table className='mt-5 w-full'>
        <tbody>
          <tr>
            <th className='bg-amber-300'>Year</th>
            {futureYears.map((futureYear, index) => (
              <th key={`${futureYear}-${index}`} className='bg-blue-200'>
                {futureYear}
              </th>
            ))}
            <th className='bg-blue-200'>Terminal Value</th>
          </tr>
          <tr>
            <th className='bg-amber-300'>Future Free Cash Flows</th>
            {futureYears.map((futureYear, index) => (
              <td key={`future-fcf-${futureYear}`}>{futureFcf[index]}</td>
            ))}
            <td>{terminalValueFCF}</td>
          </tr>
          <tr>
            <th className='bg-amber-300'>PV of FFCF</th>
            {futureYears.map((futureYear, index) => (
              <td key={`pv-ffcf-${futureYear}`}>{pvOfFFCF[index]}</td>
            ))}
            <td>{terminalValuePVOfFFCF}</td>
          </tr>
        </tbody>
      </table>
      <div className='h-2.5'></div>
    </div>
  );
};
