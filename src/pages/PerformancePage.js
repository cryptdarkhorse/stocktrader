import React, { useState, useEffect } from 'react';
import PortfolioPerformance from '../components/PortfolioPerformance';
import TradeLog from '../components/TradeLog';
import NotificationPlaceholder from '../components/NotificationPlaceholder';

const PerformancePage = () => {
  // For the POC, we're using local state as placeholders.
  // In a complete version, performance data and trade logs would be accumulated from the trading simulation.
  const [performanceData, setPerformanceData] = useState([]);
  const [trades, setTrades] = useState([]);

  // Example: Retrieve simulation data from local storage (if available)
  useEffect(() => {
    const storedPerformance = localStorage.getItem('performanceData');
    const storedTrades = localStorage.getItem('tradeLogs');
    if (storedPerformance) {
      setPerformanceData(JSON.parse(storedPerformance));
    }
    if (storedTrades) {
      setTrades(JSON.parse(storedTrades));
    }
  }, []);

  return (
    <div>
      <h1>Portfolio Performance</h1>
      <PortfolioPerformance performanceData={performanceData} />
      <TradeLog trades={trades} />
      <NotificationPlaceholder />
    </div>
  );
};

export default PerformancePage;
