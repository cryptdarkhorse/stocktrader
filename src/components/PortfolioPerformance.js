import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const PortfolioPerformance = ({ performanceData }) => {
  return (
    <div className="portfolio-performance">
      <h2>Portfolio Performance</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={performanceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={['dataMin', 'dataMax']} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#82ca9d" dot />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PortfolioPerformance;
