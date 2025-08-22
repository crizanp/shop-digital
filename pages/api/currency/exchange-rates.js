// API endpoint to get exchange rates
let cachedRates = null;
let lastFetch = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const now = Date.now();
    
    // Return cached rates if available and not expired
    if (cachedRates && (now - lastFetch) < CACHE_DURATION) {
      return res.status(200).json(cachedRates);
    }

    // Try to fetch fresh rates
    let rates = null;
    
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (response.ok) {
        const data = await response.json();
        rates = data.rates;
      }
    } catch (error) {
      console.log('Exchange rate API failed:', error.message);
    }

    // Fallback rates if API fails
    if (!rates) {
      rates = {
        USD: 1,
        EUR: 0.85,
        GBP: 0.73,
        CAD: 1.25,
        AUD: 1.35,
        JPY: 110,
        CNY: 6.45,
        INR: 74.5,
        NPR: 119.2, // Nepal Rupee
        BDT: 85.0,  // Bangladesh Taka
        PKR: 157.5, // Pakistan Rupee
        LKR: 200.0, // Sri Lanka Rupee
        KRW: 1180,
        SGD: 1.35,
        MYR: 4.15,
        THB: 31.5,
        IDR: 14250,
        PHP: 50.5,
        VND: 23000,
        BRL: 5.2,
        MXN: 20.1,
        ARS: 98.5,
        CLP: 800,
        COP: 3800,
        PEN: 3.6,
        ZAR: 14.8,
        NGN: 411,
        EGP: 15.7,
        KES: 108,
        GHS: 5.8,
        MAD: 9.0,
        TND: 2.8,
        RUB: 73.5,
        UAH: 27.3,
        PLN: 3.9,
        CZK: 21.5,
        HUF: 295,
        RON: 4.2,
        BGN: 1.66,
        HRK: 6.4,
        RSD: 100,
        TRY: 8.4,
        ILS: 3.25,
        AED: 3.67,
        SAR: 3.75,
        QAR: 3.64,
        KWD: 0.30,
        BHD: 0.38,
        OMR: 0.38,
        JOD: 0.71,
        LBP: 1507,
        IRR: 42000,
        IQD: 1460,
        NZD: 1.42
      };
    }

    // Cache the rates
    cachedRates = rates;
    lastFetch = now;

    return res.status(200).json(rates);

  } catch (error) {
    console.error('Error in exchange rates API:', error);
    
    // Return basic fallback rates
    return res.status(200).json({
      USD: 1,
      NPR: 119.2,
      INR: 74.5,
      EUR: 0.85,
      GBP: 0.73
    });
  }
}
