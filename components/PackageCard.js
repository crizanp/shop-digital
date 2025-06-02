import React, { useState, useEffect } from 'react';
import { Clock, Star, Check, ArrowRight, Badge, Loader2 } from 'lucide-react';

const PackageCard = ({ 
  packageData, 
  categoryData = null,
  showCategory = true,
  showFeatures = true,
  maxFeatures = 3 
}) => {
  // Safely extract package data with fallbacks
  const {
    _id,
    title = "Package Title",
    subtitle = "Package description",
    price = "199",
    image,
    features = [],
    description = "",
    featured = false,
    categoryId,
    subcategoryIndex,
    deliveryTime = "3-5 days",
    rating = 4.5
  } = packageData || {};

  // Get category information
  const getCategoryInfo = () => {
    if (!categoryData || !categoryId) return null;
    
    const category = categoryData.find(cat => cat._id === categoryId);
    if (!category) return null;

    const subcategory = category.subcategories?.[subcategoryIndex];
    
    return {
      categoryName: category.name,
      categorySlug: category.slug,
      subcategoryName: subcategory?.name,
      subcategorySlug: subcategory?.slug
    };
  };

  const categoryInfo = getCategoryInfo();

  // Generate features from package data
  const getDisplayFeatures = () => {
    if (features && features.length > 0) {
      return features.slice(0, maxFeatures);
    }
    
    // Fallback features based on package content
    const fallbackFeatures = [
      `Professional ${title.toLowerCase()} design`,
      "Mobile responsive layout",
      "SEO optimized structure"
    ];
    
    // If we have pricing options, add them as features
    if (packageData?.pricing && packageData.pricing.length > 0) {
      fallbackFeatures.push("Customizable options available");
    }
    
    return fallbackFeatures.slice(0, maxFeatures);
  };

  const displayFeatures = getDisplayFeatures();

  // Generate dynamic link
  const getPackageLink = () => {
    if (_id) {
      return `/details/${_id}`;
    }
    // Fallback to title-based URL
    return `/details/${encodeURIComponent(title)}`;
  };

  // Format price display
  const formatPrice = (priceString) => {
    if (!priceString) return "$199";
    
    // If price already includes currency symbol, return as is
    if (priceString.includes('$') || priceString.includes('USD')) {
      return priceString;
    }
    
    // Extract numeric value and add $ symbol
    const numericValue = priceString.toString().match(/\d+/);
    if (numericValue) {
      return `$${numericValue[0]}`;
    }
    
    return `$${priceString}`;
  };

  const formattedPrice = formatPrice(price);

  return (
    <div className="bg-gray-900 text-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-800 flex flex-col h-full group hover:border-green-600">
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-green-600 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
          <Star size={12} className="mr-1 fill-current" />
          Featured
        </div>
      )}

      {/* Card Image */}
      <div className="relative h-48 w-full overflow-hidden">
        {image ? (
          <div className="h-full w-full relative">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading={featured ? "eager" : "lazy"}
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-green-900 to-indigo-800 flex items-center justify-center">
            <span className="text-white text-lg font-medium text-center px-4">{title}</span>
          </div>
        )}
        
        {/* Category badge */}
        {showCategory && categoryInfo && (
          <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-xs">
            {categoryInfo.subcategoryName || categoryInfo.categoryName}
          </div>
        )}
      </div>
     
      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-100 mb-1 group-hover:text-green-300 transition-colors line-clamp-2">
          {title}
        </h3>
        
        {subtitle && (
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">{subtitle}</p>
        )}
       
        {showFeatures && (
          <div className="space-y-2 flex-grow">
            {displayFeatures.map((feature, index) => (
              <div key={index} className="flex items-start">
                <Check size={16} className="text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300 line-clamp-1">{feature}</span>
              </div>
            ))}
            
            {features.length > maxFeatures && (
              <div className="flex items-start">
                <ArrowRight size={16} className="text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-green-300">
                  +{features.length - maxFeatures} more features
                </span>
              </div>
            )}
          </div>
        )}
      </div>
     
      {/* Card Footer */}
      <div className="p-5 pt-0 border-t border-gray-800 mt-auto">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs text-gray-400">Starting at</span>
            <div className="text-2xl font-bold text-green-400">{formattedPrice}</div>
          </div>
        </div>
       
        <div className="flex space-x-2">
          <button
            onClick={() => window.open(getPackageLink(), '_blank')}
            className="flex-1 cursor-pointer bg-green-700 hover:bg-green-600 text-white text-center py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center font-medium group-hover:shadow-lg transform group-hover:scale-[1.02]"
          >
            <span>View Details</span>
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};




export default PackageCard;