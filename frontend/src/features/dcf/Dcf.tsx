import { useState } from 'react';
import { getFutureFcfs } from './utils/getFutureFcfs';
import { FcfTable } from './components/FcfTable';
import { FutureFcfTable } from './components/FutureFcfTable';
import { PricePerShareTable } from './components/PricePerShareTable';
import { DEFAULT_GROWTH_RATE } from '../../constants';
import {
  useGetCashFlowsQuery,
  useGetSharesOutstandingQuery,
} from './api/dcfFinancialsApi';
import { useGetStockQuery } from './api/stocksApi';

type DcfProps = {
  ticker: string;
};

export const Dcf = ({ ticker }: DcfProps) => {
  const { data: cashFlow, isLoading: isCashFlowsLoading } =
    useGetCashFlowsQuery(ticker);
  const { data: sharesOutstanding, isLoading: isSharesOutstandingLoading } =
    useGetSharesOutstandingQuery(ticker);
  const { data: stock } = useGetStockQuery(ticker);

  const [userGrowthRate, setUserGrowthRate] = useState<number | string>(
    DEFAULT_GROWTH_RATE,
  );

  if (
    isCashFlowsLoading ||
    isSharesOutstandingLoading ||
    !sharesOutstanding ||
    !cashFlow
  ) {
    return <div>Loading...</div>;
  }

  const userGrowthRateNumber = Number(userGrowthRate);

  const cashFlows = cashFlow.map((cashFlow) => cashFlow.cashFlow);

  const futureFcfs = getFutureFcfs(cashFlows, userGrowthRateNumber);

  const years = cashFlow.map((cashFlow) =>
    new Date(cashFlow.date).getFullYear(),
  );

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
        ticker={ticker}
        pvOfFFCF={futureFcfs.pvOfFFCF}
        sharesOutstanding={sharesOutstanding}
        futureFcfs={futureFcfs}
      />
    </div>
  );
};
