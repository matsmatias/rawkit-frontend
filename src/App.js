import React from 'react';

import { TickerTable } from './features/tickerTable/TickerTable';
import { Header } from './app/components/Header';
import { Footer } from './app/components/Footer';

import './App.css';
import { TradeFetcher } from 'features/tradeFetcher/TradeFetcher';


function App() {
  return (
    <div className="App">
      <Header />
      <TickerTable />
      <TradeFetcher />
      <Footer />
    </div>
  )
}

export default App;
