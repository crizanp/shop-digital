// components/CountrySelector.js - Currency selector dropdown (NPR, USD, GBP only)
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, DollarSign } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';

const CountrySelector = ({ className = '' }) => {
  const { selectedCountry, setSelectedCountry, countries, currencyInfo } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCountrySelect = (countryCode) => {
    setSelectedCountry(countryCode);
    setIsOpen(false);
  };

  // Only show NPR, USD, GBP
  const availableCurrencies = ['NP', 'US', 'GB'];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 hover:border-purple-400 transition-all duration-200 shadow-sm hover:shadow-md"
        aria-label="Select currency"
        title={`Current: ${currencyInfo.name} (${currencyInfo.currency})`}
      >
        <DollarSign size={16} className="text-purple-600" />
        <span className="text-sm font-semibold text-purple-700 hidden sm:inline">
          {currencyInfo.currency}
        </span>
        <span className="text-xs font-semibold text-purple-700 sm:hidden">
          {currencyInfo.symbol}
        </span>
        <ChevronDown 
          size={14} 
          className={`text-purple-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
          <div className="p-3 space-y-2">
            {availableCurrencies.map((countryCode) => {
              const country = countries[countryCode];
              return (
                <button
                  key={countryCode}
                  onClick={() => handleCountrySelect(countryCode)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all duration-150 font-medium ${
                    selectedCountry === countryCode
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md'
                      : 'hover:bg-gray-100 text-gray-700 border border-transparent'
                  }`}
                >
                  <span>{country.name}</span>
                  <span className={`text-xs font-mono font-semibold ${selectedCountry === countryCode ? 'text-white' : 'text-purple-600'}`}>
                    {country.symbol} {country.currency}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
