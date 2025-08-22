// contexts/CurrencyContext.js - Currency context with country selection
import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

// Country to currency mapping
const COUNTRY_CURRENCY_MAP = {
  'US': { currency: 'USD', symbol: '$', name: 'United States' },
  'GB': { currency: 'GBP', symbol: '£', name: 'United Kingdom' },
  'EU': { currency: 'EUR', symbol: '€', name: 'European Union' },
  'IN': { currency: 'INR', symbol: '₹', name: 'India' },
  'NP': { currency: 'NPR', symbol: 'Rs. ', name: 'Nepal' },
  'AU': { currency: 'AUD', symbol: 'A$', name: 'Australia' },
  'CA': { currency: 'CAD', symbol: 'C$', name: 'Canada' },
  'JP': { currency: 'JPY', symbol: '¥', name: 'Japan' },
  'CN': { currency: 'CNY', symbol: '¥', name: 'China' },
  'DE': { currency: 'EUR', symbol: '€', name: 'Germany' },
  'FR': { currency: 'EUR', symbol: '€', name: 'France' },
  'IT': { currency: 'EUR', symbol: '€', name: 'Italy' },
  'ES': { currency: 'EUR', symbol: '€', name: 'Spain' },
  'BR': { currency: 'BRL', symbol: 'R$', name: 'Brazil' },
  'MX': { currency: 'MXN', symbol: '$', name: 'Mexico' },
  'RU': { currency: 'RUB', symbol: '₽', name: 'Russia' },
  'KR': { currency: 'KRW', symbol: '₩', name: 'South Korea' },
  'SG': { currency: 'SGD', symbol: 'S$', name: 'Singapore' },
  'MY': { currency: 'MYR', symbol: 'RM', name: 'Malaysia' },
  'TH': { currency: 'THB', symbol: '฿', name: 'Thailand' },
  'ID': { currency: 'IDR', symbol: 'Rp', name: 'Indonesia' },
  'PH': { currency: 'PHP', symbol: '₱', name: 'Philippines' },
  'VN': { currency: 'VND', symbol: '₫', name: 'Vietnam' },
  'BD': { currency: 'BDT', symbol: '৳', name: 'Bangladesh' },
  'PK': { currency: 'PKR', symbol: 'Rs. ', name: 'Pakistan' },
  'LK': { currency: 'LKR', symbol: 'Rs. ', name: 'Sri Lanka' },
  'AE': { currency: 'AED', symbol: 'د.إ', name: 'UAE' },
  'SA': { currency: 'SAR', symbol: '﷼', name: 'Saudi Arabia' },
  'ZA': { currency: 'ZAR', symbol: 'R', name: 'South Africa' },
  'NG': { currency: 'NGN', symbol: '₦', name: 'Nigeria' },
  'EG': { currency: 'EGP', symbol: '£', name: 'Egypt' },
  'TR': { currency: 'TRY', symbol: '₺', name: 'Turkey' },
  'IL': { currency: 'ILS', symbol: '₪', name: 'Israel' },
  'AR': { currency: 'ARS', symbol: '$', name: 'Argentina' },
  'CL': { currency: 'CLP', symbol: '$', name: 'Chile' },
  'CO': { currency: 'COP', symbol: '$', name: 'Colombia' },
  'PE': { currency: 'PEN', symbol: 'S/', name: 'Peru' },
  'UY': { currency: 'UYU', symbol: '$', name: 'Uruguay' },
  'NZ': { currency: 'NZD', symbol: 'NZ$', name: 'New Zealand' },
  'CH': { currency: 'CHF', symbol: 'Fr', name: 'Switzerland' },
  'NO': { currency: 'NOK', symbol: 'kr', name: 'Norway' },
  'SE': { currency: 'SEK', symbol: 'kr', name: 'Sweden' },
  'DK': { currency: 'DKK', symbol: 'kr', name: 'Denmark' },
  'FI': { currency: 'EUR', symbol: '€', name: 'Finland' },
  'NL': { currency: 'EUR', symbol: '€', name: 'Netherlands' },
  'BE': { currency: 'EUR', symbol: '€', name: 'Belgium' },
  'AT': { currency: 'EUR', symbol: '€', name: 'Austria' },
  'PT': { currency: 'EUR', symbol: '€', name: 'Portugal' },
  'IE': { currency: 'EUR', symbol: '€', name: 'Ireland' },
  'GR': { currency: 'EUR', symbol: '€', name: 'Greece' },
  'CZ': { currency: 'CZK', symbol: 'Kč', name: 'Czech Republic' },
  'PL': { currency: 'PLN', symbol: 'zł', name: 'Poland' },
  'HU': { currency: 'HUF', symbol: 'Ft', name: 'Hungary' },
  'RO': { currency: 'RON', symbol: 'lei', name: 'Romania' },
  'BG': { currency: 'BGN', symbol: 'лв', name: 'Bulgaria' },
  'HR': { currency: 'EUR', symbol: '€', name: 'Croatia' },
  'SI': { currency: 'EUR', symbol: '€', name: 'Slovenia' },
  'SK': { currency: 'EUR', symbol: '€', name: 'Slovakia' },
  'LT': { currency: 'EUR', symbol: '€', name: 'Lithuania' },
  'LV': { currency: 'EUR', symbol: '€', name: 'Latvia' },
  'EE': { currency: 'EUR', symbol: '€', name: 'Estonia' }
};

// Default exchange rates (fallback)
const DEFAULT_RATES = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  INR: 83.12,
  NPR: 132.50,
  AUD: 1.52,
  CAD: 1.36,
  JPY: 149.50,
  CNY: 7.23,
  BRL: 4.87,
  MXN: 17.12,
  RUB: 88.45,
  KRW: 1342.50,
  SGD: 1.35,
  MYR: 4.67,
  THB: 35.80,
  IDR: 15750.00,
  PHP: 56.25,
  VND: 24350.00,
  BDT: 109.75,
  PKR: 287.50,
  LKR: 326.40,
  AED: 3.67,
  SAR: 3.75,
  ZAR: 18.45,
  NGN: 790.00,
  EGP: 30.90,
  TRY: 27.15,
  ILS: 3.64,
  ARS: 350.75,
  CLP: 890.25,
  COP: 4125.50,
  PEN: 3.69,
  UYU: 39.45,
  NZD: 1.64,
  CHF: 0.87,
  NOK: 10.65,
  SEK: 10.89,
  DKK: 6.84,
  CZK: 22.45,
  PLN: 4.02,
  HUF: 354.75,
  RON: 4.58,
  BGN: 1.79
};

export const CurrencyProvider = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState('US'); // Default to US
  const [exchangeRates, setExchangeRates] = useState(DEFAULT_RATES);
  const [loading, setLoading] = useState(false);

  // Load saved country from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCountry = localStorage.getItem('selectedCountry');
      if (savedCountry && COUNTRY_CURRENCY_MAP[savedCountry]) {
        setSelectedCountry(savedCountry);
      }
    }
  }, []);

  // Save country to localStorage when changed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedCountry', selectedCountry);
    }
  }, [selectedCountry]);

  // Fetch exchange rates
  const fetchExchangeRates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/currency/exchange-rates');
      if (response.ok) {
        const data = await response.json();
        setExchangeRates(data.rates || DEFAULT_RATES);
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      // Use default rates on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch rates on mount and when country changes
  useEffect(() => {
    fetchExchangeRates();
  }, [selectedCountry]);

  const currencyInfo = COUNTRY_CURRENCY_MAP[selectedCountry] || COUNTRY_CURRENCY_MAP['US'];

  const value = {
    selectedCountry,
    setSelectedCountry,
    currencyInfo,
    exchangeRates,
    loading,
    countries: COUNTRY_CURRENCY_MAP,
    refreshRates: fetchExchangeRates
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export default CurrencyContext;
