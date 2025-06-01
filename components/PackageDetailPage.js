import React, { useState, useEffect } from 'react';
import Image from "next/legacy/image";
import { ArrowLeft, CheckCircle, HelpCircle, Info, FileText } from 'lucide-react';
import Link from 'next/link';

const PackageDetailPage = ({ packageData }) => {
  const [activeTab, setActiveTab] = useState('description');
  const [selectedOptions, setSelectedOptions] = useState({});
  const [additionalServicesIndices, setAdditionalServicesIndices] = useState([]);
  const [quantity, setQuantity] = useState(1);

  // Initialize selected options when package data changes
  useEffect(() => {
    if (packageData?.pricing) {
      const initialOptions = {};
      const additionalIndices = [];
      
      packageData.pricing.forEach((category, index) => {
        const categoryTitle = category.title.toLowerCase();
        
        // Any category with "additional" in the title will use checkboxes
        if (categoryTitle.includes('additional')) {
          additionalIndices.push(index);
          initialOptions[index] = []; // Initialize as empty array for checkboxes
        } else {
          // Default selection for radio button categories is the first option
          initialOptions[index] = 0; // Initialize with first option selected for radio buttons
        }
      });
      
      setSelectedOptions(initialOptions);
      setAdditionalServicesIndices(additionalIndices);
    }
  }, [packageData]);

  const handleRadioChange = (categoryIndex, optionIndex) => {
    setSelectedOptions(prev => ({
      ...prev,
      [categoryIndex]: optionIndex
    }));
  };

  const toggleAdditionalService = (categoryIndex, optionIndex) => {
    const currentSelections = [...(selectedOptions[categoryIndex] || [])];
    
    const updatedSelections = currentSelections.includes(optionIndex)
      ? currentSelections.filter(index => index !== optionIndex)
      : [...currentSelections, optionIndex];
    
    setSelectedOptions(prev => ({
      ...prev,
      [categoryIndex]: updatedSelections
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

  const calculateTotal = () => {
    if (!packageData?.pricing) return "N/A";

    let total = 0;

    // Process all pricing categories
    packageData.pricing.forEach((category, categoryIndex) => {
      if (additionalServicesIndices.includes(categoryIndex)) {
        // For additional services (checkbox categories)
        const selectedServiceIndices = selectedOptions[categoryIndex] || [];
        selectedServiceIndices.forEach(optionIndex => {
          const option = category.options[optionIndex];
          if (option?.price) {
            total += extractPriceValue(option.price);
          }
        });
      } else {
        // For radio button categories
        const selectedOptionIndex = selectedOptions[categoryIndex] !== undefined ? selectedOptions[categoryIndex] : 0;
        const option = category.options[selectedOptionIndex];
        if (option?.price) {
          total += extractPriceValue(option.price);
        }
      }
    });

    // Multiply by quantity
    total *= quantity;

    // Format the total with currency
    return `${total.toFixed(2)} USD`;
  };
  
  if (!packageData) {
    return (
      <div className="flex justify-center items-center h-96 text-gray-400 bg-gray-900">
        <div className="animate-pulse text-xl">Loading package details...</div>
      </div>
    );
  }
  
  return (
    <div className=' bg-black'>
    <div className="container mx-auto max-w-7xl px-4 pt-12 bg-black text-gray-300">
      {/* Back Button */}
      <Link href="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-4 transition-colors">
        <ArrowLeft className="w-5 h-5 mr-1" />
        <span className="font-medium">Back to Packages</span>
      </Link>
      {/* Header Section - Hero Style */}
      <div className="relative bg-gradient-to-r from-purple-900 to-purple-800 rounded-xl overflow-hidden mb-6 shadow-lg shadow-purple-900/30">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div className="relative h-56 md:h-72">
          <Image
            src={packageData.image || '/placeholder.jpg'}
            alt={packageData.title}
            layout="fill"
            style={{ objectFit: 'cover' }}
            className="brightness-75"
            priority
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{packageData.title}</h1>
            <p className="text-xl md:text-2xl mt-2 text-gray-200 font-light">{packageData.subtitle}</p>
            <div className="flex items-center mt-3">
              <span className="inline-flex bg-purple-900/80 text-white px-4 py-1.5 rounded-full text-lg font-bold">
                {packageData.price}
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
                className={`py-4 px-8 font-medium text-base whitespace-nowrap cursor-pointer transition-colors duration-300 ${activeTab === 'description' ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-900/20' : 'text-gray-400 hover:text-purple-300 hover:bg-gray-800'}`}
              >
                Description
              </button>
              <button 
                onClick={() => setActiveTab('faq')}
                className={`py-4 px-8 font-medium text-base whitespace-nowrap cursor-pointer transition-colors duration-300 ${activeTab === 'faq' ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-900/20' : 'text-gray-400 hover:text-purple-300 hover:bg-gray-800'}`}
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
                <div dangerouslySetInnerHTML={{ __html: packageData.longDescription }} />
              </div>
            )}
            
            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <div className="space-y-5">
                {packageData.faqs?.length > 0 ? (
                  packageData.faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-700 pb-4 last:border-b-0">
                      <div className="flex items-start">
                        <HelpCircle className="w-5 h-5 text-purple-400 mt-1 mr-3 shrink-0" />
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
          <div className="bg-gray-900 rounded-lg p-5 shadow-md border border-gray-800">
            <div className="flex items-center mb-3">
              <h2 className="text-xl font-bold text-gray-200">Key Features</h2>
            </div>
            
            <ul className="space-y-3">
              {packageData.features?.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="bg-purple-900/40 p-1 rounded-full mt-0.5 mr-3 shrink-0">
                    <CheckCircle className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-gray-300 text-base">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Pricing Options Card */}
          <div className="bg-gray-900 rounded-lg p-5 shadow-md border border-gray-800">
            <h2 className="text-xl font-bold text-gray-200 mb-4 flex items-center">
              Customize Your Package
            </h2>
            
            {packageData.pricing?.map((pricingCategory, categoryIndex) => (
              <div key={categoryIndex} className="mb-5 last:mb-3">
                <h3 className="text-lg font-medium text-gray-200 mb-2 border-b border-gray-700 pb-2">{pricingCategory.title}</h3>
                
                <div className="py-2 space-y-1">
                  {pricingCategory.options?.map((option, optionIndex) => {
                    const isAdditionalService = additionalServicesIndices.includes(categoryIndex);
                    const isSelected = isAdditionalService 
                      ? (selectedOptions[categoryIndex] || []).includes(optionIndex)
                      : selectedOptions[categoryIndex] === optionIndex;
                    
                    return (
                      <div 
                        key={optionIndex} 
                        className={`flex items-center p-3 rounded-md transition-colors duration-200 ${
                          isSelected ? 'bg-purple-900/30 border border-purple-800' : 'bg-gray-800 hover:bg-purple-900/10 border border-gray-700'
                        }`}
                      >
                        {isAdditionalService ? (
                          // Checkboxes for Additional Services
                          (<input
                            type="checkbox"
                            id={`option-${categoryIndex}-${optionIndex}`}
                            checked={isSelected}
                            onChange={() => toggleAdditionalService(categoryIndex, optionIndex)}
                            className="h-5 w-5 text-purple-500 bg-gray-700 border-gray-600 cursor-pointer rounded focus:ring-purple-600 focus:ring-offset-gray-900"
                          />)
                        ) : (
                          // Radio buttons for other categories
                          (<input
                            type="radio"
                            id={`option-${categoryIndex}-${optionIndex}`}
                            name={`category-${categoryIndex}`}
                            checked={isSelected}
                            onChange={() => handleRadioChange(categoryIndex, optionIndex)}
                            className="h-5 w-5 text-purple-500 bg-gray-700 border-gray-600 cursor-pointer rounded-full focus:ring-purple-600 focus:ring-offset-gray-900"
                          />)
                        )}
                        <label 
                          htmlFor={`option-${categoryIndex}-${optionIndex}`} 
                          className="ml-3 flex justify-between w-full text-gray-300 cursor-pointer"
                        >
                          <span className="text-base">{option.name}</span>
                          <span className={`font-medium text-base ${
                            option.price.includes('+') 
                              ? 'text-green-400' 
                              : option.price.includes('-') 
                                ? 'text-blue-400' 
                                : 'text-purple-400'
                          }`}>
                            {option.price}
                          </span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            
            {/* Quantity, Total and Get Quotation Elements */}
            <div className="mt-8 py-5 border-t border-b border-gray-700">
              {/* Quantity Field */}
              <div className="flex flex-col items-center justify-center mb-6">
                <label htmlFor="quantity" className="block text-xl font-bold text-gray-200 mb-3">QUANTITY</label>
                <div className="relative w-1/2">
                  <div className="flex">
                    <button
                      onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                      className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold px-4 rounded-l-lg border border-gray-700"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-full px-4 py-2 text-center text-xl font-bold bg-gray-800 text-gray-200 border-2 border-purple-700 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <button
                      onClick={() => setQuantity(prev => prev + 1)}
                      className="bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold px-4 rounded-r-lg border border-gray-700"
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
                  <div className="text-3xl font-bold text-purple-400">{calculateTotal()}</div>
                </div>
              </div>
              
              {/* Get Quotation Button */}
              <div className="flex justify-center">
                <button className="bg-purple-700 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 flex items-center shadow-lg">
                  <FileText className="w-5 h-5 mr-2" />
                  GET QUOTATION
                </button>
              </div>
            </div>
          </div>
          
          {/* Support Info */}
          <div className="bg-gradient-to-r from-gray-900 to-purple-900/30 rounded-lg p-4 shadow-sm border border-gray-800">
            <div className="flex items-start">
              <Info className="w-5 h-5 text-purple-400 mt-1 mr-3 shrink-0" />
              <div>
                <h3 className="font-semibold text-gray-200 text-base">Need Help?</h3>
                <p className="text-gray-400 mt-1">Have questions about this package? Contact our support team for assistance.</p>
                <a href="/contact" className="inline-block mt-2 text-purple-400 font-medium hover:text-purple-300 transition-colors">
                  Contact Support →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div></div>
  );
};

export default PackageDetailPage;