import React, { useState, useEffect } from 'react';

// Get current time in Eastern Time (ET)
const getEasternTime = () => {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
};

// Get current time in IST
const getISTTime = () => {
  return new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
};

// Convert a Date (assumed in ET) to IST for display purposes
const convertETtoIST = (dateET) => {
  return new Date(dateET.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
};

const MarketStatus = () => {
  const calculateMarketStatus = () => {
    const nowET = getEasternTime();
    const day = nowET.getDay(); // 0 = Sunday, 6 = Saturday

    // If it's weekend, the market is closed.
    if (day === 0 || day === 6) {
      let nextOpenET = new Date(nowET);
      // Advance day by day until a weekday (Monday-Friday)
      while (nextOpenET.getDay() === 0 || nextOpenET.getDay() === 6) {
        nextOpenET.setDate(nextOpenET.getDate() + 1);
      }
      nextOpenET.setHours(9, 30, 0, 0);
      return { isOpen: false, nextOpenET };
    }

    // For weekdays, set open and close times.
    const openET = new Date(nowET);
    openET.setHours(9, 30, 0, 0); // Market opens at 9:30 AM ET
    const closeET = new Date(nowET);
    closeET.setHours(16, 0, 0, 0); // Market closes at 4:00 PM ET

    if (nowET >= openET && nowET <= closeET) {
      return { isOpen: true, nextOpenET: null };
    } else {
      let nextOpenET = new Date(nowET);
      if (nowET > closeET) {
        nextOpenET.setDate(nextOpenET.getDate() + 1);
      }
      // If next day falls on a weekend, move to the next weekday.
      while (nextOpenET.getDay() === 0 || nextOpenET.getDay() === 6) {
        nextOpenET.setDate(nextOpenET.getDate() + 1);
      }
      nextOpenET.setHours(9, 30, 0, 0);
      return { isOpen: false, nextOpenET };
    }
  };

  const [marketStatus, setMarketStatus] = useState(calculateMarketStatus());
  const [countdown, setCountdown] = useState('');
  const [nextOpenISTStr, setNextOpenISTStr] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      const status = calculateMarketStatus();
      setMarketStatus(status);

      if (!status.isOpen && status.nextOpenET) {
        const nowIST = getISTTime();
        const nextOpenIST = convertETtoIST(status.nextOpenET);
        const diff = nextOpenIST - nowIST;
        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          setCountdown(`${hours}h ${minutes}m ${seconds}s`);
        } else {
          setCountdown('0h 0m 0s');
        }
        // Format the next open time in IST for display.
        setNextOpenISTStr(nextOpenIST.toLocaleString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="market-status">
      {marketStatus.isOpen ? (
        <h3>Market is Open</h3>
      ) : (
        <div>
          <h3>Market is Closed</h3>
          <p>Next Market Open (ET): {nextOpenISTStr}</p>
          <p>Countdown: {countdown}</p>
        </div>
      )}
    </div>
  );
};

export default MarketStatus;
