import { useState } from 'react';
import { useFetchCashFlow } from '../../hooks/useFetchCashFlow';
import { useFetchBalanceSheet } from '../../hooks/useFetchBalanceSheet';
import { useFetchSharesOutstanding } from '../../hooks/useFetchSharesOutstanding';
import { getFutureFcfs } from '../../utils/getFutureFcfs';
import { FcfTable } from './components/FcfTable';
import { FutureFcfTable } from './components/FutureFcfTable';
import { PricePerShareTable } from './components/PricePerShareTable';
import { DEFAULT_GROWTH_RATE } from '../../constants';

type DcfProps = {
  ticker: string;
};

export const Dcf = ({ ticker }: DcfProps) => {
  const [userGrowthRate, setUserGrowthRate] =
    useState<number>(DEFAULT_GROWTH_RATE);
  console.log('userGrowthRate', userGrowthRate);
  const financialsLS = JSON.parse(localStorage.getItem('financials') || '{}');

  const [financials, setFinancials] = useState(financialsLS);
  const tickerFinancials = financials?.[ticker];

  const cashFlows = tickerFinancials?.cashFlowsData || [];
  const cashEquivalents = tickerFinancials?.cashEquivalents;
  const totalDebt = tickerFinancials?.totalDebt;
  const sharesOutstanding = tickerFinancials?.sharesOutstanding;

  useFetchCashFlow(cashFlows.length > 0, ticker, setFinancials);
  useFetchBalanceSheet(
    Boolean(cashEquivalents && totalDebt),
    ticker,
    setFinancials,
  );
  useFetchSharesOutstanding(Boolean(sharesOutstanding), ticker, setFinancials);

  const futureFcfs = getFutureFcfs(cashFlows, userGrowthRate);

  return (
    <div>
      <FcfTable cashFlows={cashFlows} setUserGrowthRate={setUserGrowthRate} />
      <FutureFcfTable
        futureFcf={futureFcfs.future}
        pvOfFFCF={futureFcfs.pvOfFFCF}
      />
      <PricePerShareTable
        pvOfFFCF={futureFcfs.pvOfFFCF}
        cashEquivalents={cashEquivalents}
        totalDebt={totalDebt}
        cashFlows={cashFlows}
        sharesOutstanding={sharesOutstanding}
        userGrowthRate={userGrowthRate}
      />
    </div>
  );
};
