# Stock Trading Simulator

This project is a proof-of-concept stock trading simulator for US stocks, built with React. It uses the Alpha Vantage API to fetch real-time and historical stock data and simulates trades based on user inputs and candlestick pattern detection.

## Features

- **Real-Time Stock Chart:** Displays live stock data with candlestick pattern overlays.
- **Trade Simulation:** Simulates trades based on user-defined capital, risk (for stop-loss), and greed (for target profit) percentages.
- **Portfolio Performance:** Tracks simulated trade results with performance metrics and trade logs.
- **Backtesting Option:** Uses historical data from Alpha Vantage (with CSV fallback if needed) to simulate past trades.
- **Market Status:** Shows market open/closed status with a countdown timer and premarket prices when applicable.
- **Future Expansion:** Placeholder for email notifications to send end-of-day portfolio reports.

## Setup Instructions

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   ```

2. **Install Dependencies:**
   ```bash
   cd stock-trading-simulator
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npm start
   ```
   The application will be available at [http://localhost:3000](http://localhost:3000).

## API Key

The project uses the following hardcoded Alpha Vantage API key (for intranet use):

```
mZaCU1705VC1XqCORwoiBylcekWVixHn
```

## Project Structure

```
stock-trading-simulator/
├── package.json
├── README.md
├── .gitignore
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
└── src/
    ├── index.js
    ├── App.js
    ├── App.css
    ├── config/
    │   └── config.js
    ├── components/
    │   ├── TradingForm.js
    │   ├── StockChart.js
    │   ├── PortfolioPerformance.js
    │   ├── TradeLog.js
    │   ├── MarketStatus.js
    │   ├── BacktestingForm.js
    │   └── NotificationPlaceholder.js
    ├── pages/
    │   ├── HomePage.js
    │   ├── BacktestingPage.js
    │   └── PerformancePage.js
    ├── services/
    │   └── AlphaVantageService.js
    ├── utils/
    │   ├── candlestickPatterns.js
    │   └── tradingCalculations.js
    └── assets/
        └── sample.csv
```

## Future Enhancements

- Integration with AWS Lambda for additional serverless functions.
- Enhanced UI/UX with more interactivity and refined design.
- Implementation of email notifications for end-of-day portfolio reports.

## License

This project is for demonstration purposes only.
