import React, { useState, useEffect } from 'react';
import TradingForm from '../components/TradingForm';
import StockChart from '../components/StockChart';
import MarketStatus from '../components/MarketStatus';
import AlphaVantageService from '../services/AlphaVantageService';

const HomePage = () => {
  const [formData, setFormData] = useState(() => {
    const stored = localStorage.getItem('formData');
    return stored ? JSON.parse(stored) : null;
  });
  const [chartData, setChartData] = useState(() => {
    const stored = localStorage.getItem('chartData');
    return stored ? JSON.parse(stored) : [];
  });
  const [simulationActive, setSimulationActive] = useState(() => {
    const stored = localStorage.getItem('simulationActive');
    return stored ? JSON.parse(stored) : false;
  });

  // Save state changes to local storage
  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  useEffect(() => {
    localStorage.setItem('chartData', JSON.stringify(chartData));
  }, [chartData]);

  useEffect(() => {
    localStorage.setItem('simulationActive', JSON.stringify(simulationActive));
  }, [simulationActive]);

  const handleFormSubmit = async (data) => {
    setFormData(data);
    setSimulationActive(true);
    // Fetch intraday data for the provided ticker using Alpha Vantage API
    const responseData = await AlphaVantageService.getIntradayData(data.ticker);
    if (responseData && responseData["Time Series (1min)"]) {
      const timeSeries = responseData["Time Series (1min)"];
      const processedData = Object.keys(timeSeries).map((timestamp) => ({
        date: timestamp,
        close: parseFloat(timeSeries[timestamp]["4. close"]),
      }));
      // Reverse data to display in chronological order
      setChartData(processedData.reverse());
    } else {
      alert('Error fetching data or API limit reached. Please try again later or use cached data.');
    }
  };

  // Reset simulation: clear state and local storage
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the simulation?")) {
      setFormData(null);
      setChartData([]);
      setSimulationActive(false);
      localStorage.removeItem('formData');
      localStorage.removeItem('chartData');
      localStorage.removeItem('simulationActive');
    }
  };

  return (
    <div>
      <h1>Live Trading Simulation</h1>
      <MarketStatus />
      <TradingForm onSubmit={handleFormSubmit} />
      {simulationActive && (
        <>
          <button onClick={handleReset} style={{ margin: '1rem 0', padding: '0.5rem 1rem' }}>
            Reset Simulation
          </button>
          <StockChart data={chartData} />
        </>
      )}
    </div>
  );
};

export default HomePage;
