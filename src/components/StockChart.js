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
  Scatter,
  Brush
} from 'recharts';

// Helper function to determine marker color based on marker type
const getMarkerColor = (type) => {
  switch (type) {
    case 'Buy':
      return 'green';
    case 'Sell':
    case 'Sell (EOD)':
      return 'red';
    case 'Pattern':
      return 'blue';
    default:
      return 'black';
  }
};

// Custom dot renderer for markers
const renderCustomizedDot = (props) => {
  const { cx, cy, payload } = props;
  // Increase radius to 8 and add a stroke for visibility
  const fillColor = getMarkerColor(payload.type);
  return (
    <circle 
      cx={cx} 
      cy={cy} 
      r={8} 
      stroke="black" 
      strokeWidth={1} 
      fill={fillColor} 
    />
  );
};

const StockChart = ({ data, markers = [] }) => {
  // Optional: Normalize date strings if needed (assumed to be consistent for now)
  // For example: const normalizedData = data.map(item => ({ ...item, date: formatDate(item.date) }));

  // Prepare markers for the scatter component:
  // Map markers to have keys "date" and "value" (y-value) matching the chart's data.
  const scatterData = markers.map((m) => ({
    date: m.date,
    value: m.value, // "value" corresponds to the close price for markers
    type: m.type,
    label: m.label
  }));

  // Debug logging (uncomment if needed)
  // console.log("Chart Data:", data);
  // console.log("Scatter Markers:", scatterData);

  return (
    <div className="stock-chart">
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            type="category" 
            allowDuplicatedCategory={false}
            tickFormatter={(tick) => {
              // Show only time part if the date string includes both date and time.
              const parts = tick.split(" ");
              return parts.length > 1 ? parts[1] : tick;
            }}
          />
          <YAxis domain={['dataMin', 'dataMax']} />
          <Tooltip />
          <Legend />
          {/* Main price line */}
          <Line type="monotone" dataKey="close" stroke="#8884d8" dot={false} />
          {/* Render all markers using a single Scatter component with custom dot renderer */}
          <Scatter 
            data={scatterData}
            x="date"
            y="value"
            shape={renderCustomizedDot}
          />
          <Brush
            dataKey="date"
            height={30}
            stroke="#8884d8"
            travellerWidth={10}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
