import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import DataTable from 'react-data-table-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons'

import {
  fetchConfigAsync,
  selectStatus,
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
    return tickers.map((ticker, index) => {
      const lastTradeDate = new Date(Number(ticker.lastTrade));
      return {
        id: index + 1,
        ticker: ticker.ticker.toUpperCase(),
        price: ticker.price,
        percentDelta: ticker.percentDelta,
        volume: ticker.volume,
        lastTrade: lastTradeDate.toLocaleString(),
      }
    }).filter((ticker) => ticker.ticker && ticker.ticker.includes(filterText.toUpperCase()));
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
