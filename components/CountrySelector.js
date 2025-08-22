// components/CountrySelector.js - Country selector dropdown for currency
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
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

  // Get popular countries for easier access
  const popularCountries = ['US', 'GB', 'EU', 'IN', 'NP', 'AU', 'CA', 'JP', 'CN'];
  const otherCountries = Object.keys(countries).filter(code => !popularCountries.includes(code));

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200"
        aria-label="Select country for currency"
      >
        <Globe size={16} className="text-gray-600 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currencyInfo.symbol} {currencyInfo.currency}
        </span>
        <ChevronDown 
          size={14} 
          className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
          {/* Popular Countries */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Popular
            </h3>
            <div className="space-y-1">
              {popularCountries.map((countryCode) => {
                const country = countries[countryCode];
                return (
                  <button
                    key={countryCode}
                    onClick={() => handleCountrySelect(countryCode)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors duration-150 ${
                      selectedCountry === countryCode
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>{country.name}</span>
                    <span className="font-mono text-xs text-gray-500">
                      {country.symbol} {country.currency}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Other Countries */}
          <div className="p-3">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Other Countries
            </h3>
            <div className="space-y-1">
              {otherCountries.map((countryCode) => {
                const country = countries[countryCode];
                return (
                  <button
                    key={countryCode}
                    onClick={() => handleCountrySelect(countryCode)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors duration-150 ${
                      selectedCountry === countryCode
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>{country.name}</span>
                    <span className="font-mono text-xs text-gray-500">
                      {country.symbol} {country.currency}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
