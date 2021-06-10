import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'

import {
  fetchConfigAsync,
  selectStatus,
  selectAvailableTickers,
} from './tickerTableSlice';

import {
  selectTickers,
} from '../tradeFetcher/tradeFetcherSlice';

import { Filter } from './Filter';

import { ExchangeSelector } from '../exchangeSelector/ExchangeSelector';
import { TickerDetails } from '../tickerDetails/TickerDetails';

import styles from './TickerTable.module.css';


const columns = [
  {
    name: 'Ticker',
    selector: 'ticker',
    sortable: true,
  },
  {
    name: 'Last Price',
    selector: 'price',
    sortable: true,
  },
  {
    name: '% Change*',
    selector: 'percentDelta',
    format: (row) => {
      return <span className={(row.percentDelta === 0) ? '' : (row.percentDelta < 0) ? styles.negative : styles.positive}>
        <FontAwesomeIcon
          icon={(row.percentDelta < 0) ? faCaretDown : faCaretUp}
          className={styles.percentDeltaCaret}
        />
        {Math.abs(row.percentDelta)}
        %
      </span>
    },
    sortable: true,
    sortFunction: function(rowA, rowB) {
      return rowA.percentDelta - rowB.percentDelta;
    }
  },
  {
    name: 'Volume*',
    selector: 'volume',
    format: (row) => Number(row.volume).toFixed(8),
    sortable: true,
  },
  {
    name: 'Last Trade',
    selector: 'lastTrade',
    sortable: true,
  },
];

const customStyles = {
  header: {
    style: {
      backgroundColor: '#009879'
    }
  },
  rows: {
    style: {
      minHeight: '40px',
      fontSize: '0.9em',
      fontWeight: 'bold',
    }
  },
  headRow: {
    style: {
      backgroundColor: '#5677fc'
    }
  },
  headCells: {
    style: {
      fontSize: '0.9em',
      paddingLeft: '8px',
      paddingRight: '8px',
      color: 'white',
    },
  },
  cells: {
    style: {
      paddingLeft: '8px',
      paddingRight: '8px',
    },
  },
};

export function TickerTable() {
  const [filterText, setFilterText] = useState('');

  const dispatch = useDispatch();

  const tickers = useSelector(selectTickers);
  const status = useSelector(selectStatus);
  const availableTickers = useSelector(selectAvailableTickers);

  useEffect(() => {
    dispatch(fetchConfigAsync());
  }, [dispatch]);

  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setFilterText('');
      }
    };

    return (
      <div className={styles.tableHeader}>
        <Filter onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
        <ExchangeSelector />
      </div>
    );
  }, [filterText]);

  function transformTickerData(tickers, filterText) {
    const tickerData = [];

    availableTickers.forEach((availableTicker) => {
      const existingTicker = tickers.find((tickerObj) => tickerObj.ticker === availableTicker);

      if (existingTicker) {
        const lastTradeDate = new Date(Number(existingTicker.lastTrade));
        tickerData.push({
          id: existingTicker.ticker,
          ticker: existingTicker.ticker.toUpperCase(),
          price: existingTicker.price,
          percentDelta: existingTicker.percentDelta,
          volume: existingTicker.volume,
          lastTrade: lastTradeDate.toLocaleString(),
        });
      }
      else {
        tickerData.push({
          ticker: availableTicker.toUpperCase(),
          price: '',
          percentDelta: '',
          volume: ''
        });
      }
    });

    return tickerData.filter((ticker) => ticker.ticker && ticker.ticker.includes(filterText.toUpperCase()));
  }

  if (status === 'loading') { return <div>Loading...</div>; }

  return (
    <div className={styles.tickerTableWrapper}>
      <DataTable
        className="tickerTable"
        columns={columns}
        data={transformTickerData(tickers, filterText)}
        keyField='ticker'
        highlightOnHover
        pointerOnHover
        expandableRows
        expandableRowsComponent={<TickerDetails />}
        expandOnRowClicked
        noHeader
        subHeader
        subHeaderAlign='left'
        subHeaderComponent={subHeaderComponentMemo}
        customStyles={customStyles}
      />
      <div className={styles.tableFootnote}>* <b>Volume</b> and <b>% Change</b> based on current session</div>
    </div>
  );
}
