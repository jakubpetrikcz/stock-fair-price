import { useState } from 'react';
import { getFutureFcfs } from './utils/getFutureFcfs';
import { FcfTable } from './components/FcfTable';
import { FutureFcfTable } from './components/FutureFcfTable';
import { PricePerShareTable } from './components/PricePerShareTable';
import { DEFAULT_GROWTH_RATE, FINANCIALS_LS_KEY } from '../../constants';
import type { FinancialType } from './types';
import { useFetchCashFlow } from './hooks/useFetchCashFlow';
import { useFetchBalanceSheet } from './hooks/useFetchBalanceSheet';
import { useFetchSharesOutstanding } from './hooks/useFetchSharesOutstanding';

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

  const cashFlowsData = tickerFinancials?.cashFlowsData || [];
  const cashEquivalents = tickerFinancials?.cashEquivalents;
  const totalDebt = tickerFinancials?.totalDebt;
  const sharesOutstanding = tickerFinancials?.sharesOutstanding;

  useFetchCashFlow(cashFlowsData.length > 0, ticker, setFinancials);
  useFetchBalanceSheet(
    Boolean(cashEquivalents && totalDebt),
    ticker,
    setFinancials,
  );
  useFetchSharesOutstanding(Boolean(sharesOutstanding), ticker, setFinancials);

  const userGrowthRateNumber = Number(userGrowthRate);

  const cashFlows = cashFlowsData.map((cashFlow) => cashFlow.cashFlow);

  const futureFcfs = getFutureFcfs(cashFlows, userGrowthRateNumber);

  const years = cashFlowsData.map((cashFlow) =>
    new Date(cashFlow.date).getFullYear(),
  );

  const isLoading =
    cashFlowsData.length === 0 &&
    !cashEquivalents &&
    !totalDebt &&
    !sharesOutstanding;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='mt-5'>
      <h1 className='text-4xl text-center font-bold'>
        Discounted Cash Flow Analysis Model
      </h1>
      <FcfTable
        cashFlows={cashFlows}
        userGrowthRate={userGrowthRate}
        setUserGrowthRate={setUserGrowthRate}
        years={years}
      />
      <FutureFcfTable
        futureFcf={futureFcfs.future}
        pvOfFFCF={futureFcfs.pvOfFFCF}
        lastYear={years[years.length - 1]}
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
