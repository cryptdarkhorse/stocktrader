/**
 * Utility functions for trading calculations.
 * These functions calculate the number of shares to trade,
 * the stop-loss price, the target price, and the commission fee.
 */

/**
 * Calculates the number of shares to trade based on the user's capital,
 * risk percentage, and the current trading price.
 * 
 * @param {number} capital - Total capital available.
 * @param {number} riskPercentage - The percentage of capital to risk.
 * @param {number} currentPrice - Current price of the stock.
 * @returns {number} Number of shares to trade.
 */
export const calculateTradeQuantity = (capital, riskPercentage, currentPrice) => {
    const riskCapital = capital * (riskPercentage / 100);
    const quantity = riskCapital / currentPrice;
    return Math.floor(quantity); // round down to whole shares
  };
  
  /**
   * Calculates the stop-loss price based on the current price and risk percentage.
   * 
   * @param {number} currentPrice - Current price of the stock.
   * @param {number} riskPercentage - The percentage to set the stop-loss below the current price.
   * @returns {number} Stop-loss price.
   */
  export const calculateStopLoss = (currentPrice, riskPercentage) => {
    return currentPrice * (1 - riskPercentage / 100);
  };
  
  /**
   * Calculates the target price based on the current price and greed percentage.
   * 
   * @param {number} currentPrice - Current price of the stock.
   * @param {number} greedPercentage - The percentage to set the target price above the current price.
   * @returns {number} Target price.
   */
  export const calculateTargetPrice = (currentPrice, greedPercentage) => {
    return currentPrice * (1 + greedPercentage / 100);
  };
  
  /**
   * Calculates the commission fee based on the selected trading platform.
   * For this POC, we use a fixed fee for the "Generic US Platform".
   * 
   * @param {string} platform - Trading platform name.
   * @returns {number} Commission fee in dollars.
   */
  export const calculateCommission = (platform) => {
    // For now, we assume only one platform:
    if (platform === 'Generic US Platform') {
      return 1; // Fixed commission fee per trade
    }
    // Additional platforms and their fee structures can be added here.
    return 0;
  };
  