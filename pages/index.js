// pages/pricing.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import PackageCard from '../components/PackageCard';
import PluginCard from '../components/PluginCard';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Filter, SortAsc, SortDesc, Package, ChevronRight, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function PricingPage({ initialCategories = [], initialPackages = [], initialPagination = {}, initialPlugins = [] }) {
  const router = useRouter();
  const { categorySlug, subcategorySlug } = router.query;

  // State management
  const [categories, setCategories] = useState(initialCategories);
  const [packages, setPackages] = useState(initialPackages);
  const [plugins, setPlugins] = useState(initialPlugins);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [displayedPackages, setDisplayedPackages] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [packagesPerPage] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);

  // categories are provided by server-side props; keep fetchCategories for future use
  const fetchCategories = async () => {};

  // Fetch packages from API with pagination
  const fetchPackages = async (page = 1, categoryId = null, subcategoryIndex = null, reset = false) => {
    try {
      if (reset) {
        setLoadingMore(true);
      }
      
      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: packagesPerPage.toString()
      });
      
      if (categoryId) {
        params.append('categoryId', categoryId);
      }
      
      if (subcategoryIndex !== null && subcategoryIndex !== undefined) {
        params.append('subcategoryIndex', subcategoryIndex.toString());
      }
      
      const response = await fetch(`/api/packages?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch packages');
      }
      const data = await response.json();
      
      if (reset || page === 1) {
        setPackages(data.packages || []);
      } else {
        setPackages(prev => [...prev, ...(data.packages || [])]);
      }
      
      // Update pagination state
      setCurrentPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
      setTotalItems(data.pagination.totalItems);
      setHasNextPage(data.pagination.hasNextPage);
      setHasPrevPage(data.pagination.hasPrevPage);
      
    } catch (err) {
      setError('Failed to load packages');
      console.error('Error fetching packages:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Initialize pagination state from server props
  useEffect(() => {
    if (initialPagination) {
      setCurrentPage(initialPagination.currentPage || 1);
      setTotalPages(initialPagination.totalPages || 1);
      setTotalItems(initialPagination.totalItems || 0);
      setHasNextPage(initialPagination.hasNextPage || false);
      setHasPrevPage(initialPagination.hasPrevPage || false);
    }
    setLoading(false);
  }, []);

  // Helper function to find category by slug
  const findCategoryBySlug = (slug) => {
    return categories.find(cat => cat.slug === slug);
  };

  // Helper function to find subcategory by slug within a category
  const findSubcategoryBySlug = (categorySlug, subcategorySlug) => {
    const category = findCategoryBySlug(categorySlug);
    if (!category || !category.subcategories) return null;
    return category.subcategories.find(sub => sub.slug === subcategorySlug);
  };

  // Filter packages based on URL parameters
  useEffect(() => {
    if (!router.isReady) return;

    const loadFilteredData = async () => {
      setLoading(true);
      
      if (subcategorySlug) {
        // Filter by subcategory slug
        setActiveSubcategory(subcategorySlug);

        // Find the parent category slug first
        let parentCategorySlug = categorySlug;
        if (!parentCategorySlug) {
          // Try to find parent category from subcategory
          for (const category of categories) {
            if (category.subcategories && category.subcategories.some(sub => sub.slug === subcategorySlug)) {
              parentCategorySlug = category.slug;
              break;
            }
          }
        }

        if (parentCategorySlug) {
          setActiveCategory(parentCategorySlug);
          const category = findCategoryBySlug(parentCategorySlug);
          const subcategory = category?.subcategories?.find(sub => sub.slug === subcategorySlug);

          if (subcategory) {
            // Check if this is WordPress plugins category - redirect instead of filtering
            if (category.slug === 'wordpress-plugins') {
              router.push(`/plugins?category=${subcategorySlug}`);
              return;
            }
            
            // Find the subcategory index to match with package data
            const subcategoryIndex = category.subcategories.findIndex(sub => sub.slug === subcategorySlug);
            
            // Fetch packages with category and subcategory filters
            await fetchPackages(1, category._id, subcategoryIndex, true);
          }
        }
      } else if (categorySlug) {
        // Filter by category slug
        setActiveCategory(categorySlug);
        setActiveSubcategory(null);

        const category = findCategoryBySlug(categorySlug);

        if (category) {
          // Check if this is WordPress plugins category - redirect instead of filtering
          if (category.slug === 'wordpress-plugins') {
            router.push('/plugins');
            return;
          }
          // Fetch packages with category filter
          await fetchPackages(1, category._id, null, true);
        }
      } else {
        // No filter, show all packages
        setActiveCategory(null);
        setActiveSubcategory(null);
        await fetchPackages(1, null, null, true);
      }
      
      setLoading(false);
    };

    if (categories.length > 0) {
      loadFilteredData();
    }
  }, [router.isReady, categorySlug, subcategorySlug, categories]);

  // Apply sorting whenever packages or sortBy changes
  useEffect(() => {
    let sorted = [...packages];

    switch (sortBy) {
      case 'price-low-high':
        sorted = sorted.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
          const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;
          return priceA - priceB;
        });
        break;
      case 'price-high-low':
        sorted = sorted.sort((a, b) => {
          const priceA = parseFloat(a.price.replace(/[^0-9.]/g, '')) || 0;
          const priceB = parseFloat(b.price.replace(/[^0-9.]/g, '')) || 0;
          return priceB - priceA;
        });
        break;
      case 'latest':
        sorted = sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        sorted = sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'featured':
        sorted = sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      default:
        sorted = sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setDisplayedPackages(sorted);
  }, [packages, sortBy]);

  // Find active category/subcategory names
  const getActiveCategoryName = () => {
    if (activeCategory) {
      const category = findCategoryBySlug(activeCategory);
      return category ? category.name : 'All Categories';
    }
    return 'All Categories';
  };

  const getActiveSubcategoryName = () => {
    if (activeSubcategory && activeCategory) {
      const category = findCategoryBySlug(activeCategory);
      if (category && category.subcategories) {
        const subcategory = category.subcategories.find(sub => sub.slug === activeSubcategory);
        return subcategory ? subcategory.name : '';
      }
    }
    return '';
  };

  const getHeaderTitle = () => {
    if (activeSubcategory) {
      return getActiveSubcategoryName();
    } else if (activeCategory) {
      return getActiveCategoryName();
    }
    return 'All Design Packages';
  };

  const getHeaderDescription = () => {
    const categoryName = getActiveCategoryName();
    const subcategoryName = getActiveSubcategoryName();

    if (activeSubcategory) {
      return `Choose a ${categoryName} - ${subcategoryName} package and place the order online. Your ${categoryName} will be ready within the time frame you choose!`;
    } else if (activeCategory) {
      return `Choose a ${categoryName} package and place the order online. Your ${categoryName} will be ready within the time frame you choose!`;
    } else {
      return 'Choose a design package and place the order online. Your design will be ready within the time frame you choose! We will email you the final design.';
    }
  };

  // Load more packages function
  const loadMorePackages = async () => {
    if (!hasNextPage || loadingMore) return;
    
    const nextPage = currentPage + 1;
    let categoryId = null;
    let subcategoryIndex = null;
    
    // Get current filter parameters
    if (activeCategory) {
      const category = findCategoryBySlug(activeCategory);
      if (category) {
        categoryId = category._id;
        
        if (activeSubcategory) {
          const subcategory = category.subcategories?.find(sub => sub.slug === activeSubcategory);
          if (subcategory) {
            subcategoryIndex = category.subcategories.findIndex(sub => sub.slug === activeSubcategory);
          }
        }
      }
    }
    
    await fetchPackages(nextPage, categoryId, subcategoryIndex, false);
  };

  const renderPaginationStats = () => {
    const startItem = (currentPage - 1) * packagesPerPage + 1;
    const endItem = Math.min(currentPage * packagesPerPage, totalItems);
    
    return (
      <div className="text-sm text-gray-400 mb-4">
        Showing {startItem}-{endItem} of {totalItems} packages
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading... | Professional Design Solutions</title>
        </Head>
        <Navbar />
        <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-xl text-gray-900">Loading packages...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Error | Professional Design Solutions</title>
        </Head>
        <Navbar />
        <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Package size={64} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Error Loading Data</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Design Packages & Pricing | Professional Design Solutions</title>
        <meta name="description" content="Browse our professional design packages tailored to your specific needs with competitive pricing and fast turnaround times." />
      </Head>
      <Navbar />

      <div className="min-h-screen bg-white text-gray-900">
        <div className="container mx-auto sm:pt-16 sm:pb-10 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - takes 1/4 of screen on large screens */}
            <div className="lg:col-span-1">
              <Sidebar
                categories={categories}
                activeCategory={activeCategory}
                activeSubcategory={activeSubcategory}
              />
            </div>

            <div className="lg:col-span-3">
              <div className="">
                <div className="flex items-center text-sm text-gray-400 mb-2">

                  {activeCategory && (
                    <>
                      {/* <ChevronRight size={16} className="mx-1 text-gray-500" /> */}
                      <Link
                        href={`/category/${activeCategory}`}
                        className="hover:text-purple-500 transition-colors"
                      >
                        {getActiveCategoryName()}
                      </Link>
                    </>
                  )}
                  {activeSubcategory && (
                    <>
                      <ChevronRight size={16} className="mx-1 text-gray-500" />
                      <span className="text-purple-500">{getActiveSubcategoryName()}</span>
                    </>
                  )}
                </div>
              </div>

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
                    <option value="default">Default Sorting</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                    <option value="featured">Featured First</option>
                  </select>
                </div>
              </div>
                <p className="text-gray-700 p-6">{getHeaderDescription()}</p>

              {/* Pagination stats hidden on main page */}

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-gray-700">Loading packages...</p>
                </div>
              ) : displayedPackages.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {displayedPackages.map((pkg) => (
                      <PackageCard
                        key={pkg._id}
                        packageData={pkg}
                        categoryData={categories}
                        showCategory={true}
                        showFeatures={true}
                        maxFeatures={3}
                      />
                    ))}
                  </div>

                  {/* Load More Button */}
                  {hasNextPage && (
                    <div className="flex justify-center mt-8">
                      <button
                        onClick={loadMorePackages}
                        disabled={loadingMore}
                        className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-200 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center space-x-2"
                      >
                        {loadingMore ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Loading...</span>
                          </>
                        ) : (
                          <>
                            <span>Load More</span>
                            <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Pagination Info */}
                  {!hasNextPage && totalItems > packagesPerPage && (
                    <div className="text-center mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-700">
                        You&apos;ve reached the end! Showing all {totalItems} packages.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 shadow text-center">
                  <Package size={48} className="text-purple-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No packages found</h3>
                  <p className="text-gray-700">We couldn&apos;t find any packages matching your criteria.</p>
                </div>
              )}

              {/* WordPress Plugins Section */}
              {plugins && plugins.length > 0 && (
                <div className="mt-16">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">WordPress Plugins</h2>
                      <p className="text-gray-600">Extend your WordPress site with powerful plugins</p>
                    </div>
                    <Link 
                      href="/plugins"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors font-medium flex items-center space-x-2"
                    >
                      <span>View All Plugins</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {plugins.slice(0, 3).map((plugin) => (
                      <PluginCard
                        key={plugin._id}
                        pluginData={plugin}
                        lightTheme={true}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Server-side rendering to fetch categories and first page of packages (6 per page)
export async function getServerSideProps(context) {
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = context.req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  try {
    // Fetch categories
    const categoriesRes = await fetch(`${baseUrl}/api/categories`);
    const categoriesData = await categoriesRes.json();
    const categories = categoriesData.categories || [];

    // Fetch first page of packages (limit enforced to 6 server-side already)
    const packagesRes = await fetch(`${baseUrl}/api/packages?page=1&limit=6`);
    const packagesData = await packagesRes.json();

    // Fetch some WordPress plugins for the index page
    const pluginsRes = await fetch(`${baseUrl}/api/plugins?page=1&limit=3`);
    const pluginsData = await pluginsRes.json();

    return {
      props: {
        initialCategories: categories,
        initialPackages: packagesData.packages || [],
        initialPagination: packagesData.pagination || {},
        initialPlugins: pluginsData.plugins || []
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        initialCategories: [],
        initialPackages: [],
        initialPagination: {},
        initialPlugins: []
      }
    };
  }
}