import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { ArrowLeft, CheckCircle, HelpCircle, Info, FileText, Star, Shield, Clock, ChevronDown } from 'lucide-react';
import Link from 'next/link';

const PackageDetailPage = ({
  packageData,
  categoryData = null,
  onQuotationRequest = null,
  loading = false
}) => {
  const [activeTab, setActiveTab] = useState('description');
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [openDropdowns, setOpenDropdowns] = useState({});

  // Initialize selected options when package data changes
  useEffect(() => {
    if (packageData?.pricing) {
      const initialOptions = {};

      packageData.pricing.forEach((category, index) => {
        // Initialize all categories with empty arrays for multi-select
        initialOptions[index] = [];
      });

      setSelectedOptions(initialOptions);
    }
  }, [packageData]);

  // Get category information
  const getCategoryInfo = () => {
    if (!categoryData || !packageData?.categoryId) return null;

    const category = categoryData.find(cat => cat._id === packageData.categoryId);
    if (!category) return null;

    const subcategory = category.subcategories?.[packageData.subcategoryIndex];

    return {
      categoryName: category.name,
      categorySlug: category.slug,
      subcategoryName: subcategory?.name,
      subcategorySlug: subcategory?.slug
    };
  };

  const categoryInfo = getCategoryInfo();

  const handleMultiSelect = (categoryIndex, optionIndex) => {
    const currentSelections = [...(selectedOptions[categoryIndex] || [])];

    const updatedSelections = currentSelections.includes(optionIndex)
      ? currentSelections.filter(index => index !== optionIndex)
      : [...currentSelections, optionIndex];

    setSelectedOptions(prev => ({
      ...prev,
      [categoryIndex]: updatedSelections
    }));
  };

  const toggleDropdown = (categoryIndex) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [categoryIndex]: !prev[categoryIndex]
    }));
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setQuantity(Math.max(1, value)); // Ensure minimum of 1
  };

  // Helper function to extract price value from price string
  const extractPriceValue = (priceString) => {
    if (!priceString) return 0;

    // Handle percentage discounts
    if (priceString.includes('-') && priceString.includes('%')) {
      return 0; // Simplified handling of percentage discounts
    }

    // Extract numeric value, handling both "+100 USD" and "399 USD" formats
    const numericMatch = priceString.match(/-?\+?(\d+(?:\.\d+)?)/);
    return numericMatch && numericMatch[1] ? parseFloat(numericMatch[1]) : 0;
  };

  // Helper function to format price display
  const formatPriceDisplay = (priceString) => {
    if (!priceString) return 'Free';

    const numericValue = extractPriceValue(priceString);

    // If the numeric value is exactly 0, show "Free"
    if (numericValue === 0) {
      return 'Free';
    }

    // For positive values with +, show as additional cost
    if (priceString.includes('+')) {
      return `+$${numericValue}`;
    }

    // For negative values with -, show as discount
    if (priceString.includes('-') && !priceString.includes('%')) {
      return `-$${numericValue}`;
    }

    // For regular prices
    return `$${numericValue}`;
  };

  const calculateTotal = () => {
    if (!packageData?.pricing) {
      // If no pricing options, use base price
      const basePrice = packageData?.price ? extractPriceValue(packageData.price) : 199;
      return `${(basePrice * quantity).toFixed(2)} USD`;
    }

    let total = 0;

    // Process all pricing categories (all are now multi-select)
    packageData.pricing.forEach((category, categoryIndex) => {
      const selectedServiceIndices = selectedOptions[categoryIndex] || [];
      selectedServiceIndices.forEach(optionIndex => {
        const option = category.options[optionIndex];
        if (option?.price) {
          total += extractPriceValue(option.price);
        }
      });
    });

    // Add base price if exists
    if (packageData.price) {
      total += extractPriceValue(packageData.price);
    }

    // Multiply by quantity
    total *= quantity;

    // Format the total with currency
    return `${total.toFixed(2)} USD`;
  };

  const handleQuotationRequest = () => {
    const quotationData = {
      packageId: packageData._id,
      packageTitle: packageData.title,
      selectedOptions,
      quantity,
      totalPrice: calculateTotal(),
      timestamp: new Date().toISOString()
    };

    if (onQuotationRequest) {
      onQuotationRequest(quotationData);
    } else {
      // Default behavior - you can customize this
      console.log('Quotation Request:', quotationData);
      alert('Quotation request submitted! We will contact you soon.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96 text-gray-400 bg-gray-900">
        <div className="animate-pulse text-xl">Loading package details...</div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="flex flex-col justify-center items-center h-96 text-gray-400 bg-gray-900">
        <div className="text-xl mb-4">Package not found</div>
        <Link href="/" className="text-green-400 hover:text-green-300">
          Return to packages
        </Link>
      </div>
    );
  }

  return (
    <div className='bg-black min-h-screen'>
      <div className="container mx-auto max-w-7xl px-4 pt-12 bg-black text-gray-300">
        <Link href="/" className="inline-flex items-center text-green-400 hover:text-green-300 mb-4 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span className="font-medium">Back to Packages</span>
        </Link>

        {/* Header Section - Hero Style */}
        <div className="relative bg-white rounded-xl overflow-hidden mb-6 shadow-lg shadow-green-900/30">
          <div className="absolute inset-0 bg-black/80 z-10 rounded-xl"></div>

          {/* Image container - now dynamic */}
          {/* Image container with fixed height */}
          <div className="relative h-48 md:h-64 lg:h-72">
            <Image
              src={packageData.image || '/api/placeholder/800/400'}
              alt={packageData.title}
              fill
              className="object-cover brightness-75 rounded-xl"
              priority
            />
          </div>


          {/* Header overlay - now absolute positioned over dynamic image */}
          <div className="absolute inset-0 p-6 z-20 text-white flex items-end">
            <div className="max-w-3xl">
              {/* Package badges */}
              <div className="flex items-center gap-2 mb-3">
                {packageData.featugreen && (
                  <span className="inline-flex bg-gradient-to-r from-green-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium items-center">
                    <Star size={14} className="mr-1 fill-current" />
                    Featugreen
                  </span>
                )}
                {categoryInfo && (
                  <span className="inline-flex bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {categoryInfo.subcategoryName || categoryInfo.categoryName}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{packageData.title}</h1>
              {packageData.subtitle && (
                <p className="text-xl md:text-2xl mt-2 text-gray-200 font-light">{packageData.subtitle}</p>
              )}
              <div className="flex items-center mt-3">
                <span className="inline-flex bg-green-900/80 text-white px-4 py-1.5 rounded-full text-lg font-bold">
                  Starting at {packageData.price}
                </span>
              </div>
            </div>
          </div>
        </div>


        {/* Main Content Area - Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Tabs Content */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            {/* Tabs Navigation */}
            <div className="bg-gray-900 rounded-t-lg overflow-hidden shadow-sm border border-gray-800 border-b-0">
              <div className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`py-4 px-8 font-medium text-base whitespace-nowrap cursor-pointer transition-colors duration-300 ${activeTab === 'description' ? 'text-green-400 border-b-2 border-green-400 bg-green-900/20' : 'text-gray-400 hover:text-green-300 hover:bg-gray-800'}`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('faq')}
                  className={`py-4 px-8 font-medium text-base whitespace-nowrap cursor-pointer transition-colors duration-300 ${activeTab === 'faq' ? 'text-green-400 border-b-2 border-green-400 bg-green-900/20' : 'text-gray-400 hover:text-green-300 hover:bg-gray-800'}`}
                >
                  FAQ
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-gray-900 p-6 rounded-b-lg shadow-md mb-6 border border-gray-800 border-t-0">
              {/* Description Tab with Custom Styling */}
              {activeTab === 'description' && (
                <div className="description-content">
                  <style jsx global>{`
                    .description-content h2 {
                      font-size: 1.75rem;
                      font-weight: 700;
                      color: #e2e8f0;
                      margin-top: 1.5rem;
                      margin-bottom: 1rem;
                      line-height: 1.3;
                    }
                    .description-content h3 {
                      font-size: 1.35rem;
                      font-weight: 600;
                      color: #cbd5e0;
                      margin-bottom: 0.75rem;
                      margin-top: 1.25rem;
                      line-height: 1.3;
                    }
                    .description-content p {
                      margin-bottom: 1.25rem;
                      color: #a0aec0;
                      line-height: 1.6;
                      font-size: 1.05rem;
                    }
                    .description-content ul {
                      list-style-type: disc;
                      padding-left: 1.75rem;
                      margin-bottom: 1.25rem;
                    }
                    .description-content li {
                      color: #a0aec0;
                      margin-bottom: 0.5rem;
                      line-height: 1.6;
                      font-size: 1.05rem;
                    }
                    .description-content strong {
                      color: #c4b5fd;
                      font-weight: 600;
                    }
                    .description-content a {
                      color: #a78bfa;
                      text-decoration: underline;
                      transition: color 0.2s;
                    }
                    .description-content a:hover {
                      color: #c4b5fd;
                    }
                    .description-content blockquote {
                      border-left: 4px solid #9f7aea;
                      padding-left: 1rem;
                      margin-left: 0;
                      margin-right: 0;
                      font-style: italic;
                      color: #a0aec0;
                    }
                    .description-content *:first-child {
                      margin-top: 0;
                    }
                  `}</style>
                  <div dangerouslySetInnerHTML={{
                    __html: packageData.longDescription || packageData.description || '<p>No detailed description available.</p>'
                  }} />
                </div>
              )}

              {/* FAQ Tab */}
              {activeTab === 'faq' && (
                <div className="space-y-5">
                  {packageData.faqs?.length > 0 ? (
                    packageData.faqs.map((faq, index) => (
                      <div key={faq._id || index} className="border-b border-gray-700 pb-4 last:border-b-0">
                        <div className="flex items-start">
                          <HelpCircle className="w-5 h-5 text-green-400 mt-1 mr-3 shrink-0" />
                          <h3 className="text-lg font-semibold text-gray-200">{faq.question}</h3>
                        </div>
                        <p className="mt-2 text-gray-400 ml-8 text-base leading-relaxed">{faq.answer}</p>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <HelpCircle className="w-10 h-10 text-gray-600 mb-2" />
                      <p className="text-gray-400 text-lg">No FAQs available for this package.</p>
                      <p className="text-gray-500 text-base mt-1">Check back later or contact support for more information.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Features and Pricing Options */}
          <div className="space-y-6 order-1 lg:order-2">
            {/* Features Card */}
            {(packageData.features?.length > 0 || packageData.description) && (
              <div className="bg-gray-900 rounded-lg p-5 shadow-md border border-gray-800">
                <div className="flex items-center mb-3">
                  <h2 className="text-xl font-bold text-gray-200">Key Features</h2>
                </div>

                <ul className="space-y-3">
                  {packageData.features?.length > 0 ? (
                    packageData.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-green-900/40 p-1 rounded-full mt-0.5 mr-3 shrink-0">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                        <span className="text-gray-300 text-base">{feature}</span>
                      </li>
                    ))
                  ) : (
                    // Generate features from description or use defaults
                    [
                      "Professional design and development",
                      "Mobile responsive layout",
                      "SEO optimized structure",
                      "Fast loading performance"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-green-900/40 p-1 rounded-full mt-0.5 mr-3 shrink-0">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        </div>
                        <span className="text-gray-300 text-base">{feature}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            )}

            {/* Pricing Options Card */}
            <div className="bg-gray-900 rounded-lg p-5 shadow-md border border-gray-800">
              <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center">
                Customize Your Package
              </h2>

              {packageData.pricing?.length > 0 ? (
                packageData.pricing.map((pricingCategory, categoryIndex) => (
                  <div key={pricingCategory._id || categoryIndex} className="mb-5 last:mb-3">
                    <h3 className="text-lg font-medium text-gray-200 mb-2 border-b border-gray-700 pb-2">{pricingCategory.title}</h3>

                    <div className="py-2">
                      {/* Multi-select for all categories */}
                      <div className="space-y-3">
                        <div className="space-y-2">

                          {pricingCategory.options?.map((option, optionIndex) => {
                            const isSelected = (selectedOptions[categoryIndex] || []).includes(optionIndex);
                            return (
                              <div
                                key={option._id || optionIndex}
                                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${isSelected
                                  ? 'bg-green-900/30 border-green-500'
                                  : 'bg-gray-800 border-gray-700 hover:bg-green-900/10 hover:border-green-600'
                                  }`}
                                onClick={() => handleMultiSelect(categoryIndex, optionIndex)}
                              >
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => { }} // Handled by onClick above
                                    className="h-4 w-4 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-600 mr-3"
                                  />
                                  <span className="text-gray-300 font-medium">{option.name}</span>
                                </div>
                                <span className={`font-bold ${option.price && extractPriceValue(option.price) === 0
                                  ? 'text-green-400'
                                  : option.price && option.price.includes('+')
                                    ? 'text-green-400'
                                    : option.price && option.price.includes('-')
                                      ? 'text-blue-400'
                                      : 'text-green-400'
                                  }`}>
                                  {formatPriceDisplay(option.price)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-400">
                  <p>Standard package pricing applies</p>
                  <p className="text-2xl font-bold text-green-400 mt-2">{packageData.price}</p>
                </div>
              )}

              {/* Quantity, Total and Get Quotation Elements */}
              <div className="mt-8 py-5 border-t border-b border-gray-700">
                {/* Quantity Field */}
                <div className="flex flex-col items-center justify-center mb-6">
                  <label htmlFor="quantity" className="block text-xl font-bold text-gray-200 mb-3">QUANTITY</label>
                  <div className="relative w-1/2">
                    <div className="flex">
                      <button
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold px-4 rounded-l-lg border border-gray-700 transition-colors"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        id="quantity"
                        min="1"
                        value={quantity}
                        onChange={handleQuantityChange}
                        className="w-full px-4 py-2 text-center text-xl font-bold bg-gray-800 text-gray-200 border-2 border-green-700 focus:ring-green-500 focus:border-green-500"
                      />
                      <button
                        onClick={() => setQuantity(prev => prev + 1)}
                        className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold px-4 rounded-r-lg border border-gray-700 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Total Price */}
                <div className="flex justify-center items-center mb-6">
                  <div className="text-center">
                    <div className="text-gray-400 font-medium text-lg mb-1">TOTAL PRICE</div>
                    <div className="text-3xl font-bold text-green-400">{calculateTotal()}</div>
                  </div>
                </div>

                {/* Get Quotation Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleQuotationRequest}
                    className="bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 flex items-center shadow-lg"
                  >
                    <FileText className="w-5 h-5 mr-2" />
                    GET QUOTATION
                  </button>
                </div>
              </div>
            </div>

            {/* Support Info */}
            <div className="bg-gradient-to-r from-gray-900 to-green-900/30 rounded-lg p-4 shadow-sm border border-gray-800">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-green-400 mt-1 mr-3 shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-200 text-base">Need Help?</h3>
                  <p className="text-gray-400 mt-1">Have questions about this package? Contact our support team for assistance.</p>
                  <a href="/contact" className="inline-block mt-2 text-green-400 font-medium hover:text-green-300 transition-colors">
                    Contact Support →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailPage;