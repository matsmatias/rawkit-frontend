import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  selectChannels,
  selectAvailableExchanges,
} from '../tickerTable/tickerTableSlice';

import {
  processTickerData,
  enableExchange,
} from './tradeFetcherSlice';

import { API_BROADCASTER } from '../../app/config';


export function TradeFetcher() {
  const dispatch = useDispatch();
  
  const channels = useSelector(selectChannels);
  const availableExchanges = useSelector(selectAvailableExchanges);

  useEffect(() => {
    availableExchanges.forEach((exchange) => {
      dispatch(enableExchange(exchange));
    });

    channels.forEach((channel) => {
      const match = channel.match('trade:([a-z0-9]+):([a-z0-9]+)');
      const exchange = match[1];
      const ticker = match[2];

      const webSocket = new WebSocket(`${API_BROADCASTER}/trade/${exchange}:${ticker}`);
      webSocket.onopen = () => { console.log(`Watching ticker ${ticker} in exchange ${exchange}`) };
      webSocket.onmessage = (message) => dispatch(processTickerData(message.data));
    });
  }, [channels, availableExchanges, dispatch]);

  return <></>;
}
