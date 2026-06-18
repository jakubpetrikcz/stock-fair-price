import { useState } from 'react';
import { getFutureFcfs } from './utils/getFutureFcfs';
import { FcfTable } from './components/FcfTable';
import { FutureFcfTable } from './components/FutureFcfTable';
import { PricePerShareTable } from './components/PricePerShareTable';
import { DEFAULT_GROWTH_RATE } from '../../constants';
import { roundToMillions } from '../../utils/roundToMillions';
import { useGetStockQuery } from '../../api/stocksApi';
import { CurrentPriceTable } from './components/CurrentPriceTable';
import { calculateDcfFairPrice } from './utils/calculateDcfFairPrice';

type DcfProps = {
  ticker: string;
};

export const Dcf = ({ ticker }: DcfProps) => {
  const { data: stock, isLoading, isError } = useGetStockQuery(ticker);

  const [userGrowthRate, setUserGrowthRate] = useState<number | string>(
    DEFAULT_GROWTH_RATE,
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!stock || isError) {
    return <div>Error...</div>;
  }

  const userGrowthRateNumber = Number(userGrowthRate);

  const cashFlow = stock.free_cash_flow
    .map((item) => ({
      date: item.date,
      cashFlow: roundToMillions(item.value),
    }))
    .reverse();

  const cashFlows = cashFlow.map((cashFlow) => cashFlow.cashFlow);

  const futureFcfs = getFutureFcfs(cashFlows, userGrowthRateNumber);

  const years = cashFlow.map((cashFlow) =>
    new Date(cashFlow.date).getFullYear(),
  );

  const sharesOutstanding = roundToMillions(
    Number(stock.shares_outstanding),
    1,
  );

  const cashEquivalents = roundToMillions(Number(stock.cash_equivalents));
  const totalDebt = roundToMillions(Number(stock.total_debt));

  const fairPrice = calculateDcfFairPrice(
    cashEquivalents,
    totalDebt,
    sharesOutstanding,
    futureFcfs,
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
        cashEquivalents={cashEquivalents}
        totalDebt={totalDebt}
        pvOfFFCF={futureFcfs.pvOfFFCF}
        sharesOutstanding={sharesOutstanding}
        fairPrice={fairPrice}
      />
      <CurrentPriceTable ticker={ticker} fairPrice={fairPrice} />
    </div>
  );
};
