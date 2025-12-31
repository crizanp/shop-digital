# Currency System Documentation

## Overview
The currency system provides real-time currency conversion across the entire marketplace. Prices are stored in USD and automatically convert to the user's selected currency (NPR, USD, or GBP).

## Features

### Supported Currencies
- **NPR** (Nepali Rupee) - Default currency
- **USD** (United States Dollar)
- **GBP** (British Pound)

### Real-Time Exchange Rates
- Exchange rates are fetched from `exchangerate-api.com`
- Rates are cached for 1 hour to optimize performance
- Fallback rates are used if the API is unavailable

### Automatic Price Conversion
- All prices in the database are stored in USD
- Prices automatically convert based on selected currency
- Prices are rounded to end in 9 (e.g., Rs.999, £79, $199)

## Components & Files

### 1. CurrencyContext (`contexts/CurrencyContext.js`)
Manages currency state and exchange rates across the app.

**Key Features:**
- Stores selected country/currency in localStorage
- Fetches exchange rates on mount and when currency changes
- Provides currency info (symbol, name, currency code)

**Usage:**
```javascript
import { useCurrency } from '../contexts/CurrencyContext';

const { selectedCountry, setSelectedCountry, currencyInfo, exchangeRates } = useCurrency();
```

### 2. CountrySelector Component (`components/CountrySelector.js`)
Dropdown selector for changing currency.

**Features:**
- Shows current currency with symbol
- Dropdown menu with NPR, USD, GBP options
- Smooth transitions and professional styling
- Mobile responsive

### 3. PriceDisplay Component (`components/PriceDisplay.js`)
Universal component for displaying converted prices.

**Usage:**
```javascript
import PriceDisplay from './PriceDisplay';

<PriceDisplay 
  price="99"  // USD price
  className="text-lg font-bold"
  showOriginal={true}  // Show original USD price
/>
```

**Props:**
- `price`: USD price as string or number
- `className`: CSS classes for styling
- `showOriginal`: Show original USD price alongside converted price
- `prefix`: Add text before price (e.g., "From ")
- `suffix`: Add text after price (e.g., " per month")
- `showPlusSign`: Add "+" for additional costs
- `showMinusSign`: Add "-" for discounts

### 4. Exchange Rates API (`pages/api/currency/exchange-rates.js`)
Backend API endpoint that fetches and caches real-time exchange rates.

**Endpoint:** `GET /api/currency/exchange-rates`

**Response:**
```json
{
  "rates": {
    "USD": 1,
    "GBP": 0.73,
    "NPR": 132.50
  },
  "cached": false,
  "timestamp": 1234567890
}
```

## How It Works

### Initialization
1. App loads with CurrencyProvider wrapping all components
2. CurrencyContext checks localStorage for saved currency preference
3. Defaults to NPR if no saved preference
4. Exchange rates are fetched from API on app mount

### Price Display Flow
1. Component receives USD price
2. Calls `useCurrency()` hook to get current currency & exchange rates
3. Multiplies USD price by exchange rate
4. Rounds result to end in 9
5. Formats with currency symbol
6. Displays converted price

### Currency Change Flow
1. User clicks CountrySelector dropdown
2. Selects new currency
3. `setSelectedCountry()` updates context
4. localStorage is updated with new selection
5. Exchange rates are fetched (if needed)
6. All components using `useCurrency()` re-render with new prices
7. Prices across all pages automatically update

## Price Formatting Examples

**Scenario 1: NPR (Default)**
- Input: $99 USD
- Exchange Rate: 132.50
- Calculation: 99 × 132.50 = 13,117.50
- Output: Rs.13,119

**Scenario 2: GBP**
- Input: $99 USD
- Exchange Rate: 0.73
- Calculation: 99 × 0.73 = 72.27
- Output: £79

**Scenario 3: USD**
- Input: $99 USD
- Exchange Rate: 1
- Calculation: 99 × 1 = 99
- Output: $99

## Integration Guide

### Using in Any Component
```javascript
import { useCurrency } from '../contexts/CurrencyContext';
import PriceDisplay from './PriceDisplay';

export default function MyComponent() {
  const { currencyInfo, exchangeRates } = useCurrency();
  
  return (
    <div>
      <p>Current Currency: {currencyInfo.currency}</p>
      <PriceDisplay price="199" />
    </div>
  );
}
```

### Displaying Multiple Prices
```javascript
<div className="pricing-section">
  <p>Base Price: <PriceDisplay price="99" /></p>
  <p>Premium: <PriceDisplay price="199" prefix="From " /></p>
  <p>Additional: <PriceDisplay price="50" showPlusSign={true} /></p>
</div>
```

### Showing Original Price
```javascript
<PriceDisplay 
  price="399" 
  showOriginal={true}
/>
// Output: £291 ($399)
```

## Pages Using Currency System

✅ **Fully Integrated:**
- Home Page (index.js)
- Category Pages (category/[categorySlug].js)
- Subcategory Pages (subcategory/[subcategorySlug].js)
- Package Detail Pages (package/[slug].js)
- Plugin Pages (plugins/[pluginId].js)
- Main Page (main.js)
- Package Cards (components/PackageCard.js)
- Plugin Cards (components/PluginCard.js)

## Exchange Rate Caching

The system uses a 1-hour cache for exchange rates:
- First request: Fetches from API
- Subsequent requests (within 1 hour): Uses cached rates
- Cache expires: Fresh rates fetched automatically
- API Error: Falls back to last known rates or defaults

## Fallback Rates
If the API is unavailable, the system uses these fallback rates:
- USD: 1.0
- GBP: 0.73
- NPR: 132.50

These are conservative estimates and ensure the app continues to function.

## Locale Formatting
Prices are formatted with proper locale formatting:
- Thousands separators are automatically added
- Example: Rs.13,119 (with comma)
- Example: £2,500 (with comma)
- Example: $1,234,567 (with commas)

## No-Decimal Currencies
The system automatically detects currencies that don't use decimals:
- JPY (Japanese Yen)
- KRW (Korean Won)
- VND (Vietnamese Dong)
- IDR (Indonesian Rupiah)
- CLP (Chilean Peso)

These currencies display without decimal points.

## Future Enhancements
- [ ] Add more currencies if needed
- [ ] Implement real-time rate update notifications
- [ ] Add currency conversion history
- [ ] Support for local currency detection by geolocation
- [ ] Bulk exchange rate updates

## Troubleshooting

### Prices not updating when currency changes?
- Check that components are using `useCurrency()` hook
- Verify PriceDisplay component is being used for pricing
- Check browser console for errors

### Exchange rates not fetching?
- Check network tab in browser DevTools
- Verify `/api/currency/exchange-rates` endpoint is working
- Check that the external API (exchangerate-api.com) is accessible

### Incorrect price conversions?
- Verify that stored prices are in USD
- Check exchange rate values in API response
- Clear localStorage and reload to reset to defaults

## Contact
For currency system issues or enhancements, please contact the development team.
