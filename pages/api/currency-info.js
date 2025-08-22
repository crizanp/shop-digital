// pages/api/currency-info.js - Server-side API to get user's currency information
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get client IP from request headers
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0] : req.connection.remoteAddress;
    
    // For localhost/development, use a default country
    if (!ip || ip === '::1' || ip === '127.0.0.1' || ip.includes('localhost')) {
      return res.status(200).json({
        country: 'US',
        currency: 'USD',
        exchangeRate: 1,
        symbol: '$'
      });
    }

    let country = 'US'; // Default fallback
    
    // Try multiple geolocation services
    const geoServices = [
      `https://ipapi.co/${ip}/country_code/`,
      `https://ipinfo.io/${ip}/country`,
      `http://ip-api.com/json/${ip}?fields=countryCode`
    ];

    for (const service of geoServices) {
      try {
        const response = await fetch(service, {
          headers: {
            'User-Agent': 'Foxbeep-Currency-Service/1.0'
          },
          timeout: 5000
        });
        
        if (response.ok) {
          const data = await response.text();
          
          if (service.includes('ip-api.com')) {
            const jsonData = JSON.parse(data);
            country = jsonData.countryCode || 'US';
          } else {
            country = data.trim() || 'US';
          }
          
          if (country && country.length === 2) {
            break; // Successfully got country code
          }
        }
      } catch (error) {
        console.log(`Geolocation service ${service} failed:`, error.message);
        continue; // Try next service
      }
    }

    // Map country to currency
    const COUNTRY_CURRENCY_MAP = {
      // Major economies
      'US': 'USD', 'CA': 'CAD', 'MX': 'MXN',
      'GB': 'GBP', 'IE': 'EUR', 'FR': 'EUR', 'DE': 'EUR', 'IT': 'EUR', 'ES': 'EUR',
      'NL': 'EUR', 'BE': 'EUR', 'AT': 'EUR', 'FI': 'EUR', 'PT': 'EUR', 'GR': 'EUR',
      'LU': 'EUR', 'CY': 'EUR', 'MT': 'EUR', 'SI': 'EUR', 'SK': 'EUR', 'EE': 'EUR',
      'LV': 'EUR', 'LT': 'EUR',
      'JP': 'JPY', 'CN': 'CNY', 'IN': 'INR', 'KR': 'KRW',
      'AU': 'AUD', 'NZ': 'NZD', 'SG': 'SGD', 'HK': 'HKD',
      'CH': 'CHF', 'NO': 'NOK', 'SE': 'SEK', 'DK': 'DKK',
      'BR': 'BRL', 'AR': 'ARS', 'CL': 'CLP', 'CO': 'COP', 'PE': 'PEN',
      'ZA': 'ZAR', 'NG': 'NGN', 'EG': 'EGP', 'MA': 'MAD',
      'RU': 'RUB', 'TR': 'TRY', 'IL': 'ILS', 'SA': 'SAR', 'AE': 'AED',
      'TH': 'THB', 'MY': 'MYR', 'ID': 'IDR', 'PH': 'PHP', 'VN': 'VND',
      'PL': 'PLN', 'CZ': 'CZK', 'HU': 'HUF', 'RO': 'RON', 'BG': 'BGN',
      'HR': 'EUR', 'RS': 'RSD', 'UA': 'UAH', 'BY': 'BYN',
      'BD': 'BDT', 'PK': 'PKR', 'LK': 'LKR', 'NP': 'NPR'
    };

    const currency = COUNTRY_CURRENCY_MAP[country] || 'USD';

    // Get exchange rate if not USD
    let exchangeRate = 1;
    if (currency !== 'USD') {
      try {
        const rateResponse = await fetch(`https://api.exchangerate-api.com/v4/latest/USD`);
        if (rateResponse.ok) {
          const rateData = await rateResponse.json();
          exchangeRate = rateData.rates[currency] || 1;
        }
      } catch (error) {
        console.log('Exchange rate fetch failed:', error.message);
        // Use fallback rates for major currencies
        const fallbackRates = {
          'EUR': 0.85, 'GBP': 0.73, 'JPY': 110, 'CNY': 6.4, 'INR': 75,
          'CAD': 1.25, 'AUD': 1.35, 'CHF': 0.92, 'KRW': 1200, 'BRL': 5.2
        };
        exchangeRate = fallbackRates[currency] || 1;
      }
    }

    // Get currency symbol
    const CURRENCY_SYMBOLS = {
      'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'CNY': '¥',
      'INR': '₹', 'CAD': 'C$', 'AUD': 'A$', 'CHF': 'CHF',
      'KRW': '₩', 'BRL': 'R$', 'MXN': '$', 'SGD': 'S$', 'HKD': 'HK$',
      'NOK': 'kr', 'SEK': 'kr', 'DKK': 'kr', 'PLN': 'zł', 'CZK': 'Kč'
    };

    const symbol = CURRENCY_SYMBOLS[currency] || currency;

    return res.status(200).json({
      country,
      currency,
      exchangeRate,
      symbol,
      ip: ip // For debugging
    });

  } catch (error) {
    console.error('Currency info API error:', error);
    
    // Return fallback data
    return res.status(200).json({
      country: 'US',
      currency: 'USD',
      exchangeRate: 1,
      symbol: '$',
      error: 'Fallback data used'
    });
  }
}
