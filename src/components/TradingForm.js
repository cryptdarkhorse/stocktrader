import React, { useState } from 'react';

const TradingForm = ({ onSubmit }) => {
  const [ticker, setTicker] = useState('');
  const [capital, setCapital] = useState('');
  const [riskPercentage, setRiskPercentage] = useState('');
  const [greedPercentage, setGreedPercentage] = useState('');
  const [platform, setPlatform] = useState('Generic US Platform');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!ticker || !capital || !riskPercentage || !greedPercentage) {
      alert('Please fill in all fields.');
      return;
    }
    const formData = {
      ticker: ticker.trim().toUpperCase(),
      capital: parseFloat(capital),
      riskPercentage: parseFloat(riskPercentage),
      greedPercentage: parseFloat(greedPercentage),
      platform,
    };
    // Pass form data to parent component
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="trading-form">
      <div>
        <label htmlFor="ticker">Stock Ticker:</label>
        <input
          type="text"
          id="ticker"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          placeholder="e.g., AAPL"
          required
        />
      </div>
      <div>
        <label htmlFor="capital">Capital ($):</label>
        <input
          type="number"
          id="capital"
          value={capital}
          onChange={(e) => setCapital(e.target.value)}
          placeholder="e.g., 1000"
          required
        />
      </div>
      <div>
        <label htmlFor="riskPercentage">Risk Percentage (%):</label>
        <input
          type="number"
          id="riskPercentage"
          value={riskPercentage}
          onChange={(e) => setRiskPercentage(e.target.value)}
          placeholder="e.g., 30"
          required
        />
      </div>
      <div>
        <label htmlFor="greedPercentage">Greed Percentage (%):</label>
        <input
          type="number"
          id="greedPercentage"
          value={greedPercentage}
          onChange={(e) => setGreedPercentage(e.target.value)}
          placeholder="e.g., 20"
          required
        />
      </div>
      <div>
        <label htmlFor="platform">Trading Platform:</label>
        <select
          id="platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          <option value="Generic US Platform">
            Generic US Platform (e.g., Commission $1/trade)
          </option>
          {/* Additional platforms can be added here */}
        </select>
      </div>
      <button type="submit">Start Simulation</button>
    </form>
  );
};

export default TradingForm;
