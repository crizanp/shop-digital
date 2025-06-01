import React from 'react';
import Link from 'next/link';
import Image from "next/legacy/image";
import { Clock, Star, Check, ArrowRight } from 'lucide-react';

const PackageCard = ({ title, subtitle, price, image, features = [], deliveryTime = "3-5 days", rating = 4.5 }) => {
  return (
    <div className="bg-gray-900 text-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-800 flex flex-col h-full group">
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
            />
          </div>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-purple-900 to-indigo-800 flex items-center justify-center">
            <span className="text-white text-lg font-medium">{title}</span>
          </div>
        )}
      </div>
      
      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-100 mb-1 transition-colors">{title}</h3>
        <p className="text-sm text-gray-400 mb-4">{subtitle}</p>
        
        {/* Features list */}
        <div className="space-y-2 flex-grow">
          {features.length > 0 ? (
            features.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-start">
                <Check size={16} className="text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-300">{feature}</span>
              </div>
            ))
          ) : (
            <div className="flex items-start">
              <Check size={16} className="text-purple-400 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-gray-300">Professional {title.toLowerCase()} design</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Card Footer */}
      <div className="p-5 pt-0 border-t border-gray-800 mt-auto">
        <div className="flex items-center justify-between my-3">
          <div>
            <span className="text-2xl font-bold  py-4">{price}</span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Link
            href={`/details/${encodeURIComponent(title)}`}
            className="flex-1 bg-purple-900 hover:bg-purple-800 text-white text-center py-3 px-4 rounded-lg transition-colors flex items-center justify-center font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;