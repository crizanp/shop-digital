import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Search, ChevronRight, AlertCircle, Package, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import SEOHead from '@/components/SEOHead';
import PackageCard from '@/components/PackageCard';
import PluginCard from '@/components/PluginCard';
import { useCurrency } from '../contexts/CurrencyContext';

export default function SearchResults({ initialResults = {} }) {
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = useState(initialResults);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const { currencyInfo, exchangeRates } = useCurrency();

  useEffect(() => {
    if (q) {
      const fetchResults = async () => {
        setLoading(true);
        try {
          const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
          const data = await response.json();
          setResults(data);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchResults();
    }
  }, [q]);

  const convertPrice = (price) => {
    const numericPrice = typeof price === 'string'
      ? parseFloat(price.replace(/[^0-9.]/g, ''))
      : parseFloat(price);
    const convertedPrice = numericPrice * exchangeRates[currencyInfo.currency];
    return `${currencyInfo.symbol}${convertedPrice.toFixed(2)}`;
  };

  const getPackageLink = (pkg) => {
    const category = pkg.category || pkg.categorySlug || '';
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('wordpress') && categoryLower.includes('plugin')) {
      return `/plugins/${pkg.slug}`;
    }
    return `/package/${pkg.slug}`;
  };

  const hasResults = results.totalResults > 0;
  const allResults = results.allResults || [];
  const packageResults = results.packages || [];
  const pluginResults = results.plugins || [];
  const categoryResults = results.categories || [];

  // Generate SEO metadata
  const seoTitle = hasResults
    ? `Search Results for "${q}" | Foxbeep Marketplace`
    : `No Results Found for "${q}" | Foxbeep`;

  const seoDescription = hasResults
    ? `Found ${results.totalResults} results for "${q}". Browse digital services, WordPress plugins, and more on Foxbeep.`
    : `No results found for "${q}". Try different keywords or browse our categories.`;

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={`search, ${q}, digital services, marketplace`}
        canonical={`https://shop.foxbeep.com/search?q=${encodeURIComponent(q)}`}
        noindex={!hasResults}
      />

      <Navbar />

      <div className="min-h-screen bg-gray-50">
        {/* Search Header */}
        <div className="bg-black border-b border-gray-200 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-4">
              <Search size={32} className="text-gray-100" />
              <div>
                <h1 className="text-3xl font-bold text-gray-100">Search Results</h1>
                <p className="text-gray-100">
                  {q && <span>Searching for: <strong>"{q}"</strong></span>}
                </p>
              </div>
            </div>

           
          </div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : hasResults ? (
            <>
              {/* Results Summary */}
              {/* <div className="mb-8">
                <p className="text-gray-600">
                  Found <strong>{results.totalResults}</strong> result{results.totalResults !== 1 ? 's' : ''} for "{q}"
                </p>
              </div> */}

              {/* Tabs */}
              <div className="flex gap-4 mb-8 border-b border-gray-200">
                {[
                  { id: 'all', label: 'All', count: allResults.length },
                  { id: 'packages', label: 'Packages', count: packageResults.length },
                  { id: 'plugins', label: 'Plugins', count: pluginResults.length },
                  { id: 'categories', label: 'Categories', count: categoryResults.length }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 font-medium transition-all relative ${
                      activeTab === tab.id
                        ? 'text-gray-900 border-b-2 border-gray-900'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span className="ml-2 text-sm bg-gray-200 rounded-full px-2">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* All Results */}
              {activeTab === 'all' && (
                <div className="space-y-6">
                  {allResults.slice(0, 20).map((result) => (
                    <div
                      key={`${result.type}-${result._id || result.id}`}
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold bg-gray-900 text-white px-2 py-1 rounded">
                              {result.type === 'package'
                                ? 'PACKAGE'
                                : result.type === 'plugin'
                                ? 'PLUGIN'
                                : 'CATEGORY'}
                            </span>
                            {result.searchScore && (
                              <span className="text-xs text-gray-500">
                                Match: {Math.round(result.searchScore)}%
                              </span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {result.title || result.name}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {result.description}
                          </p>
                          {result.type === 'package' && (
                            <Link
                              href={getPackageLink(result)}
                              className="inline-block text-gray-900 font-semibold hover:underline"
                            >
                              View Package <ChevronRight className="inline" size={16} />
                            </Link>
                          )}
                          {result.type === 'plugin' && (
                            <Link
                              href={`/plugins/${result._id || result.id}`}
                              className="inline-block text-gray-900 font-semibold hover:underline"
                            >
                              View Plugin <ChevronRight className="inline" size={16} />
                            </Link>
                          )}
                          {result.type === 'category' && (
                            <Link
                              href={`/category/${result.slug}`}
                              className="inline-block text-gray-900 font-semibold hover:underline"
                            >
                              Browse Category <ChevronRight className="inline" size={16} />
                            </Link>
                          )}
                        </div>
                        {result.price && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              {convertPrice(result.price)}
                            </div>
                            {result.rating && (
                              <div className="text-sm text-gray-600 mt-2">
                                ⭐ {result.rating}/5 ({result.reviews || 0})
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {allResults.length > 20 && (
                    <div className="text-center py-4">
                      <p className="text-gray-600">
                        Showing 20 of {allResults.length} results. Refine your search for more specific results.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Packages Tab */}
              {activeTab === 'packages' && packageResults.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {packageResults.map((pkg) => (
                    <Link key={pkg._id} href={getPackageLink(pkg)} className="h-full">
                      <PackageCard package={pkg} />
                    </Link>
                  ))}
                </div>
              )}

              {/* Plugins Tab */}
              {activeTab === 'plugins' && pluginResults.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pluginResults.map((plugin) => (
                    <Link key={plugin._id} href={`/plugins/${plugin._id}`} className="h-full">
                      <PluginCard plugin={plugin} />
                    </Link>
                  ))}
                </div>
              )}

              {/* Categories Tab */}
              {activeTab === 'categories' && categoryResults.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categoryResults.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/category/${cat.slug}`}
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.name}</h3>
                      <p className="text-gray-600 mb-4">{cat.description}</p>
                      <span className="text-gray-900 font-semibold flex items-center gap-2">
                        Browse <ChevronRight size={16} />
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Empty Tab State */}
              {(
                (activeTab === 'packages' && packageResults.length === 0) ||
                (activeTab === 'plugins' && pluginResults.length === 0) ||
                (activeTab === 'categories' && categoryResults.length === 0)
              ) && (
                <div className="text-center py-12">
                  <Package size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">
                    No {activeTab === 'packages' ? 'packages' : activeTab === 'plugins' ? 'plugins' : 'categories'} found matching your search.
                  </p>
                </div>
              )}
            </>
          ) : (
            <>
              {/* No Results */}
              <div className="text-center py-16">
                <AlertCircle size={64} className="mx-auto text-gray-400 mb-6" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h2>
                <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                  We couldn't find anything matching "{q}". Try different keywords or browse our categories below.
                </p>

                {/* Suggestions */}
                <div className="mb-12">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">You might like:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {[
                      { name: 'Web Development', slug: 'website-development', icon: '💻' },
                      { name: 'Graphic Design', slug: 'graphic-design', icon: '🎨' },
                      { name: 'WordPress Plugins', slug: 'wordpress-plugins', icon: '🔌' }
                    ].map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="text-4xl mb-3">{cat.icon}</div>
                        <h4 className="font-semibold text-gray-900 mb-2">{cat.name}</h4>
                        <span className="text-sm text-gray-600 flex items-center justify-center gap-2">
                          Explore <ChevronRight size={14} />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
                  <h3 className="font-semibold text-gray-900 mb-3">💡 Search Tips:</h3>
                  <ul className="text-sm text-gray-700 space-y-2 text-left">
                    <li>• Try shorter keywords</li>
                    <li>• Check spelling and try similar words</li>
                    <li>• Try searching for categories instead of specific items</li>
                    <li>• Browse our categories to discover services</li>
                  </ul>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Featured Categories */}
        {!hasResults && (
          <div className="bg-white border-t border-gray-200 py-12">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse Categories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Video Editing', slug: 'video-editing' },
                  { name: 'Web Development', slug: 'website-development' },
                  { name: 'Graphic Design', slug: 'graphic-design' },
                  { name: 'WordPress Plugins', slug: 'wordpress-plugins' },
                  { name: 'Digital Marketing', slug: 'digital-marketing' },
                  { name: 'Writing & Content', slug: 'writing-content' }
                ].map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                    <span className="text-sm text-gray-600 flex items-center gap-2 mt-2">
                      Browse <ChevronRight size={14} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export async function getServerSideProps({ query }) {
  const { q } = query;

  if (!q) {
    return {
      props: {
        initialResults: {
          packages: [],
          plugins: [],
          categories: [],
          allResults: [],
          totalResults: 0,
          query: ''
        }
      }
    };
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/search?q=${encodeURIComponent(q)}`);
    const results = await response.json();

    return {
      props: { initialResults: results }
    };
  } catch (error) {
    console.error('Search error:', error);
    return {
      props: {
        initialResults: {
          packages: [],
          plugins: [],
          categories: [],
          allResults: [],
          totalResults: 0,
          query: q
        }
      }
    };
  }
}
