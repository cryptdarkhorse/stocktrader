/**
 * Utility functions for detecting candlestick patterns.
 * Each candle should have properties: date, open, high, low, close.
 * The following implementations use simplified criteria for demonstration purposes.
 */

// Single-candle patterns

export const isDoji = (candle) => {
    const bodySize = Math.abs(candle.close - candle.open);
    const range = candle.high - candle.low;
    return range > 0 ? bodySize / range < 0.1 : false;
  };
  
  export const isHammer = (candle) => {
    const bodySize = Math.abs(candle.close - candle.open);
    const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
    const upperShadow = candle.high - Math.max(candle.open, candle.close);
    return lowerShadow > 2 * bodySize && upperShadow < bodySize;
  };
  
  export const isInvertedHammer = (candle) => {
    const bodySize = Math.abs(candle.close - candle.open);
    const upperShadow = candle.high - Math.max(candle.open, candle.close);
    const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
    return upperShadow > 2 * bodySize && lowerShadow < bodySize;
  };
  
  export const isShootingStar = (candle) => {
    const bodySize = Math.abs(candle.close - candle.open);
    const upperShadow = candle.high - Math.max(candle.open, candle.close);
    const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
    return upperShadow > 2 * bodySize && lowerShadow < bodySize;
  };
  
  export const isSpinningTop = (candle) => {
    const bodySize = Math.abs(candle.close - candle.open);
    const range = candle.high - candle.low;
    if (range === 0) return false;
    const ratio = bodySize / range;
    return ratio >= 0.1 && ratio <= 0.3;
  };
  
  export const isBullishMarubozu = (candle) => {
    const bodySize = candle.close - candle.open;
    if (bodySize <= 0) return false;
    const lowerShadow = candle.open - candle.low;
    const upperShadow = candle.high - candle.close;
    return lowerShadow / bodySize < 0.1 && upperShadow / bodySize < 0.1;
  };
  
  export const isBearishMarubozu = (candle) => {
    const bodySize = candle.open - candle.close;
    if (bodySize <= 0) return false;
    const lowerShadow = candle.close - candle.low;
    const upperShadow = candle.high - candle.open;
    return lowerShadow / bodySize < 0.1 && upperShadow / bodySize < 0.1;
  };
  
  // Two-candle patterns
  
  export const isBullishEngulfing = (prev, curr) => {
    return (
      prev.close < prev.open &&
      curr.close > curr.open &&
      curr.open < prev.close &&
      curr.close > prev.open
    );
  };
  
  export const isBearishEngulfing = (prev, curr) => {
    return (
      prev.close > prev.open &&
      curr.close < curr.open &&
      curr.open > prev.close &&
      curr.close < prev.open
    );
  };
  
  export const isBullishHarami = (prev, curr) => {
    if (!(prev.close < prev.open && curr.close > curr.open)) return false;
    return curr.open > prev.close && curr.close < prev.open;
  };
  
  export const isBearishHarami = (prev, curr) => {
    if (!(prev.close > prev.open && curr.close < curr.open)) return false;
    return curr.open < prev.close && curr.close > prev.open;
  };
  
  export const isPiercingPattern = (prev, curr) => {
    if (!(prev.close < prev.open && curr.close > curr.open)) return false;
    const midPoint = (prev.open + prev.close) / 2;
    return curr.open < prev.low && curr.close > midPoint;
  };
  
  export const isDarkCloudCover = (prev, curr) => {
    if (!(prev.close > prev.open && curr.close < curr.open)) return false;
    const midPoint = (prev.open + prev.close) / 2;
    return curr.open > prev.high && curr.close < midPoint;
  };
  
  export const isTweezerTops = (prev, curr) => {
    const threshold = 0.01 * curr.high;
    return Math.abs(prev.high - curr.high) < threshold;
  };
  
  export const isTweezerBottoms = (prev, curr) => {
    const threshold = 0.01 * curr.low;
    return Math.abs(prev.low - curr.low) < threshold;
  };
  
  // Three-candle patterns
  
  export const isMorningStar = (candle1, candle2, candle3) => {
    // First candle: bearish, third candle: bullish; second candle: small body
    if (!(candle1.close < candle1.open && candle3.close > candle3.open)) return false;
    const body2 = Math.abs(candle2.close - candle2.open);
    const range2 = candle2.high - candle2.low;
    const isSmallBody = range2 > 0 ? body2 / range2 < 0.3 : false;
    return isSmallBody && candle3.close > (candle1.open + candle1.close) / 2;
  };
  
  export const isEveningStar = (candle1, candle2, candle3) => {
    // First candle: bullish, third candle: bearish; second candle: small body
    if (!(candle1.close > candle1.open && candle3.close < candle3.open)) return false;
    const body2 = Math.abs(candle2.close - candle2.open);
    const range2 = candle2.high - candle2.low;
    const isSmallBody = range2 > 0 ? body2 / range2 < 0.3 : false;
    return isSmallBody && candle3.close < (candle1.open + candle1.close) / 2;
  };
  
  /**
   * Detect multiple candlestick patterns in an array of candle data.
   * Returns an array of detected patterns with type and indices (or indices for multi-candle patterns).
   *
   * @param {Array} data - Array of candle objects.
   * @returns {Array} patterns - Detected patterns with type and related candle indices.
   */
  export const detectCandlestickPatterns = (data) => {
    const patterns = [];
  
    for (let i = 0; i < data.length; i++) {
      const candle = data[i];
  
      // Single-candle patterns:
      if (isDoji(candle)) {
        patterns.push({ type: 'Doji', index: i, date: candle.date });
      }
      if (isHammer(candle)) {
        patterns.push({ type: 'Hammer', index: i, date: candle.date });
      }
      if (isInvertedHammer(candle)) {
        patterns.push({ type: 'Inverted Hammer', index: i, date: candle.date });
      }
      if (isShootingStar(candle)) {
        patterns.push({ type: 'Shooting Star', index: i, date: candle.date });
      }
      if (isSpinningTop(candle)) {
        patterns.push({ type: 'Spinning Top', index: i, date: candle.date });
      }
      if (isBullishMarubozu(candle)) {
        patterns.push({ type: 'Bullish Marubozu', index: i, date: candle.date });
      }
      if (isBearishMarubozu(candle)) {
        patterns.push({ type: 'Bearish Marubozu', index: i, date: candle.date });
      }
  
      // Two-candle patterns:
      if (i > 0) {
        const prevCandle = data[i - 1];
        if (isBullishEngulfing(prevCandle, candle)) {
          patterns.push({ type: 'Bullish Engulfing', indices: [i - 1, i], date: candle.date });
        }
        if (isBearishEngulfing(prevCandle, candle)) {
          patterns.push({ type: 'Bearish Engulfing', indices: [i - 1, i], date: candle.date });
        }
        if (isBullishHarami(prevCandle, candle)) {
          patterns.push({ type: 'Bullish Harami', indices: [i - 1, i], date: candle.date });
        }
        if (isBearishHarami(prevCandle, candle)) {
          patterns.push({ type: 'Bearish Harami', indices: [i - 1, i], date: candle.date });
        }
        if (isPiercingPattern(prevCandle, candle)) {
          patterns.push({ type: 'Piercing Pattern', indices: [i - 1, i], date: candle.date });
        }
        if (isDarkCloudCover(prevCandle, candle)) {
          patterns.push({ type: 'Dark Cloud Cover', indices: [i - 1, i], date: candle.date });
        }
        if (isTweezerTops(prevCandle, candle)) {
          patterns.push({ type: 'Tweezer Tops', indices: [i - 1, i], date: candle.date });
        }
        if (isTweezerBottoms(prevCandle, candle)) {
          patterns.push({ type: 'Tweezer Bottoms', indices: [i - 1, i], date: candle.date });
        }
      }
  
      // Three-candle patterns:
      if (i > 1) {
        const candle1 = data[i - 2];
        const candle2 = data[i - 1];
        if (isMorningStar(candle1, candle2, candle)) {
          patterns.push({ type: 'Morning Star', indices: [i - 2, i - 1, i], date: candle.date });
        }
        if (isEveningStar(candle1, candle2, candle)) {
          patterns.push({ type: 'Evening Star', indices: [i - 2, i - 1, i], date: candle.date });
        }
      }
    }
  
    return patterns;
  };
  