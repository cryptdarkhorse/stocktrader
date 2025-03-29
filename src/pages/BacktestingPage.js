import React, { useState, useEffect } from 'react';
import StockChart from '../components/StockChart';
import AlphaVantageService from '../services/AlphaVantageService';
import TradeLog from '../components/TradeLog';
import { detectCandlestickPatterns } from '../utils/candlestickPatterns';

const BacktestingPage = () => {
  // States for symbol, intraday data, simulation, trade log, analysis, etc.
  const [symbol, setSymbol] = useState(() => {
    const stored = localStorage.getItem('intradaySymbol');
    return stored ? stored : '';
  });
  const [intradayData, setIntradayData] = useState(() => {
    const stored = localStorage.getItem('intradayData');
    return stored ? JSON.parse(stored) : [];
  });
  const [simulationActive, setSimulationActive] = useState(() => {
    const stored = localStorage.getItem('intradayActive');
    return stored ? JSON.parse(stored) : false;
  });
  const [tradeLog, setTradeLog] = useState(() => {
    const stored = localStorage.getItem('intradayTradeLog');
    return stored ? JSON.parse(stored) : [];
  });
  const [analysis, setAnalysis] = useState(() => {
    const stored = localStorage.getItem('intradayAnalysis');
    return stored ? stored : '';
  });

  // New input fields as state variables
  const [capital, setCapital] = useState(() => {
    const stored = localStorage.getItem('backtestCapital');
    return stored ? Number(stored) : 1000;
  });
  const [risk, setRisk] = useState(() => {
    const stored = localStorage.getItem('backtestRisk');
    return stored ? Number(stored) : 30;
  });
  const [greed, setGreed] = useState(() => {
    const stored = localStorage.getItem('backtestGreed');
    return stored ? Number(stored) : 20;
  });
  const [commissionInput, setCommissionInput] = useState(() => {
    const stored = localStorage.getItem('backtestCommission');
    return stored ? Number(stored) : 20;
  });

  // Persist new input fields to local storage
  useEffect(() => {
    localStorage.setItem('backtestCapital', capital);
  }, [capital]);
  useEffect(() => {
    localStorage.setItem('backtestRisk', risk);
  }, [risk]);
  useEffect(() => {
    localStorage.setItem('backtestGreed', greed);
  }, [greed]);
  useEffect(() => {
    localStorage.setItem('backtestCommission', commissionInput);
  }, [commissionInput]);

  // Persist other states
  useEffect(() => {
    localStorage.setItem('intradaySymbol', symbol);
  }, [symbol]);
  useEffect(() => {
    localStorage.setItem('intradayData', JSON.stringify(intradayData));
  }, [intradayData]);
  useEffect(() => {
    localStorage.setItem('intradayActive', JSON.stringify(simulationActive));
  }, [simulationActive]);
  useEffect(() => {
    localStorage.setItem('intradayTradeLog', JSON.stringify(tradeLog));
  }, [tradeLog]);
  useEffect(() => {
    localStorage.setItem('intradayAnalysis', analysis);
  }, [analysis]);

  /**
   * Fetch 1-minute intraday data for the given symbol using Alpha Vantage.
   * The code dynamically detects the most recent trading day from the data.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symbol) {
      alert("Please enter a stock symbol.");
      return;
    }
    setSimulationActive(true);

    // Fetch intraday data (1-minute interval)
    const data = await AlphaVantageService.getIntradayData(symbol.toUpperCase());
    if (data && data["Time Series (1min)"]) {
      const timeSeries = data["Time Series (1min)"];
      // Convert to array of candles
      let processedData = Object.keys(timeSeries).map((timestamp) => {
        const candle = timeSeries[timestamp];
        return {
          date: timestamp, // e.g., "2023-03-15 09:31:00"
          open: parseFloat(candle["1. open"]),
          high: parseFloat(candle["2. high"]),
          low: parseFloat(candle["3. low"]),
          close: parseFloat(candle["4. close"]),
          volume: parseInt(candle["5. volume"], 10)
        };
      });

      // Sort in ascending time order
      processedData.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Dynamically detect the most recent date in the data
      if (processedData.length > 0) {
        const latestDate = processedData[processedData.length - 1].date.split(" ")[0];
        processedData = processedData.filter(item => item.date.startsWith(latestDate));
      }

      if (processedData.length < 1) {
        alert("No data available for the most recent trading day or symbol.");
        setSimulationActive(false);
        return;
      }

      setIntradayData(processedData);
      performIntradaySimulation(processedData);
    } else {
      alert('Error fetching intraday data or API limit reached.');
      setSimulationActive(false);
    }
  };

  /**
   * Perform a naive intraday simulation (with reversed logic):
   * - Loop over each minute's candle.
   * - If a bearish signal is detected and we're not in a position, "buy" the stock.
   * - If a bullish signal is detected and we're in a position, "sell" the stock.
   */
  const performIntradaySimulation = (data) => {
    let currentCapital = capital;
    let inPosition = false;
    let entryPrice = 0;
    let sharesHeld = 0;

    const trades = [];
    const patternsDetected = detectCandlestickPatterns(data);

    data.forEach((candle, index) => {
      // Filter patterns for the current candle
      const patternsThisCandle = patternsDetected.filter(p => p.index === index);
      const hasBullishSignal = patternsThisCandle.some(p =>
        p.type.includes('Bullish') ||
        p.type === 'Hammer' ||
        p.type === 'Morning Star' ||
        p.type === 'Inverted Hammer'
      );
      const hasBearishSignal = patternsThisCandle.some(p =>
        p.type.includes('Bearish') ||
        p.type === 'Shooting Star' ||
        p.type === 'Evening Star'
      );

      // REVERSED LOGIC:
      // If not in position and bearish signal detected -> Buy
      if (!inPosition && hasBearishSignal) {
        const tradeCap = currentCapital * (risk / 100);
        const quantity = Math.floor(tradeCap / candle.close);
        if (quantity > 0) {
          const commission = Number(commissionInput);
          const cost = quantity * candle.close + commission;
          if (cost <= currentCapital) {
            currentCapital -= cost;
            inPosition = true;
            entryPrice = candle.close;
            sharesHeld = quantity;

            trades.push({
              time: candle.date,
              action: 'Buy',
              ticker: symbol.toUpperCase(),
              buyPrice: candle.close,
              sellPrice: null,
              quantity,
              profitLoss: null
            });
          }
        }
      }
      // If in position and bullish signal detected -> Sell
      else if (inPosition && hasBullishSignal) {
        const commission = Number(commissionInput);
        const proceeds = sharesHeld * candle.close - commission;
        const tradeProfit = proceeds - (sharesHeld * entryPrice);
        currentCapital += proceeds;
        inPosition = false;

        trades.push({
          time: candle.date,
          action: 'Sell',
          ticker: symbol.toUpperCase(),
          sellPrice: candle.close,
          buyPrice: null,
          quantity: sharesHeld,
          profitLoss: tradeProfit
        });
        sharesHeld = 0;
      }
    });

    // If still in position at end of day, force sell at last candle
    if (inPosition) {
      const lastCandle = data[data.length - 1];
      const commission = Number(commissionInput);
      const proceeds = sharesHeld * lastCandle.close - commission;
      const tradeProfit = proceeds - (sharesHeld * entryPrice);
      currentCapital += proceeds;
      trades.push({
        time: lastCandle.date,
        action: 'Sell (EOD)',
        ticker: symbol.toUpperCase(),
        sellPrice: lastCandle.close,
        buyPrice: null,
        quantity: sharesHeld,
        profitLoss: tradeProfit
      });
      inPosition = false;
      sharesHeld = 0;
    }

    setTradeLog(trades);

    // Create analysis summary
    const totalPL = currentCapital - capital;
    const analysisSummary = 
      `Intraday Simulation for ${symbol.toUpperCase()} (Reversed Logic)\n` +
      `Date Range: ${data[0].date} - ${data[data.length - 1].date}\n` +
      `Initial Capital: $${capital}\n` +
      `Final Capital: $${currentCapital.toFixed(2)}\n` +
      `Total P/L: $${totalPL.toFixed(2)}\n` +
      `Number of Trades: ${trades.length}\n`;
    setAnalysis(analysisSummary);
  };

  // Prepare markers for the chart: combine trade markers and pattern markers.
  const prepareMarkers = () => {
    // Trade markers from tradeLog
    const tradeMarkers = tradeLog.map(trade => ({
      date: trade.time,
      value: trade.action === 'Buy' ? trade.buyPrice : trade.sellPrice,
      type: trade.action,
      label: trade.action
    }));
    // Pattern markers from intraday data using detected patterns.
    const patternMarkers = intradayData.length > 0 ? 
      detectCandlestickPatterns(intradayData)
        .filter(pat => typeof pat.index === 'number' && pat.index < intradayData.length)
        .map(pat => ({
          date: intradayData[pat.index].date,
          value: intradayData[pat.index].close,
          type: 'Pattern',
          label: pat.type
        }))
      : [];
    
    // Debug: Log markers
    console.log("Trade Markers:", tradeMarkers);
    console.log("Pattern Markers:", patternMarkers);
    
    return [...tradeMarkers, ...patternMarkers];
  };

  // Reset simulation state
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the intraday simulation?")) {
      setSymbol('');
      setIntradayData([]);
      setSimulationActive(false);
      setTradeLog([]);
      setAnalysis('');
      localStorage.removeItem('intradaySymbol');
      localStorage.removeItem('intradayData');
      localStorage.removeItem('intradayActive');
      localStorage.removeItem('intradayTradeLog');
      localStorage.removeItem('intradayAnalysis');
      localStorage.removeItem('backtestCapital');
      localStorage.removeItem('backtestRisk');
      localStorage.removeItem('backtestGreed');
      localStorage.removeItem('backtestCommission');
    }
  };

  return (
    <div>
      <h1>Intraday Backtesting Simulation (Reversed Logic)</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="symbol">Stock Symbol (US): </label>
          <input
            type="text"
            id="symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="e.g., AAPL"
            required
          />
        </div>
        <div>
          <label htmlFor="capital">Initial Capital ($): </label>
          <input
            type="number"
            id="capital"
            value={capital}
            onChange={(e) => setCapital(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label htmlFor="risk">Risk Percentage (%): </label>
          <input
            type="number"
            id="risk"
            value={risk}
            onChange={(e) => setRisk(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label htmlFor="greed">Greed Percentage (%): </label>
          <input
            type="number"
            id="greed"
            value={greed}
            onChange={(e) => setGreed(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label htmlFor="commission">Commission per Trade ($): </label>
          <input
            type="number"
            id="commission"
            value={commissionInput}
            onChange={(e) => setCommissionInput(Number(e.target.value))}
            required
          />
        </div>
        <button type="submit">Run Intraday Backtest</button>
      </form>

      {simulationActive && (
        <>
          <button onClick={handleReset} style={{ margin: '1rem 0', padding: '0.5rem 1rem' }}>
            Reset Simulation
          </button>

          {intradayData.length > 0 && (
            <>
              <h2>Intraday Price Chart</h2>
              <StockChart
                data={intradayData.map(item => ({
                  date: item.date,
                  close: item.close
                }))}
                markers={prepareMarkers()}
              />
            </>
          )}

          {tradeLog.length > 0 && (
            <>
              <h2>Trade Log</h2>
              <TradeLog trades={tradeLog} />
            </>
          )}

          {analysis && (
            <>
              <h2>Analysis</h2>
              <pre>{analysis}</pre>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default BacktestingPage;
