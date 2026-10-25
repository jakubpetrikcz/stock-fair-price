import { StockAutocomplete } from '../../components/StockAutocomplete/StockAutocomplete';
import { useSelector } from 'react-redux';
import { selectedStockSelector } from '../../components/StockAutocomplete/stores/selectors';
import { Dcf } from './Dcf';

export const DcfPage = () => {
  const selectedStock = useSelector(selectedStockSelector);
  const selectedTicker = selectedStock?.split('-')[0].trim();

  return (
    <div className='p-10'>
      <StockAutocomplete />
      {selectedTicker && <Dcf ticker={selectedTicker} />}
    </div>
  );
};
