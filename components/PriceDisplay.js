// components/PriceDisplay.js - Simplified price display with currency context
import React from 'react';
import { useCurrency } from '../contexts/CurrencyContext';

// Helper function to extract numeric value from price string
const extractPriceValue = (priceString) => {
  if (!priceString) return 0;
  
  // Handle percentage discounts
  if (priceString.includes('-') && priceString.includes('%')) {
    return 0;
  }
  
  // Extract numeric value, handling both "+100 USD" and "399 USD" formats
  const numericMatch = priceString.match(/-?\+?(\d+(?:\.\d+)?)/);
  return numericMatch && numericMatch[1] ? parseFloat(numericMatch[1]) : 0;
};

// Helper function to round price to end in 9
const roundPriceTo9 = (price) => {
  if (price <= 0) return 0;
  if (price < 10) return Math.max(9, Math.round(price));
  
  const rounded = Math.round(price);
  const lastDigit = rounded % 10;
  
  if (lastDigit === 9) return rounded;
  if (lastDigit < 5) return rounded - lastDigit + 9;
  return rounded + (9 - lastDigit);
};

const PriceDisplay = ({ 
  price, 
  className = '', 
  showOriginal = false,
  prefix = '',
  suffix = '',
  showPlusSign = false,
  showMinusSign = false
}) => {
  const { currencyInfo, exchangeRates, loading } = useCurrency();
  
  if (loading) {
    return (
      <span className={`inline-block animate-pulse bg-gray-200 rounded ${className}`}>
        <span className="opacity-0">$999</span>
      </span>
    );
  }

  const usdValue = extractPriceValue(price);
  
  if (usdValue === 0) {
    return <span className={className}>{prefix}Free{suffix}</span>;
  }

  // Convert USD to selected currency
  const exchangeRate = exchangeRates[currencyInfo.currency] || 1;
  const convertedAmount = usdValue * exchangeRate;
  const roundedAmount = roundPriceTo9(convertedAmount);
  
  // Format price with currency symbol
  let formattedPrice;
  const noDecimalCurrencies = ['JPY', 'KRW', 'VND', 'IDR', 'CLP', 'PYG', 'UGX', 'KMF', 'GNF', 'RWF'];
  
  if (noDecimalCurrencies.includes(currencyInfo.currency)) {
    formattedPrice = `${currencyInfo.symbol}${Math.round(roundedAmount).toLocaleString()}`;
  } else {
    formattedPrice = `${currencyInfo.symbol}${roundedAmount.toLocaleString()}`;
  }

  // Add plus or minus sign if needed
  let displayPrice = formattedPrice;
  if (showPlusSign && roundedAmount > 0) {
    displayPrice = '+' + formattedPrice;
  } else if (showMinusSign && roundedAmount > 0) {
    displayPrice = '-' + formattedPrice;
  }

  return (
    <span className={className}>
      {prefix}{displayPrice}{suffix}
      {showOriginal && currencyInfo.currency !== 'USD' && (
        <span className="text-xs text-gray-500 ml-1">
          (${usdValue})
        </span>
      )}
    </span>
  );
};

export default PriceDisplay;
