import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Menu, X, Search, Package } from 'lucide-react';

const PluginSidebar = ({ 
  categories = [], 
  activeSubcategory, 
  onSubcategoryChange,
  lightTheme = true 
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [isMobile, setIsMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 1024);
      setIsOpen(window.innerWidth >= 1024);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
  }, []);

  // Find WordPress plugins category
  const pluginCategory = categories.find(cat => cat.slug === 'wordpress-plugins');

  useEffect(() => {
    if (pluginCategory) {
      setExpandedCategories({ [pluginCategory.slug]: true });
    }
  }, [pluginCategory]);

  const handleSubcategoryClick = (subcategorySlug) => {
    if (onSubcategoryChange) {
      onSubcategoryChange(subcategorySlug);
    }
  };

  const bgClass = lightTheme ? 'bg-white' : 'bg-gray-800';
  const textClass = lightTheme ? 'text-gray-900' : 'text-white';
  const borderClass = lightTheme ? 'border-gray-100' : 'border-gray-700';

  if (!isOpen) {
    return (
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-500 transition"
          aria-label="Open categories"
        >
          <Menu size={20} />
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(false)}
          className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-500 transition"
          aria-label="Close categories"
        >
          <X size={20} />
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isMobile && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setIsOpen(false)} />
      )}

      <aside
        className={`${bgClass} rounded-2xl shadow-sm border ${borderClass} transition-all duration-200
          ${isMobile ? 'fixed bottom-0 left-0 right-0 max-h-[80vh] overflow-auto z-50' : 'sticky top-20 z-40'}`}
        style={{ padding: 18 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Package size={22} className="text-purple-600" />
            <h3 className={`text-lg font-semibold ${textClass}`}>Plugin Categories</h3>
          </div>
          {isMobile && (
            <button onClick={() => setIsOpen(false)} className="text-gray-500">
              <X size={20} />
            </button>
          )}
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search size={18} />
            </span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search categories"
              className={`w-full pl-10 pr-10 py-2 border ${borderClass} rounded-md ${textClass} placeholder-gray-400 focus:ring-2 focus:ring-purple-200 ${bgClass}`}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-2">
          {/* All Plugins Option */}
          <div
            onClick={() => handleSubcategoryClick('all')}
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
              activeSubcategory === 'all' || !activeSubcategory
                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                : lightTheme 
                  ? 'hover:bg-gray-50 text-gray-700' 
                  : 'hover:bg-gray-700 text-gray-300'
            }`}
          >
            <span className="font-medium">All Plugins</span>
          </div>

          {/* WordPress Plugins Category */}
          {pluginCategory && (
            <div>
              <div
                onClick={() => handleSubcategoryClick('all')}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  activeSubcategory === 'all' || !activeSubcategory
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : lightTheme 
                      ? 'hover:bg-gray-50 text-gray-700' 
                      : 'hover:bg-gray-700 text-gray-300'
                }`}
              >
                <span className="font-medium">{pluginCategory.name}</span>
                <ChevronDown size={16} className="text-gray-400" />
              </div>

              {/* Subcategories */}
              {pluginCategory.subcategories && pluginCategory.subcategories.length > 0 && (
                <div className="ml-4 mt-2 space-y-1">
                  {pluginCategory.subcategories
                    .filter(sub => 
                      !searchTerm || 
                      sub.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((subcategory, index) => (
                      <div
                        key={index}
                        onClick={() => handleSubcategoryClick(subcategory.slug)}
                        className={`p-2 pl-4 rounded-lg cursor-pointer transition-colors ${
                          activeSubcategory === subcategory.slug
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : lightTheme 
                              ? 'hover:bg-gray-50 text-gray-600' 
                              : 'hover:bg-gray-700 text-gray-400'
                        }`}
                      >
                        <span className="text-sm">{subcategory.name}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* No categories message */}
          {!pluginCategory && (
            <div className={`p-4 text-center ${lightTheme ? 'text-gray-500' : 'text-gray-400'}`}>
              <Package size={24} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No plugin categories available</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`mt-6 pt-4 border-t ${borderClass}`}>
          <div className={`text-xs ${lightTheme ? 'text-gray-500' : 'text-gray-400'} text-center`}>
            Browse by category to find the perfect plugin for your WordPress site
          </div>
        </div>
      </aside>
    </>
  );
};

export default PluginSidebar;
