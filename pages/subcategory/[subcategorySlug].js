import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import { Star, ChevronRight, Menu, X } from 'lucide-react';
import { useCurrency } from '@/contexts/CurrencyContext';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { truncateText } from '@/lib/seo-helpers';

export default function SubcategoryPage({ initialPackages, category, subcategory, categories, initialPagination }) {
  const router = useRouter();
  const { subcategorySlug } = router.query;

  const [packages, setPackages] = useState(initialPackages);
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState(['all']);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currencyInfo, exchangeRates } = useCurrency();
  const convertPrice = (priceString) => {
    const numericPrice = parseFloat(priceString.replace(/[^0-9.]/g, ''));
    const convertedPrice = numericPrice * exchangeRates[currencyInfo.currency];
    return `${currencyInfo.symbol}${convertedPrice.toFixed(2)}`;
  };

  // Update packages when subcategory changes
  useEffect(() => {
    setPackages(initialPackages || []);
    setPagination(initialPagination || {});
    setCurrentPage(1);
    setSortBy('default');
  }, [initialPackages, initialPagination]);
  useEffect(() => {
    if (sortBy !== 'default') {
      sortPackages(sortBy);
    }
  }, [sortBy]);

  const sortPackages = (sortType) => {
    let sorted = [...packages];
    switch (sortType) {
      case 'price-low':
        sorted.sort((a, b) => parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, '')));
        break;
      case 'price-high':
        sorted.sort((a, b) => parseFloat(b.price.replace(/[^0-9.]/g, '')) - parseFloat(a.price.replace(/[^0-9.]/g, '')));
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'popular':
        sorted.sort((a, b) => (b.reviews || 0) - (a.reviews || 0));
        break;
    }
    setPackages(sorted);
  };

  const loadPage = async (page) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/packages?categoryId=${category._id}&subcategoryIndex=${subcategory.index}&page=${page}&limit=9`);
      const data = await res.json();
      setPackages(data.packages);
      setPagination(data.pagination);
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Failed to load packages:', error);
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

  // Mock tags - replace with actual tags from your data
  const tags = [
    { name: 'All tags', value: 'all' },
    { name: 'machinist', value: 'machinist', count: 43 },
    { name: 'machinist handbook', value: 'machinist-handbook', count: 43 },
    { name: 'programming', value: 'programming', count: 42 },
    { name: 'calculator', value: 'calculator', count: 40 },
    { name: 'graphncalc83', value: 'graphncalc83', count: 40 },
    { name: 'ti-84 programming', value: 'ti84-programming', count: 40 }
  ];

  const baseUrl = 'https://shop.foxbeep.com';
  const canonicalUrl = `${baseUrl}/subcategory/${subcategorySlug}`;
  const metaDescription = truncateText(
    subcategory?.description || category?.description || `Browse ${subcategory?.name} packages on Foxbeep Marketplace.`,
    160
  );
  const seoTitle = `${subcategory?.name} - ${category?.name} | Foxbeep Marketplace`;
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: category?.name,
        item: `${baseUrl}/category/${category?.slug}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: subcategory?.name,
        item: canonicalUrl
      }
    ]
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: subcategory?.name,
    description: subcategory?.description,
    url: canonicalUrl,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Foxbeep Marketplace',
      url: baseUrl
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: packages.slice(0, 12).map((pkg, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        item: {
          '@type': 'Product',
          name: pkg.name || pkg.title,
          description: pkg.description || '',
          image: pkg.image || pkg.images?.[0] || '',
          price: pkg.price,
          priceCurrency: 'USD',
          url: `${baseUrl}/package/${pkg.slug}`,
          aggregateRating: pkg.rating ? {
            '@type': 'AggregateRating',
            ratingValue: pkg.rating,
            reviewCount: pkg.reviews || pkg.reviewCount || 0
          } : undefined
        }
      }))
    }
  };

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${subcategory?.name}, ${category?.name}, ${subcategory?.name} packages, ${subcategory?.name} services`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Foxbeep Marketplace" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(collectionSchema)}
        </script>
      </Head>

      <Navbar activeCategory={category?.slug} />

      <div className="min-h-screen bg-white">
        {/* Subcategory Header */}
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Breadcrumb */}
            <div className="overflow-x-auto pb-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-4 whitespace-nowrap">
                <Link href="/" className="hover:text-gray-900">Home</Link>
                <ChevronRight size={16} className="flex-shrink-0" />
                <Link href={`/category/${category?.slug}`} className="hover:text-gray-900">{category?.name}</Link>
                <ChevronRight size={16} className="flex-shrink-0" />
                <span className="text-gray-900">{subcategory?.name}</span>
              </div>
            </div>
            <h1 className="text-3xl font-semibold text-black my-4">{subcategory?.name} Service</h1>
          </div>
        </div>

        {/* Filter Button for Mobile */}
        <div className="lg:hidden border-b border-gray-200 bg-white sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
            >
              <Menu size={20} />
              <span>Filter</span>
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
    className="fixed inset-0 backdrop-blur-sm bg-white/30 z-40 lg:hidden"
    onClick={() => setSidebarOpen(false)}
  />
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex gap-8">
            {/* Sidebar */}
            <aside className={`${sidebarOpen
                ? 'fixed left-0 top-0 h-screen w-72 bg-white shadow-lg z-50 flex flex-col'
                : 'hidden lg:block w-72 flex-shrink-0'
              }`}>
              {/* Close button for mobile */}
              {sidebarOpen && (
                <div className="flex justify-between items-center p-4 lg:hidden border-b border-gray-200 flex-shrink-0">
                  <h3 className="text-base font-semibold text-gray-900">Filters</h3>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X size={24} className="text-gray-900" />
                  </button>
                </div>
              )}

              {/* Sidebar content - scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4">

                <Link
                  href="/"
                  className="flex items-center gap-2 text-sm text-gray-700 mb-3 hover:text-gray-900"
                >
                  <ChevronRight size={16} className="rotate-180" />
                  <span>All</span>
                </Link>

                <div className="space-y-0">
                  <Link
                    href={`/category/${category?.slug}`}
                    className="flex items-center gap-2 text-sm text-gray-700 py-2 hover:text-gray-900"
                  >
                    <ChevronRight size={16} className="rotate-180" />
                    <span>{category?.name}</span>
                  </Link>

                  {category?.subcategories?.length > 0 && (
                    <div className="ml-6 space-y-0">
                      {category.subcategories.map((sub, idx) => (
                        <a
                          key={idx}
                          href={`/subcategory/${sub.slug}`}
                          className={`flex items-center gap-2 text-sm py-2 hover:text-gray-900 ${sub.slug === subcategorySlug
                              ? 'font-medium text-gray-900'
                              : 'text-gray-600'
                            }`}
                        >
                          <span>{sub.name}</span>
                          <ChevronRight size={14} />
                        </a>
                      ))}
                    </div>
                  )}
                </div> {/* Sort by */}
              <div className="my-8">
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
              </div>

             
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {/* Products */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto"></div>
                </div>
              ) : packages.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.map((pkg) => (
                      <a
                        key={pkg._id}
                        href={`/package/${pkg.slug}`}
                        className="group cursor-pointer"
                      >
                        {/* Image */}
                        <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-3">
                          <img
                            src={pkg.image || pkg.images?.[0] || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400'}
                            alt={pkg.name || pkg.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>

                        {/* Content */}
                        <div>
                          <h3 className="text-base font-normal text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {pkg.name || pkg.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {pkg.author || pkg.seller || 'Fobeep Commercial'}
                          </p>

                          {/* Rating and Price */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Star size={16} className="fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium text-gray-900">
                                {pkg.rating || 5.0}
                              </span>
                              <span className="text-sm text-gray-500">
                                ({pkg.reviews || pkg.reviewCount || 0})
                              </span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {convertPrice(pkg.price)}

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
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-600">Check back later for new products in this subcategory</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

// Server-side data fetching
export async function getServerSideProps(context) {
  const { subcategorySlug } = context.params;
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = context.req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  try {
    // Fetch categories
    const categoriesRes = await fetch(`${baseUrl}/api/categories`);
    const categoriesData = await categoriesRes.json();
    const categories = categoriesData.categories || [];

    // Find category and subcategory by slug
    let category = null;
    let subcategory = null;
    let subcategoryIndex = null;

    for (const cat of categories) {
      if (cat.subcategories) {
        const subIdx = cat.subcategories.findIndex(sub => sub.slug === subcategorySlug);
        if (subIdx !== -1) {
          category = cat;
          subcategory = cat.subcategories[subIdx];
          subcategoryIndex = subIdx;
          break;
        }
      }
    }

    if (!category || !subcategory) {
      return { notFound: true };
    }

    // Fetch packages for this subcategory
    const packagesRes = await fetch(
      `${baseUrl}/api/packages?categoryId=${category._id}&subcategoryIndex=${subcategoryIndex}&page=1&limit=9`
    );
    const packagesData = await packagesRes.json();

    return {
      props: {
        initialPackages: packagesData.packages || [],
        category,
        subcategory: {
          ...subcategory,
          index: subcategoryIndex
        },
        categories,
        initialPagination: packagesData.pagination || {}
      }
    };
  } catch (error) {
    console.error('Error fetching subcategory data:', error);
    return { notFound: true };
  }
}