// API endpoint to get exchange rates
// Fetches real-time exchange rates from exchangerate-api.com
let cachedRates = null;
let lastFetch = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour cache

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const now = Date.now();
    
    // Return cached rates if available and not expired
    if (cachedRates && (now - lastFetch) < CACHE_DURATION) {
      return res.status(200).json({
        rates: cachedRates,
        cached: true,
        timestamp: lastFetch
      });
    }

    // Try to fetch fresh rates from API
    let rates = null;
    
    try {
      // Using free API for USD based exchange rates
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        rates = {
          USD: 1,
          GBP: data.rates?.GBP || 0.73,
          NPR: data.rates?.NPR || 132.50
        };
      }
    } catch (error) {
      console.log('Exchange rate API error:', error.message);
    }

    // Fallback rates if API fails
    if (!rates) {
      rates = {
        USD: 1,
        GBP: 0.73,
        NPR: 132.50
      };
    }

    // Cache the rates
    cachedRates = rates;
    lastFetch = now;

    return res.status(200).json({
      rates,
      cached: false,
      timestamp: now
    });
  } catch (error) {
    console.error('Error in exchange rates API:', error);
    
    // Return fallback rates on error
    return res.status(200).json({
      rates: {
        USD: 1,
        GBP: 0.73,
        NPR: 132.50
      },
      error: error.message,
      cached: false
    });
  }
}
