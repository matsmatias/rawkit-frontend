import { configureStore } from '@reduxjs/toolkit';

import tickerTableReducer from '../features/tickerTable/tickerTableSlice';
import tradeFetcherReducer from '../features/tradeFetcher/tradeFetcherSlice';


export const store = configureStore({
  reducer: {
    tickerTable: tickerTableReducer,
    tradeFetcher: tradeFetcherReducer,
  },
});
