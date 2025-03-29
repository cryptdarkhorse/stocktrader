import axios from 'axios';
import { ALPHA_VANTAGE_API_KEY } from '../config/config';

const BASE_URL = 'https://www.alphavantage.co/query';

const AlphaVantageService = {
  /**
   * Fetches intraday data for a given ticker.
   * Uses the 'TIME_SERIES_INTRADAY' endpoint with a 1-minute interval.
   *
   * @param {string} ticker - The stock ticker symbol.
   * @returns {Promise<object|null>} - API response data or null if an error occurs.
   */
  getIntradayData: async (ticker) => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          function: 'TIME_SERIES_INTRADAY',
          symbol: ticker,
          interval: '1min',
          apikey: ALPHA_VANTAGE_API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching intraday data:', error);
      return null;
    }
  },

  /**
   * Fetches daily historical data for a given ticker.
   * Uses the 'TIME_SERIES_DAILY' endpoint.
   *
   * @param {string} ticker - The stock ticker symbol.
   * @returns {Promise<object|null>} - API response data or null if an error occurs.
   */
  getDailyData: async (ticker) => {
    try {
      const response = await axios.get(BASE_URL, {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol: ticker,
          apikey: ALPHA_VANTAGE_API_KEY,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching daily data:', error);
      return null;
    }
  },
};

export default AlphaVantageService;
