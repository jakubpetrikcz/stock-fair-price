import { FcfTable } from './components/FcfTable';
import { FutureFcfTable } from './components/FutureFcfTable';
import { PricePerShareTable } from './components/PricePerShareTable';
import { roundToMillions } from '../../utils/roundToMillions';
import { useGetStockQuery } from '../../api/stocksApi';
import { CurrentPriceTable } from './components/CurrentPriceTable';
import { DcfTitle } from './DcfTitle';

type DcfProps = {
  ticker: string;
};

export const Dcf = ({ ticker }: DcfProps) => {
  const { data: stock, isLoading, isError } = useGetStockQuery(ticker);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!stock || isError) {
    return <div>Error...</div>;
  }

  const cashFlow = stock.free_cash_flow
    .map((item) => ({
      date: item.date,
      cashFlow: roundToMillions(item.value),
    }))
    .reverse();

  const cashFlows = cashFlow.map((cashFlow) => cashFlow.cashFlow);

  const years = cashFlow.map((cashFlow) =>
    new Date(cashFlow.date).getFullYear(),
  );

  const sharesOutstanding = roundToMillions(
    Number(stock.shares_outstanding),
    1,
  );

  const cashEquivalents = roundToMillions(Number(stock.cash_equivalents));
  const totalDebt = roundToMillions(Number(stock.total_debt));

  const fairPrice = stock.dcf_fair_value;
  const futureFcfs = stock.dcf_future_fcfs || { future: [], pvOfFFCF: [] };

  return (
    <div className='mt-5'>
      <DcfTitle stockId={stock.id} fairPrice={fairPrice} />
      <ul className='ml-5 list-disc'>
        <li>
          A business valuation method that determines fair value based on
          expected future cash flows.
        </li>
        <li>
          It is suitable for stable and profitable companies with predictable
          cash flow and a long track record of results.
        </li>
        <li>
          On the other hand, it is not ideal for startups and fast-growing
          companies without stable profits - companies in the early stages of
          development or those that have only recently gone public.
        </li>
      </ul>
      <FcfTable
        ticker={ticker}
        cashFlows={cashFlows}
        years={years}
        dcf_growth_rate={stock.dcf_growth_rate}
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
