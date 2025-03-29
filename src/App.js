import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BacktestingPage from './pages/BacktestingPage';
import PerformancePage from './pages/PerformancePage';
import './App.css'; // Make sure this contains the dark theme CSS

function App() {
  return (
    <Router>
      <div className="app-container fade-in">
        {/* Navigation Bar */}
        <nav className="navbar">
          <ul className="nav-links">
            <li>
              <Link to="/">🏠 Live Trading</Link>
            </li>
            <li>
              <Link to="/backtesting">🧪 Backtesting</Link>
            </li>
            <li>
              <Link to="/performance">📊 Performance</Link>
            </li>
          </ul>
        </nav>

        {/* Main Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/backtesting" element={<BacktestingPage />} />
          <Route path="/performance" element={<PerformancePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
