import React, { useState, useEffect } from 'react';
import PluginCard from './PluginCard';
import PluginSidebar from './PluginSidebar';
import { Filter, Package, ArrowRight, Search, ChevronRight } from 'lucide-react';
import LoadingButton from './LoadingButton';

const PluginsPage = ({ 
  plugins = [], 
  categories = [], 
  lightTheme = true, 
  initialSelectedCategory = 'all' 
}) => {
  const [filteredPlugins, setFilteredPlugins] = useState(plugins);
  const [displayedPlugins, setDisplayedPlugins] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialSelectedCategory);
  const [premiumFilter, setPremiumFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const pluginsPerPage = 12;

  // Find WordPress plugins category
  const pluginCategory = categories.find(cat => cat.slug === 'wordpress-plugins');

  // Update selected category when initial value changes
  useEffect(() => {
    setSelectedCategory(initialSelectedCategory);
  }, [initialSelectedCategory]);

  // Filter plugins based on search, category, and premium status
  useEffect(() => {
    let filtered = [...plugins];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(plugin =>
        plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plugin.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plugin.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        plugin.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter (subcategory)
    if (selectedCategory !== 'all' && pluginCategory) {
      const subcategoryIndex = pluginCategory.subcategories?.findIndex(
        sub => sub.slug === selectedCategory
      );
      if (subcategoryIndex !== -1) {
        filtered = filtered.filter(plugin => plugin.subcategoryIndex === subcategoryIndex);
      }
    }

    // Premium filter
    if (premiumFilter === 'free') {
      filtered = filtered.filter(plugin => !plugin.isPremium);
    } else if (premiumFilter === 'premium') {
      filtered = filtered.filter(plugin => plugin.isPremium);
    }

    setFilteredPlugins(filtered);
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, premiumFilter, plugins, pluginCategory]);

  // Handle subcategory selection from sidebar
  const handleSubcategoryChange = (subcategorySlug) => {
    setSelectedCategory(subcategorySlug);
  };

  // Sort and paginate plugins
  useEffect(() => {
    let sorted = [...filteredPlugins];

    switch (sortBy) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt || b.lastUpdated) - new Date(a.createdAt || a.lastUpdated));
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.createdAt || a.lastUpdated) - new Date(b.createdAt || b.lastUpdated));
        break;
      case 'downloads':
        sorted.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
        break;
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
        sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      default:
        break;
    }

    // Paginate
    const startIndex = (currentPage - 1) * pluginsPerPage;
    const endIndex = startIndex + pluginsPerPage;
    setDisplayedPlugins(sorted.slice(0, endIndex));
  }, [filteredPlugins, sortBy, currentPage]);

  const totalPages = Math.ceil(filteredPlugins.length / pluginsPerPage);
  const hasMore = currentPage < totalPages;

  const loadMore = () => {
    if (hasMore && !loading) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPremiumFilter('all');
    setSortBy('newest');
  };

  const bgClass = lightTheme ? 'bg-white' : 'bg-gray-900';
  const textClass = lightTheme ? 'text-gray-900' : 'text-white';
  const cardBgClass = lightTheme ? 'bg-gray-50' : 'bg-gray-800';

  return (
    <div className={`min-h-screen ${bgClass} ${textClass}`}>
      {/* Hero Section */}
      <section className="bg-purple-50 py-12 my-4">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {selectedCategory !== 'all' && pluginCategory ? 
              pluginCategory.subcategories?.find(sub => sub.slug === selectedCategory)?.name || 'WordPress Plugins' :
              'WordPress Plugins'
            }
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {selectedCategory !== 'all' && pluginCategory ? 
              `Discover powerful ${pluginCategory.subcategories?.find(sub => sub.slug === selectedCategory)?.name} plugins to enhance your WordPress website.` :
              'Discover powerful WordPress plugins to extend your website functionality, improve performance, and enhance user experience.'
            }
          </p>
        </div>
      </section>

      <div className="container mx-auto sm:pt-16 sm:pb-10 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - takes 1/4 of screen on large screens */}
          <div className="lg:col-span-1">
            <PluginSidebar
              categories={categories}
              activeSubcategory={selectedCategory}
              onSubcategoryChange={handleSubcategoryChange}
              lightTheme={lightTheme}
            />
          </div>

          {/* Main Content - takes 3/4 of screen on large screens */}
          <div className="lg:col-span-3">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-400 mb-2">
              <span>WordPress Plugins</span>
              {selectedCategory !== 'all' && pluginCategory && (
                <>
                  <ChevronRight size={16} className="mx-1 text-gray-500" />
                  <span className="text-purple-500">
                    {pluginCategory.subcategories?.find(sub => sub.slug === selectedCategory)?.name}
                  </span>
                </>
              )}
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
              <div className="mb-4 sm:mb-0">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center text-gray-600 hover:text-purple-500 transition-colors"
                >
                  <Filter size={18} className="mr-2" />
                  <span>Filter</span>
                </button>
              </div>

              <div className="flex space-x-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-100 border border-gray-200 text-gray-700 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-purple-300 focus:border-purple-300"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="downloads">Most Downloads</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="featured">Featured First</option>
                </select>
              </div>
            </div>

            {/* Page Description */}
            <p className="text-gray-700 p-6">
              Discover powerful WordPress plugins to extend your website functionality, 
              improve performance, and enhance user experience.
            </p>

            {/* Search and Filters - Collapsible */}
            {isFilterOpen && (
              <div className={`${cardBgClass} rounded-xl p-6 mb-8 border ${lightTheme ? 'border-gray-200' : 'border-gray-700'}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {/* Search */}
                  <div className="relative">
                    <Search size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${lightTheme ? 'text-gray-400' : 'text-gray-500'}`} />
                    <input
                      type="text"
                      placeholder="Search plugins..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                        lightTheme 
                          ? 'bg-white border-gray-300 text-gray-900 focus:border-purple-500' 
                          : 'bg-gray-700 border-gray-600 text-white focus:border-purple-400'
                      } focus:ring-2 focus:ring-purple-200 focus:outline-none`}
                    />
                  </div>

                  {/* Category Filter */}
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`px-4 py-2 rounded-lg border ${
                      lightTheme 
                        ? 'bg-white border-gray-300 text-gray-900 focus:border-purple-500' 
                        : 'bg-gray-700 border-gray-600 text-white focus:border-purple-400'
                    } focus:ring-2 focus:ring-purple-200 focus:outline-none`}
                  >
                    <option value="all">All Categories</option>
                    {pluginCategory?.subcategories?.map((subcategory, index) => (
                      <option key={index} value={subcategory.slug}>
                        {subcategory.name}
                      </option>
                    ))}
                  </select>

                  {/* Premium Filter */}
                  <select
                    value={premiumFilter}
                    onChange={(e) => setPremiumFilter(e.target.value)}
                    className={`px-4 py-2 rounded-lg border ${
                      lightTheme 
                        ? 'bg-white border-gray-300 text-gray-900 focus:border-purple-500' 
                        : 'bg-gray-700 border-gray-600 text-white focus:border-purple-400'
                    } focus:ring-2 focus:ring-purple-200 focus:outline-none`}
                  >
                    <option value="all">All Plugins</option>
                    <option value="free">Free Only</option>
                    <option value="premium">Premium Only</option>
                  </select>
                </div>

                {/* Filter Summary and Reset */}
                <div className="flex justify-between items-center">
                  <p className={`text-sm ${lightTheme ? 'text-gray-600' : 'text-gray-400'}`}>
                    Showing {displayedPlugins.length} of {filteredPlugins.length} plugins
                  </p>
                  {(searchTerm || selectedCategory !== 'all' || premiumFilter !== 'all') && (
                    <button
                      onClick={resetFilters}
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Plugin Grid */}
            {displayedPlugins.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 mb-8">
                  {displayedPlugins.map((plugin) => (
                    <PluginCard
                      key={plugin._id}
                      pluginData={plugin}
                      lightTheme={lightTheme}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center">
                    <LoadingButton
                      onClick={loadMore}
                      disabled={loading}
                      className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 mx-auto"
                      loadingText="Loading more plugins..."
                    >
                      <span>Load More Plugins</span>
                      <ArrowRight size={16} />
                    </LoadingButton>
                  </div>
                )}

                {/* End Message */}
                {!hasMore && filteredPlugins.length > pluginsPerPage && (
                  <div className={`text-center mt-8 p-4 ${cardBgClass} rounded-lg border ${lightTheme ? 'border-gray-200' : 'border-gray-700'}`}>
                    <p className={lightTheme ? 'text-gray-700' : 'text-gray-300'}>
                      You&apos;ve seen all {filteredPlugins.length} plugins!
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className={`${cardBgClass} p-12 rounded-xl border ${lightTheme ? 'border-gray-200' : 'border-gray-700'} text-center`}>
                <Package size={48} className="text-purple-500 mx-auto mb-4" />
                <h3 className={`text-xl font-semibold ${textClass} mb-2`}>No plugins found</h3>
                <p className={`${lightTheme ? 'text-gray-600' : 'text-gray-400'} mb-4`}>
                  We couldn&apos;t find any plugins matching your criteria.
                </p>
                {(searchTerm || selectedCategory !== 'all' || premiumFilter !== 'all') && (
                  <button
                    onClick={resetFilters}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PluginsPage;
