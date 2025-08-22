// API endpoint to get user's country and currency information
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get client IP address
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0] : req.connection.remoteAddress;
    
    // For localhost/development, default to Nepal for testing
    if (!ip || ip === '127.0.0.1' || ip === '::1' || ip.includes('localhost')) {
      return res.status(200).json({
        country: 'NP',
        currency: 'NPR',
        symbol: '₨'
      });
    }

    // Country to currency mapping
    const COUNTRY_CURRENCY_MAP = {
      'US': { currency: 'USD', symbol: '$' },
      'CA': { currency: 'CAD', symbol: 'C$' },
      'GB': { currency: 'GBP', symbol: '£' },
      'EU': { currency: 'EUR', symbol: '€' },
      'DE': { currency: 'EUR', symbol: '€' },
      'FR': { currency: 'EUR', symbol: '€' },
      'IT': { currency: 'EUR', symbol: '€' },
      'ES': { currency: 'EUR', symbol: '€' },
      'NL': { currency: 'EUR', symbol: '€' },
      'BE': { currency: 'EUR', symbol: '€' },
      'AT': { currency: 'EUR', symbol: '€' },
      'PT': { currency: 'EUR', symbol: '€' },
      'IE': { currency: 'EUR', symbol: '€' },
      'FI': { currency: 'EUR', symbol: '€' },
      'GR': { currency: 'EUR', symbol: '€' },
      'AU': { currency: 'AUD', symbol: 'A$' },
      'NZ': { currency: 'NZD', symbol: 'NZ$' },
      'JP': { currency: 'JPY', symbol: '¥' },
      'CN': { currency: 'CNY', symbol: '¥' },
      'IN': { currency: 'INR', symbol: '₹' },
      'NP': { currency: 'NPR', symbol: '₨' },
      'BD': { currency: 'BDT', symbol: '৳' },
      'PK': { currency: 'PKR', symbol: '₨' },
      'LK': { currency: 'LKR', symbol: '₨' },
      'KR': { currency: 'KRW', symbol: '₩' },
      'SG': { currency: 'SGD', symbol: 'S$' },
      'MY': { currency: 'MYR', symbol: 'RM' },
      'TH': { currency: 'THB', symbol: '฿' },
      'ID': { currency: 'IDR', symbol: 'Rp' },
      'PH': { currency: 'PHP', symbol: '₱' },
      'VN': { currency: 'VND', symbol: '₫' },
      'BR': { currency: 'BRL', symbol: 'R$' },
      'MX': { currency: 'MXN', symbol: '$' },
      'AR': { currency: 'ARS', symbol: '$' },
      'CL': { currency: 'CLP', symbol: '$' },
      'CO': { currency: 'COP', symbol: '$' },
      'PE': { currency: 'PEN', symbol: 'S/' },
      'ZA': { currency: 'ZAR', symbol: 'R' },
      'NG': { currency: 'NGN', symbol: '₦' },
      'EG': { currency: 'EGP', symbol: 'E£' },
      'KE': { currency: 'KES', symbol: 'KSh' },
      'GH': { currency: 'GHS', symbol: 'GH₵' },
      'MA': { currency: 'MAD', symbol: 'MAD' },
      'TN': { currency: 'TND', symbol: 'د.ت' },
      'RU': { currency: 'RUB', symbol: '₽' },
      'UA': { currency: 'UAH', symbol: '₴' },
      'PL': { currency: 'PLN', symbol: 'zł' },
      'CZ': { currency: 'CZK', symbol: 'Kč' },
      'HU': { currency: 'HUF', symbol: 'Ft' },
      'RO': { currency: 'RON', symbol: 'lei' },
      'BG': { currency: 'BGN', symbol: 'лв' },
      'HR': { currency: 'HRK', symbol: 'kn' },
      'RS': { currency: 'RSD', symbol: 'дин' },
      'TR': { currency: 'TRY', symbol: '₺' },
      'IL': { currency: 'ILS', symbol: '₪' },
      'AE': { currency: 'AED', symbol: 'د.إ' },
      'SA': { currency: 'SAR', symbol: '﷼' },
      'QA': { currency: 'QAR', symbol: '﷼' },
      'KW': { currency: 'KWD', symbol: 'د.ك' },
      'BH': { currency: 'BHD', symbol: '.د.ب' },
      'OM': { currency: 'OMR', symbol: '﷼' },
      'JO': { currency: 'JOD', symbol: 'د.ا' },
      'LB': { currency: 'LBP', symbol: 'ل.ل' },
      'IR': { currency: 'IRR', symbol: '﷼' },
      'IQ': { currency: 'IQD', symbol: 'ع.د' }
    };

    // Try multiple geolocation services
    let countryCode = null;
    
    // Try ipapi.co first
    try {
      const ipApiResponse = await fetch(`https://ipapi.co/${ip}/country_code/`, {
        headers: { 'User-Agent': 'curl/7.68.0' }
      });
      if (ipApiResponse.ok) {
        countryCode = await ipApiResponse.text();
        countryCode = countryCode.trim().toUpperCase();
      }
    } catch (error) {
      console.log('ipapi.co failed:', error.message);
    }

    // If first service failed, try ip-api.com
    if (!countryCode) {
      try {
        const ipApiResponse = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`);
        if (ipApiResponse.ok) {
          const data = await ipApiResponse.json();
          countryCode = data.countryCode;
        }
      } catch (error) {
        console.log('ip-api.com failed:', error.message);
      }
    }

    // If still no country, try ipinfo.io
    if (!countryCode) {
      try {
        const ipInfoResponse = await fetch(`https://ipinfo.io/${ip}/country`);
        if (ipInfoResponse.ok) {
          countryCode = await ipInfoResponse.text();
          countryCode = countryCode.trim().toUpperCase();
        }
      } catch (error) {
        console.log('ipinfo.io failed:', error.message);
      }
    }

    // Default to Nepal if detection fails (for testing)
    if (!countryCode || !COUNTRY_CURRENCY_MAP[countryCode]) {
      countryCode = 'NP';
    }

    const currencyInfo = COUNTRY_CURRENCY_MAP[countryCode] || COUNTRY_CURRENCY_MAP['NP'];

    return res.status(200).json({
      country: countryCode,
      currency: currencyInfo.currency,
      symbol: currencyInfo.symbol
    });

  } catch (error) {
    console.error('Error in geolocation API:', error);
    
    // Default to Nepal for any errors
    return res.status(200).json({
      country: 'NP',
      currency: 'NPR',
      symbol: '₨'
    });
  }
}
