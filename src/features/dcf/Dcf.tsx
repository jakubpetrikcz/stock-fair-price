import { useState } from 'react';
import { useFetchCashFlow } from '../../hooks/useFetchCashFlow';
import { useFetchBalanceSheet } from '../../hooks/useFetchBalanceSheet';
import { useFetchSharesOutstanding } from '../../hooks/useFetchSharesOutstanding';
import { getFutureFcfs } from './utils/getFutureFcfs';
import { FcfTable } from './components/FcfTable';
import { FutureFcfTable } from './components/FutureFcfTable';
import { PricePerShareTable } from './components/PricePerShareTable';
import { DEFAULT_GROWTH_RATE, FINANCIALS_LS_KEY } from '../../constants';
import type { FinancialType } from './types';

type DcfProps = {
  ticker: string;
};

export const Dcf = ({ ticker }: DcfProps) => {
  const [userGrowthRate, setUserGrowthRate] = useState<number | string>(
    DEFAULT_GROWTH_RATE,
  );
  const financialsLS = JSON.parse(
    localStorage.getItem(FINANCIALS_LS_KEY) || '{}',
  );

  const [financials, setFinancials] = useState<FinancialType>(financialsLS);
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

  const userGrowthRateNumber = Number(userGrowthRate);

  const futureFcfs = getFutureFcfs(cashFlows, userGrowthRateNumber);

  return (
    <div>
      <FcfTable
        cashFlows={cashFlows}
        userGrowthRate={userGrowthRate}
        setUserGrowthRate={setUserGrowthRate}
      />
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
        userGrowthRate={userGrowthRateNumber}
      />
    </div>
  );
};
