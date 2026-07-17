import type { RootState } from '../../../stores/store';

export const selectedStockSelector = (state: RootState): string => state.stocks.selected;
