import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchConfig } from './tickerTableAPI';


const initialState = {
  availableExchanges: [],
  availableTickers: [],
  channels: [],
  status: 'idle',
};

export const fetchConfigAsync = createAsyncThunk(
  'tickerTable/fetchConfig',
  async () => {
    const response = await fetchConfig();
    return response.data;
  }
);

export const tickerTableSlice = createSlice({
  name: 'tickerTable',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchConfigAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchConfigAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.availableExchanges = action.payload.exchanges;
        state.availableTickers = action.payload.tickers;
        action.payload.tickers.forEach((ticker) => {
          action.payload.exchanges.forEach((exchange) => {
            state.channels.push(`trade:${exchange}:${ticker}`); 
          });
        });
      });
  },
});

export const { increment, decrement, incrementByAmount } = tickerTableSlice.actions;

export const selectAvailableExchanges = (state) => state.tickerTable.availableExchanges;
export const selectAvailableTickers = (state) => state.tickerTable.availableTickers;
export const selectChannels = (state) => state.tickerTable.channels;
export const selectStatus = (state) => state.tickerTable.status;

export default tickerTableSlice.reducer;
