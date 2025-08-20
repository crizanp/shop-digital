import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Download, Star, Shield, ExternalLink } from 'lucide-react';

const PluginCard = ({ pluginData, showCategory = true, lightTheme = true }) => {
  if (!pluginData) return null;

  const {
    _id,
    name,
    slug,
    shortDescription,
    price = 'Free',
    isPremium = false,
    downloads = 0,
    rating = { average: 0, count: 0 },
    images = [],
    author,
    version,
    featured = false
  } = pluginData;

  const primaryImage = images.find(img => img.isPrimary) || images[0];
  const imageUrl = primaryImage?.url || '/api/placeholder/400/200';

  const cardClasses = lightTheme 
    ? 'bg-white hover:bg-gray-50 border border-gray-200 hover:border-purple-300 hover:shadow-lg'
    : 'bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-purple-500';

  const textClasses = lightTheme 
    ? 'text-gray-900'
    : 'text-white';

  const subtextClasses = lightTheme 
    ? 'text-gray-600'
    : 'text-gray-300';

  const priceClasses = isPremium
    ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white'
    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white';

  return (
    <div className={`${cardClasses} rounded-xl overflow-hidden transition-all duration-300 group relative`}>
      <div
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{
          backgroundImage: "url('https://i.pinimg.com/736x/5d/05/dd/5d05ddcd463b166a3e8ac67272343d43.jpg')",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          opacity: 0.16,
          zIndex: 0
        }}
      />

      {/* Plugin Image */}

      {/* Plugin Content */}
      <div className="p-6">
        {/* Plugin Name & Author */}
        <div className="mb-3">{featured && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              Featured
            </span>
          </div>
        )}
          <h3 className={`${textClasses} font-semibold text-lg mb-1 line-clamp-1 group-hover:text-purple-600 transition-colors`}>
            {name}
          </h3>
          <p className={`${subtextClasses} text-sm`}>
            by {author} • v{version}
          </p>
        </div>

        {/* Description */}
        <p className={`${subtextClasses} text-sm mb-4 line-clamp-2`}>
          {shortDescription}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* Downloads */}
            <div className="flex items-center space-x-1">
              <Download size={14} className={subtextClasses} />
              <span className={`${subtextClasses} text-xs`}>
                {downloads >= 1000 ? `${(downloads / 1000).toFixed(1)}k` : downloads}
              </span>
            </div>

            {/* Rating */}
            {rating.count > 0 && (
              <div className="flex items-center space-x-1">
                <Star size={14} className="text-yellow-500 fill-current" />
                <span className={`${subtextClasses} text-xs`}>
                  {rating.average.toFixed(1)} ({rating.count})
                </span>
              </div>
            )}
          </div>

         
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Link
            href={`/plugins/${slug}`}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
          >
            <span>View Details</span>
            <ExternalLink size={14} />
          </Link>

          <div className="text-right">
            <p className={`${textClasses} font-semibold text-sm`}>
              {price}
            </p>
            {isPremium && (
              <p className={`${subtextClasses} text-xs`}>Premium</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PluginCard;
