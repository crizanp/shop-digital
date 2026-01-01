import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import { Star, ChevronRight } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function PluginsPage({ initialPlugins = [], initialCategories = [], initialPagination }) {
  const router = useRouter();
  const { category } = router.query;

  const [plugins, setPlugins] = useState(initialPlugins);
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [selectedTags, setSelectedTags] = useState(['all']);

  const { currencyInfo, exchangeRates } = useCurrency();

  const convertPrice = (priceString) => {
    const numericPrice = parseFloat(priceString.replace(/[^0-9.]/g, ''));
    const convertedPrice = numericPrice * exchangeRates[currencyInfo.currency];
    return `${currencyInfo.symbol}${convertedPrice.toFixed(2)}`;
  };

  // Find WordPress plugins category
  const pluginCategory = initialCategories.find(cat => cat.slug === 'wordpress-plugins');

  useEffect(() => {
    if (sortBy !== 'default') {
      sortPlugins(sortBy);
    }
  }, [sortBy]);

  const sortPlugins = (sortType) => {
    let sorted = [...plugins];
    switch (sortType) {
      case 'price-low':
        sorted.sort((a, b) => parseFloat(a.price?.replace(/[^0-9.]/g, '') || 0) - parseFloat(b.price?.replace(/[^0-9.]/g, '') || 0));
        break;
      case 'price-high':
        sorted.sort((a, b) => parseFloat(b.price?.replace(/[^0-9.]/g, '') || 0) - parseFloat(a.price?.replace(/[^0-9.]/g, '') || 0));
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating?.average || 0) - (a.rating?.average || 0));
        break;
      case 'popular':
        sorted.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
        break;
    }
    setPlugins(sorted);
  };

  const loadPage = async (page) => {
    setLoading(true);
    try {
      const categoryParam = selectedCategory !== 'all' ? `&subcategory=${selectedCategory}` : '';
      const res = await fetch(`/api/plugins?page=${page}&limit=9${categoryParam}`);
      const data = await res.json();
      setPlugins(data.plugins);
      setPagination(data.pagination);
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Failed to load plugins:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tagValue) => {
    if (tagValue === 'all') {
      setSelectedTags(['all']);
    } else {
      const newTags = selectedTags.filter(t => t !== 'all');
      if (newTags.includes(tagValue)) {
        const filtered = newTags.filter(t => t !== tagValue);
        setSelectedTags(filtered.length === 0 ? ['all'] : filtered);
      } else {
        setSelectedTags([...newTags, tagValue]);
      }
    }
  };

  const tags = [
    { name: 'All tags', value: 'all' },
    { name: 'SEO', value: 'seo', count: 43 },
    { name: 'Security', value: 'security', count: 38 },
    { name: 'Performance', value: 'performance', count: 42 },
    { name: 'E-commerce', value: 'ecommerce', count: 35 },
    { name: 'Forms', value: 'forms', count: 28 }
  ];

  return (
    <>
      <Head>
        <title>WordPress Plugins | Foxbeep Marketplace</title>
        <meta name="description" content="Discover powerful WordPress plugins to extend your website functionality" />
      </Head>

      <Navbar activeCategory="wordpress-plugins" />

      <div className="min-h-screen bg-white">
        {/* Category Header */}
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-4xl font-normal text-gray-900 mb-4">
              {selectedCategory !== 'all' && pluginCategory?.subcategories
                ? pluginCategory.subcategories.find(sub => sub.slug === selectedCategory)?.name || 'WordPress Plugins'
                : 'WordPress Plugins'}
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              {/* Categories */}
              <div className="mb-8">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Categories</h3>

                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`flex items-center gap-2 text-sm mb-3 w-full text-left ${selectedCategory === 'all' ? 'text-gray-900 font-medium' : 'text-gray-700 hover:text-gray-900'
                    }`}
                >
                  <ChevronRight size={16} className="rotate-180" />
                  <span>All Plugins</span>
                </button>

                {pluginCategory && (
                  <div className="space-y-0">
                    <div className="text-sm font-medium text-gray-900 py-2">
                      WordPress Plugins
                    </div>

                    {pluginCategory.subcategories?.length > 0 && (
                      <div className="ml-6 space-y-0">
                        {pluginCategory.subcategories.map((sub, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedCategory(sub.slug)}
                            className={`flex items-center gap-2 text-sm py-2 w-full text-left ${selectedCategory === sub.slug
                                ? 'text-gray-900 font-medium'
                                : 'text-gray-600 hover:text-gray-900'
                              }`}
                          >
                            <span>{sub.name}</span>
                            <ChevronRight size={14} />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sort by */}
              <div className="mb-8">
                <h3 className="text-base font-semibold text-gray-900 mb-4">Sort by</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <option value="default">Default</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>

              {/* Related tags */}
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-4">Related tags</h3>
                <div className="space-y-2">
                  {tags.map((tag, idx) => (
                    <label key={idx} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag.value)}
                        onChange={() => toggleTag(tag.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        {tag.name}
                        {tag.count && <span className="text-gray-500"> ({tag.count})</span>}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Plugins Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto"></div>
                </div>
              ) : plugins.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plugins.map((plugin) => (
                      <a
                        key={plugin._id}
                        href={`/plugins/${plugin.slug}`}
                        className="group cursor-pointer"
                      >
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-3">
                      <img
                        src={plugin.image || plugin.icon || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400'}
                        alt={plugin.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Content */}
                    <div>
                      <h3 className="text-base font-normal text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {plugin.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {plugin.author || 'Foxbeep Commercial'}
                      </p>

                      {/* Rating and Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star size={16} className="fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium text-gray-900">
                            {plugin.rating?.average || 5.0}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({plugin.rating?.count || 0})
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {plugin.price ? convertPrice(plugin.price) : 'Free'}
                        </span>
                      </div>
                    </div>
                  </a>
  ))}
                </div>

              {/* Pagination */}
              {pagination?.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                  <button
                    onClick={() => loadPage(currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className={`px-6 py-2 rounded text-sm font-medium ${pagination.hasPrevPage
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => loadPage(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className={`px-6 py-2 rounded text-sm font-medium ${pagination.hasNextPage
                        ? 'bg-gray-900 text-white hover:bg-gray-800'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
            ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No plugins found</h3>
              <p className="text-gray-600">Check back later for new plugins</p>
            </div>
              )}
          </div>
        </div>
      </div>
    </div >
    </>
  );
}

export async function getServerSideProps(context) {
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = context.req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  try {
    const [pluginsRes, categoriesRes] = await Promise.all([
      fetch(`${baseUrl}/api/plugins?page=1&limit=9`),
      fetch(`${baseUrl}/api/categories`)
    ]);

    const pluginsData = await pluginsRes.json();
    const categoriesData = await categoriesRes.json();

    return {
      props: {
        initialPlugins: pluginsData.plugins || [],
        initialCategories: categoriesData.categories || [],
        initialPagination: pluginsData.pagination || {}
      }
    };
  } catch (error) {
    console.error('Error fetching plugins data:', error);
    return {
      props: {
        initialPlugins: [],
        initialCategories: [],
        initialPagination: {}
      }
    };
  }
}