// lib/currency.js - Currency conversion and formatting utilities
import { useState, useEffect } from 'react';

// Currency symbols
const CURRENCY_SYMBOLS = {
  'USD': '$',
  'INR': '₹',
  'GBP': '£',
  'EUR': '€',
  'CAD': 'C$',
  'AUD': 'A$',
  'JPY': '¥',
  'CNY': '¥',
  'BRL': 'R$',
  'MXN': '$',
  'RUB': '₽',
  'KRW': '₩',
  'SGD': 'S$',
  'HKD': 'HK$',
  'AED': 'د.إ',
  'SAR': '﷼',
  'ZAR': 'R',
  'NGN': '₦',
  'EGP': '£',
  'TRY': '₺',
  'PLN': 'zł',
  'SEK': 'kr',
  'NOK': 'kr',
  'DKK': 'kr',
  'CHF': 'CHF',
  'NZD': 'NZ$',
  'IDR': 'Rp',
  'MYR': 'RM',
  'THB': '฿',
  'PHP': '₱',
  'VND': '₫',
  'BDT': '৳',
  'PKR': '₨',
  'LKR': '₨',
  'ILS': '₪',
  'KES': 'KSh',
  'GHS': '₵',
  'DEFAULT': '$'
};

// Cache for exchange rates (5 minutes cache)
let exchangeRatesCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Round price to end with 9
export const roundPriceTo9 = (price) => {
  if (price <= 0) return 0;
  
  const rounded = Math.round(price);
  if (rounded < 10) return 9;
  
  const lastDigit = rounded % 10;
  if (lastDigit === 9) return rounded;
  
  // Round up to next number ending in 9
  return rounded + (9 - lastDigit);
};

// Get exchange rates from server-side API
export const getExchangeRates = async () => {
  try {
    // Check cache first
    if (exchangeRatesCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
      return exchangeRatesCache;
    }

    // Use server-side API to avoid CORS issues
    const response = await fetch('/api/currency/exchange-rates');
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }
    
    const rates = await response.json();
    
    // Cache the results
    exchangeRatesCache = rates;
    cacheTimestamp = Date.now();
    
    return rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // Return fallback rates if API fails
    return {
      USD: 1,
      NPR: 119.2, // Nepal Rupee
      INR: 74.5,
      GBP: 0.73,
      EUR: 0.85,
      CAD: 1.25,
      AUD: 1.35,
      JPY: 110,
      CNY: 6.45,
      BDT: 85.0,
      PKR: 157.5,
      LKR: 200.0,
      KRW: 1180,
      SGD: 1.35,
      MYR: 4.15,
      THB: 31.5,
      IDR: 14250,
      PHP: 50.5,
      VND: 23000,
      BRL: 5.2,
      MXN: 20.1,
      ZAR: 14.8,
      RUB: 73.5,
      TRY: 8.4
    };
  }
};

// Get user's country from server-side API to avoid CORS issues
export const getUserCountry = async () => {
  try {
    const response = await fetch('/api/currency/geolocation', {
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch currency info');
    }
    
    const data = await response.json();
    return {
      country: data.country,
      currency: data.currency,
      symbol: data.symbol
    };
  } catch (error) {
    console.error('Error getting user country from API:', error);
    // Fallback to Nepal
    return {
      country: 'NP',
      currency: 'NPR',
      symbol: '₨'
    };
  }
};

// Convert USD price to user's currency
export const convertPrice = async (usdPrice, targetCurrency = null, targetRate = null) => {
  try {
    // If specific currency and rate provided, use them
    if (targetCurrency && targetRate) {
      if (targetCurrency === 'USD') {
        return {
          amount: roundPriceTo9(usdPrice),
          currency: 'USD',
          symbol: '$',
          countryCode: 'US',
          originalUSD: usdPrice,
          exchangeRate: 1
        };
      }
      
      const convertedAmount = usdPrice * targetRate;
      const roundedAmount = roundPriceTo9(convertedAmount);
      
      return {
        amount: roundedAmount,
        currency: targetCurrency,
        symbol: CURRENCY_SYMBOLS[targetCurrency] || targetCurrency,
        countryCode: 'Unknown',
        originalUSD: usdPrice,
        exchangeRate: targetRate
      };
    }
    
    // Otherwise get from API
    const currencyInfo = await getUserCountry();
    const { country: countryCode, currency, exchangeRate, symbol } = currencyInfo;
    
    if (currency === 'USD') {
      return {
        amount: roundPriceTo9(usdPrice),
        currency: 'USD',
        symbol: '$',
        countryCode,
        originalUSD: usdPrice,
        exchangeRate: 1
      };
    }
    
    const convertedAmount = usdPrice * exchangeRate;
    const roundedAmount = roundPriceTo9(convertedAmount);
    
    return {
      amount: roundedAmount,
      currency,
      symbol,
      countryCode,
      originalUSD: usdPrice,
      exchangeRate
    };
  } catch (error) {
    console.error('Error converting price:', error);
    // Fallback to USD
    return {
      amount: roundPriceTo9(usdPrice),
      currency: 'USD',
      symbol: '$',
      countryCode: 'US'
    };
  }
};

// Extract numeric value from price string
export const extractPriceValue = (priceString) => {
  if (!priceString) return 0;
  
  // Handle percentage discounts
  if (priceString.includes('-') && priceString.includes('%')) {
    return 0;
  }
  
  // Extract numeric value, handling both "+100 USD" and "399 USD" formats
  const numericMatch = priceString.match(/-?\+?(\d+(?:\.\d+)?)/);
  return numericMatch && numericMatch[1] ? parseFloat(numericMatch[1]) : 0;
};

// Format price with currency symbol
export const formatPrice = (priceData) => {
  if (!priceData || !priceData.amount) return '$0';
  
  const { amount, symbol, currency } = priceData;
  
  // For currencies like JPY, KRW, VND that don't use decimals
  const noDecimalCurrencies = ['JPY', 'KRW', 'VND', 'IDR', 'CLP', 'PYG', 'UGX', 'KMF', 'GNF', 'RWF'];
  
  if (noDecimalCurrencies.includes(currency)) {
    return `${symbol}${Math.round(amount).toLocaleString()}`;
  }
  
  return `${symbol}${amount.toLocaleString()}`;
};

// React hook for currency conversion
export const useCurrency = () => {
  const [currency, setCurrency] = useState('USD');
  const [country, setCountry] = useState('US');
  const [exchangeRate, setExchangeRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectUserLocation = async () => {
      setIsLoading(true);
      try {
        const currencyInfo = await getUserCountry();
        const rates = await getExchangeRates();
        
        setCurrency(currencyInfo.currency);
        setCountry(currencyInfo.country);
        setExchangeRate(rates[currencyInfo.currency] || 1);
      } catch (error) {
        console.error('Error detecting user location:', error);
        setCurrency('NPR'); // Default to Nepal
        setCountry('NP');
        setExchangeRate(119.2);
      } finally {
        setIsLoading(false);
      }
    };

    detectUserLocation();
  }, []);

  const convertAndFormat = async (usdPrice) => {
    try {
      const converted = await convertPrice(usdPrice, currency, exchangeRate);
      return formatPrice(converted);
    } catch (error) {
      console.error('Error converting price:', error);
      return `$${roundPriceTo9(usdPrice)}`;
    }
  };

  return {
    currency,
    country,
    exchangeRate,
    loading: isLoading,
    convertAndFormat,
    convertAndFormat,
    convertPrice: (usdPrice) => convertPrice(usdPrice, currency, exchangeRate)
  };
};

export default {
  roundPriceTo9,
  getExchangeRates,
  getUserCountry,
  convertPrice,
  extractPriceValue,
  formatPrice,
  useCurrency,
  CURRENCY_SYMBOLS
};
