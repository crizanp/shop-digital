// contexts/CurrencyContext.js - Currency context with country selection
import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

// Only support NPR, USD, GBP
const COUNTRY_CURRENCY_MAP = {
  'NP': { currency: 'NPR', symbol: 'Rs.', name: 'Nepal' },
  'US': { currency: 'USD', symbol: '$', name: 'United States' },
  'GB': { currency: 'GBP', symbol: '£', name: 'United Kingdom' }
};

// Default exchange rates (fallback)
const DEFAULT_RATES = {
  USD: 1,
  GBP: 0.73,
  NPR: 132.50
};

export const CurrencyProvider = ({ children }) => {
  const [selectedCountry, setSelectedCountry] = useState('NP'); // Default to Nepal
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
