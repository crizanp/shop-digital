// components/TotalPriceDisplay.js - Total price display with currency context
import React from 'react';
import { useCurrency } from '../contexts/CurrencyContext';

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

const TotalPriceDisplay = ({ 
  totalUSD, 
  className = '',
  loading = false 
}) => {
  const { currencyInfo, exchangeRates, loading: currencyLoading } = useCurrency();

  if (loading || currencyLoading) {
    return (
      <div className={className}>
        <span className="inline-block w-16 h-8 bg-gray-200 animate-pulse rounded"></span>
      </div>
    );
  }

  if (!totalUSD || totalUSD === 0) {
    return (
      <div className={className}>
        {currencyInfo.symbol}0
      </div>
    );
  }

  // Convert USD to selected currency
  const exchangeRate = exchangeRates[currencyInfo.currency] || 1;
  const convertedAmount = totalUSD * exchangeRate;
  const roundedAmount = roundPriceTo9(convertedAmount);
  
  // Format price with currency symbol
  const noDecimalCurrencies = ['JPY', 'KRW', 'VND', 'IDR', 'CLP', 'PYG', 'UGX', 'KMF', 'GNF', 'RWF'];
  
  let formattedPrice;
  if (noDecimalCurrencies.includes(currencyInfo.currency)) {
    formattedPrice = `${currencyInfo.symbol}${Math.round(roundedAmount).toLocaleString()}`;
  } else {
    formattedPrice = `${currencyInfo.symbol}${roundedAmount.toLocaleString()}`;
  }

  return (
    <div className={className}>
      {formattedPrice}
    </div>
  );
};

export default TotalPriceDisplay;
