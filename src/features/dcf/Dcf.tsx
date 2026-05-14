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
import { useSelector } from 'react-redux';
import {
  cashFlowsSelector,
  sharesOutstandingSelector,
} from './stores/selectors';

type DcfProps = {
  ticker: string;
};

export const Dcf = ({ ticker }: DcfProps) => {
  const cashFlow = useSelector(cashFlowsSelector(ticker)) || [];
  const sharesOutstanding = useSelector(sharesOutstandingSelector(ticker));

  const { isLoading: isCashFlowsLoading } = useGetCashFlowsQuery(ticker, {
    skip: cashFlow.length > 0,
  });

  const { isLoading: isSharesOutstandingLoading } =
    useGetSharesOutstandingQuery(ticker, { skip: Boolean(sharesOutstanding) });

  const [userGrowthRate, setUserGrowthRate] = useState<number | string>(
    DEFAULT_GROWTH_RATE,
  );

  const userGrowthRateNumber = Number(userGrowthRate);

  const cashFlows = cashFlow.map((cashFlow) => cashFlow.cashFlow);

  const futureFcfs = getFutureFcfs(cashFlows, userGrowthRateNumber);

  const years = cashFlow.map((cashFlow) =>
    new Date(cashFlow.date).getFullYear(),
  );

  if (isCashFlowsLoading || isSharesOutstandingLoading || !sharesOutstanding) {
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
        ticker={ticker}
        pvOfFFCF={futureFcfs.pvOfFFCF}
        cashFlows={cashFlows}
        sharesOutstanding={sharesOutstanding}
        userGrowthRate={userGrowthRateNumber}
      />
    </div>
  );
};
