import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  tickers: [],
  enabledExchanges: [],
  status: 'idle',
};

export const tradeFetcherSlice = createSlice({
  name: 'tradeFetcher',
  initialState,
  reducers: {
    processTickerData(state, action) {
      const data = JSON.parse(action.payload);
      
      if (state.enabledExchanges.includes(data.exchangeId)) {
        // console.log(data);
        // console.log(current(state.tickers)); // add import { current } from '@reduxjs/toolkit'
        const existingTickerProxy = state.tickers.find((t) => t.ticker === data.symbol);

        if (!existingTickerProxy) {
          state.tickers.push({
            ticker: data.symbol,
            price: data.price,
            initialPrice: data.price,
            percentDelta: 0,
            volume: data.qty,
            lastTrade: data.tradeTime,
            exchangeData: [
                {
                    ...data
                }
            ]
          });
        }
        else {
          // update top-level price/volume
          existingTickerProxy.volume += data.qty;
          existingTickerProxy.price = data.price;
          const percentDelta = Number(((Number(data.price) / Number(existingTickerProxy.initialPrice)) - 1) * 100).toFixed(4);          
          existingTickerProxy.percentDelta = percentDelta;
          existingTickerProxy.lastTrade = data.tradeTime;

          const existingExchangeDataProxy = existingTickerProxy.exchangeData.find((exchange) => exchange.exchangeId === data.exchangeId);            
          if (!existingExchangeDataProxy) {
            existingTickerProxy.exchangeData.push(data);
          }
          else {
            // update existing exchangeData
            existingExchangeDataProxy.price = data.price;
            existingExchangeDataProxy.qty = data.qty;
            existingExchangeDataProxy.receiveTime = data.receiveTime;
            existingExchangeDataProxy.symbol = data.symbol;
            existingExchangeDataProxy.tradeId = data.tradeId;
            existingExchangeDataProxy.tradeTime = data.tradeTime;
          }
        }
      }
    },
    enableExchange(state, action) {
      console.log(`Enabled exchange ${action.payload}`);
      state.enabledExchanges.push(action.payload);
    },
    disableExchange(state, action) {
      console.log(`Disabled exchange ${action.payload}`);
      state.enabledExchanges = state.enabledExchanges.filter((exchange) => exchange !== action.payload);
    },
  },
});

export const { processTickerData, enableExchange, disableExchange } = tradeFetcherSlice.actions;

export const selectTickers = (state) => state.tradeFetcher.tickers;
export const selectEnabledExchanges = (state) => state.tradeFetcher.enabledExchanges;

export default tradeFetcherSlice.reducer;
