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
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/90 hover:bg-white border border-purple-200/50 hover:border-purple-300 transition-all duration-200 shadow-sm hover:shadow-md backdrop-blur-sm"
        aria-label="Select country for currency"
      >
        <Globe size={16} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700 hidden sm:inline">
          {currencyInfo.symbol} {currencyInfo.currency}
        </span>
        <span className="text-xs font-medium text-gray-700 sm:hidden">
          {currencyInfo.symbol}
        </span>
        <ChevronDown 
          size={14} 
          className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-80 overflow-y-auto backdrop-blur-sm">
          {/* Popular Countries */}
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Popular Currencies
            </h3>
            <div className="space-y-1">
              {popularCountries.map((countryCode) => {
                const country = countries[countryCode];
                return (
                  <button
                    key={countryCode}
                    onClick={() => handleCountrySelect(countryCode)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all duration-150 ${
                      selectedCountry === countryCode
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'hover:bg-gray-50 text-gray-700 border border-transparent'
                    }`}
                  >
                    <span className="font-medium">{country.name}</span>
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {country.symbol} {country.currency}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Other Countries */}
          <div className="p-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Other Countries
            </h3>
            <div className="space-y-1">
              {otherCountries.map((countryCode) => {
                const country = countries[countryCode];
                return (
                  <button
                    key={countryCode}
                    onClick={() => handleCountrySelect(countryCode)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all duration-150 ${
                      selectedCountry === countryCode
                        ? 'bg-purple-50 text-purple-700 border border-purple-200'
                        : 'hover:bg-gray-50 text-gray-700 border border-transparent'
                    }`}
                  >
                    <span className="font-medium">{country.name}</span>
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{country.symbol} {country.currency}
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
