import React from 'react';

const TradeLog = ({ trades }) => {
  return (
    <div className="trade-log">
      <h2>Trade Log</h2>
      {trades.length === 0 ? (
        <p>No trades executed yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Action</th>
              <th>Ticker</th>
              <th>Buy Price</th>
              <th>Sell Price</th>
              <th>Quantity</th>
              <th>Profit/Loss</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, index) => (
              <tr key={index}>
                <td>{trade.time}</td>
                <td>{trade.action}</td>
                <td>{trade.ticker}</td>
                <td>{trade.buyPrice ? `$${trade.buyPrice}` : 'N/A'}</td>
                <td>{trade.sellPrice ? `$${trade.sellPrice}` : 'N/A'}</td>
                <td>{trade.quantity !== undefined ? trade.quantity : 'N/A'}</td>
                <td>{trade.profitLoss ? `$${trade.profitLoss}` : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TradeLog;
