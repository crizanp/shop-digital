# Currency System Implementation Guide

## Overview
The currency system automatically converts all prices across the entire application (index, category, subcategory, package details, etc.) based on user selection of **NPR**, **USD**, or **GBP**.

## How It Works

### 1. **Global Setup** (`pages/_app.js`)
```javascript
<LoadingProvider>
  <CurrencyProvider>        // ← Wraps entire app
    <Layout>
      <Component {...pageProps} />
    </Layout>
  </CurrencyProvider>
</LoadingProvider>
```
- **CurrencyProvider** wraps all pages
- Makes currency state available everywhere
- Fetches exchange rates on mount

### 2. **Currency Context** (`contexts/CurrencyContext.js`)
**Default Settings:**
- Default Currency: **NPR** (Nepal Rupee)
- Available Currencies: NPR, USD, GBP only
- Stored in localStorage for persistence

**Exchange Rates:**
- USD = 1.00 (base)
- GBP = 0.73
- NPR = 132.50

**API Endpoint:** `/api/currency/exchange-rates`
- Fetches real-time rates from exchangerate-api.com
- 1-hour cache to reduce API calls
- Falls back to default rates if API fails

### 3. **Currency Selector** (`components/CountrySelector.js`)
Located in navbar, allows users to switch between:
- 🇳🇵 Nepal (NPR - Rs.)
- 🇺🇸 United States (USD - $)
- 🇬🇧 United Kingdom (GBP - £)

**On Selection:**
- Updates CurrencyContext state
- Saves choice to localStorage
- All prices update instantly

### 4. **Price Display Component** (`components/PriceDisplay.js`)
Used throughout the app to display converted prices.

**Features:**
- Automatically converts USD prices to selected currency
- Uses real exchange rates from context
- Rounds prices to end in 9 (e.g., $199, Rs.2999)
- Shows loading skeleton while fetching rates

**Usage:**
```jsx
<PriceDisplay price="199" />           // Shows: Rs.26,269 (NPR)
<PriceDisplay price="99" prefix="From " />    // Shows: From Rs.13,068
<PriceDisplay price="50" showPlusSign />      // Shows: +Rs.6,599
```

### 5. **Total Price Component** (`components/TotalPriceDisplay.js`)
Displays calculated total prices (e.g., package total + add-ons).

**Usage:**
```jsx
<TotalPriceDisplay totalUSD={599} />   // Converts total to selected currency
```

---

## Pages That Use Currency System

### ✅ **Index Page** (`pages/index.js`)
- Uses `PackageCard` component
- Displays featured packages with prices
- Prices update when currency changes

### ✅ **Category Pages** (`pages/category/[categorySlug].js`)
- Displays all packages in category
- Each package card shows converted price
- Filter and sort work with any currency

### ✅ **Subcategory Pages** (`pages/subcategory/[subcategorySlug].js`)
- Lists packages in subcategory
- All prices auto-convert to selected currency

### ✅ **Package Detail Pages** (`pages/package/[slug].js`)
- Shows base price in selected currency
- Pricing tiers (Basic, Standard, Premium) converted
- Add-on prices converted
- Total calculation in selected currency

### ✅ **Plugin Pages** (`pages/plugins/[pluginId].js`)
- Plugin prices displayed in selected currency

---

## How Price Conversion Works

### Flow:
1. **All prices stored in USD** in database
2. **User selects currency** via CountrySelector
3. **PriceDisplay component:**
   - Gets exchange rate from CurrencyContext
   - Multiplies USD price × exchange rate
   - Rounds to nearest .9 ending
   - Formats with currency symbol

### Example:
```
Database: price = "199" (USD)
User selects: NPR (exchange rate: 132.50)

Calculation:
199 × 132.50 = 26,367.50
Rounded to 9: 26,369
Display: Rs.26,369
```

---

## Currency Change Behavior

### When User Changes Currency:

1. **CountrySelector** updates CurrencyContext
2. **Exchange rates** fetched if not cached
3. **All components using useCurrency()** re-render
4. **All PriceDisplay components** recalculate
5. **Prices update instantly across all pages**

### Persistence:
- Selection saved to localStorage
- On page reload, previous currency is restored
- Works across all pages/sessions

---

## Integration Checklist

### ✅ Components Using Currency System:
- [x] Navbar (CountrySelector)
- [x] PackageCard (price display)
- [x] PackageDetailPage (all pricing tiers)
- [x] TotalPriceDisplay (calculated totals)
- [x] PriceDisplay (all price displays)

### ✅ API Endpoints:
- [x] `/api/currency/exchange-rates` - Fetches real rates
- [x] Exchange rate caching (1 hour)

### ✅ Features:
- [x] NPR as default currency
- [x] USD, GBP, NPR options only
- [x] Real-time exchange rate updates
- [x] Price persistence in localStorage
- [x] Instant price updates on all pages
- [x] Proper currency symbols and formatting

---

## Testing Currency System

### 1. **Test on Index Page:**
   - Change currency in navbar
   - All package prices should update instantly

### 2. **Test on Category/Subcategory:**
   - Browse different categories
   - Switch currency
   - Prices update in all categories

### 3. **Test on Package Detail:**
   - View package details
   - Pricing tiers update
   - Add-on prices update
   - Total calculation updates

### 4. **Test Persistence:**
   - Select USD
   - Refresh page
   - Should still be USD
   - Go to different page
   - Should still be USD

### 5. **Test API Fallback:**
   - Check browser console
   - Real rates or fallback rates are used
   - Error handling works

---

## Example: Complete Price Flow

### Scenario: User selects NPR currency and views a $199 package

**Step 1:** User clicks on Currency Selector in Navbar
```
Display: USD → Select NPR
```

**Step 2:** CountrySelector updates Context
```
selectedCountry: 'US' → 'NP'
```

**Step 3:** Exchange rates are fetched/cached
```
API call to: /api/currency/exchange-rates
Returns: { USD: 1, NPR: 132.50, GBP: 0.73 }
```

**Step 4:** All PriceDisplay components recalculate
```
Package price in database: 199
Exchange rate for NPR: 132.50
Calculation: 199 × 132.50 = 26,367.50
Rounded to 9: 26,369
Display: Rs.26,369
```

**Step 5:** User sees updated prices everywhere
- Index page: Package prices in NPR
- Category page: All packages in NPR
- Package details: Tiers and add-ons in NPR
- No page reload needed!

---

## Troubleshooting

### If prices don't update:
1. Check console for errors
2. Verify CurrencyProvider is in _app.js
3. Ensure PriceDisplay/useCurrency is used in component
4. Check localStorage for saved currency

### If exchange rates fail:
1. Check `/api/currency/exchange-rates` endpoint
2. Verify API call isn't blocked
3. Fallback rates will be used automatically

### If currency doesn't persist:
1. Check browser localStorage
2. Ensure `selectedCountry` is being saved
3. Check for localStorage clearing on navigation

---

## Files Modified/Created

- ✅ `contexts/CurrencyContext.js` - Updated with NPR default, 3 currencies only
- ✅ `components/CountrySelector.js` - Updated UI, 3 currency options
- ✅ `components/PriceDisplay.js` - Real-time conversion with effects
- ✅ `components/TotalPriceDisplay.js` - Total price conversion
- ✅ `pages/api/currency/exchange-rates.js` - Real exchange rates API
- ✅ `pages/_app.js` - CurrencyProvider setup
