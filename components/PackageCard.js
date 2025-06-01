import React from 'react';
import Link from 'next/link';
import Image from "next/legacy/image";
import { Clock, Star, Check, ArrowRight, Badge } from 'lucide-react';

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
    price = "$199",
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
    const numericValue = priceString.match(/\d+/);
    if (numericValue) {
      return `$${numericValue[0]}`;
    }
    
    return priceString;
  };

  const formattedPrice = formatPrice(price);

  return (
    <div className="bg-gray-900 text-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-800 flex flex-col h-full group hover:border-purple-600">
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
          <Star size={12} className="mr-1 fill-current" />
          Featured
        </div>
      )}

      {/* Card Image */}
      <div className="relative h-48 w-full overflow-hidden">
        {image ? (
          <div className="h-full w-full relative">
            <Image
              src={image}
              alt={title}
              layout="fill"
              objectFit="cover"
              className="group-hover:scale-105 transition-transform duration-500"
              priority={featured} // Prioritize loading for featured packages
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-purple-900 to-indigo-800 flex items-center justify-center">
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
        <h3 className="text-lg font-bold text-gray-100 mb-1 group-hover:text-purple-300 transition-colors line-clamp-2">
          {title}
        </h3>
        
        {subtitle && (
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">{subtitle}</p>
        )}
       
        {/* {showFeatures && (
          <div className="space-y-2 flex-grow">
            {displayFeatures.map((feature, index) => (
              <div key={index} className="flex items-start">
                <Check size={16} className="text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300 line-clamp-1">{feature}</span>
              </div>
            ))}
            
            {features.length > maxFeatures && (
              <div className="flex items-start">
                <ArrowRight size={16} className="text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-purple-300">
                  +{features.length - maxFeatures} more features
                </span>
              </div>
            )}
          </div>
        )} */}

        
      </div>
     
      {/* Card Footer */}
      <div className="p-5 pt-0 border-t border-gray-800 mt-auto">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xs text-gray-400">Starting at</span>
            <div className="text-2xl font-bold text-purple-400">{formattedPrice}</div>
          </div>
        </div>
       
        <div className="flex space-x-2">
          <Link
            href={getPackageLink()}
            className="flex-1 bg-purple-700 hover:bg-purple-600 text-white text-center py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center font-medium group-hover:shadow-lg transform group-hover:scale-[1.02]"
          >
            <span>View Details</span>
            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

// Usage example component
const PackageGrid = ({ packages = [], categories = [] }) => {
  return (
    <div className="bg-black min-h-screen py-6">
      <div className="container mx-auto">
        <div className="">
          {packages.map((packageData, index) => (
            <PackageCard
              key={packageData._id || index}
              packageData={packageData}
              categoryData={categories}
              showCategory={true}
              showFeatures={true}
              maxFeatures={3}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Demo with your data
const DemoPackageGrid = () => {
  const samplePackages = [
    {
      "_id": "683bfab2e9b3877d765f7166",
      "title": "E-Commerce Website Development",
      "subtitle": "Start Your Own Online Store at the Best Price",
      "price": "$199",
      "image": "https://res.cloudinary.com/dgxcemhar/image/upload/v1748760452/packages/trufgoh6ntpuhyrlls4x.png",
      "categoryId": "683955fad43320c515430458",
      "subcategoryIndex": 1,
      "description": "Get a ready-made, affordable e-commerce website with your branding, easy payments, and full admin access. Perfect for startups—no coding needed!",
      "features": [
        "WordPress Premium Theme + License",
        "Mobile-Responsive Design",
        "Payment Gateway Integration",
        "12 Months FREE Web Hosting",
        "WhatsApp Chat Integration",
        "Basic SEO Optimization"
      ],
      "featured": true,
      "deliveryTime": "5-7 days",
      "rating": 4.8
    }
  ];

  const sampleCategories = [
    {
      "_id": "683955fad43320c515430458",
      "name": "Website Development",
      "slug": "website-development",
      "subcategories": [
        {
          "name": "Wordpress Development",
          "slug": "wordpress-development",
          "_id": "683955fad43320c515430459"
        },
        {
          "name": "Ecommerce Website",
          "slug": "ecommerce-website",
          "_id": "683955fad43320c51543045a"
        }
      ]
    }
  ];

  return <PackageGrid packages={samplePackages} categories={sampleCategories} />;
};

export default DemoPackageGrid;