import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type SelectStockAction = PayloadAction<string>;

type StocksState = {
  selected: string;
};

const initialState: StocksState = {
  selected: '',
};

export const stocksSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    selectStock: (state, action: SelectStockAction) => {
      state.selected = action.payload;
    },
  },
});

export const { selectStock } = stocksSlice.actions;
