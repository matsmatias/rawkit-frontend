import { useSelector, useDispatch } from 'react-redux';

import Button from '@material-ui/core/Button';

import {
  enableExchange, 
  disableExchange,
  selectEnabledExchanges,
} from '../tradeFetcher/tradeFetcherSlice';

import {
  selectAvailableExchanges,
} from '../tickerTable/tickerTableSlice';

import styles from './ExchangeSelector.module.css';


export function ExchangeSelector() {  
  const dispatch = useDispatch();

  const availableExchanges = useSelector(selectAvailableExchanges);
  const enabledExchanges = useSelector(selectEnabledExchanges);

  function getButtonColor(exchange) {
    return enabledExchanges.includes(exchange) ? 'primary' : 'secondary';
  }

  function getButtonVariant(exchange) {
    return enabledExchanges.includes(exchange) ? 'contained' : 'outlined';
  }

  function onButtonClick(event) {
    const exchange = event.currentTarget.id;
    if (enabledExchanges.includes(exchange)) {
      dispatch(disableExchange(exchange));
    }
    else {
      dispatch(enableExchange(exchange));
    }
  }

  return (
    <div className="exchangeSelector">
      { availableExchanges.map((exchange, index) => {
          return (
            <Button
              id={exchange}
              key={index}
              className={styles.exchangeButton}
              color={getButtonColor(exchange)}
              variant={getButtonVariant(exchange)}
              size="medium"
              data-toggle="button"
              aria-pressed="true"
              onClick={onButtonClick}
            >
              { exchange }
            </Button>
          );
        })
      }
    </div>
  );
}
