// pages/pricing.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import PackageCard from '../components/PackageCard';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Filter, SortAsc, SortDesc, Package, ChevronRight, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function PricingPage() {
  const router = useRouter();
  const { categorySlug, subcategorySlug } = router.query;

  // State management
  const [categories, setCategories] = useState([]);
  const [packages, setPackages] = useState([]);
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
  const [packagesPerPage] = useState(12);
  const [loadingMore, setLoadingMore] = useState(false);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      setError('Failed to load categories');
      console.error('Error fetching categories:', err);
    }
  };

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

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchCategories();
      await fetchPackages(1, null, null, true);
      setLoading(false);
    };
    loadData();
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
        <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-xl">Loading packages...</p>
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
        <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center">
          <div className="text-center">
            <Package size={64} className="text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Error Loading Data</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
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

      <div className="min-h-screen bg-black text-gray-200">
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
                        className="hover:text-green-400 transition-colors"
                      >
                        {getActiveCategoryName()}
                      </Link>
                    </>
                  )}
                  {activeSubcategory && (
                    <>
                      <ChevronRight size={16} className="mx-1 text-gray-500" />
                      <span className="text-green-400">{getActiveSubcategoryName()}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 bg-gray-900 px-4 py-2 rounded-lg border border-gray-800">
                <div className="mb-4 sm:mb-0">
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center text-gray-300 hover:text-green-400 transition-colors"
                  >
                    <Filter size={18} className="mr-2" />
                    <span>Filter</span>
                  </button>
                </div>

                <div className="flex space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-800 border border-gray-700 text-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
                <p className="text-gray-400 p-6">{getHeaderDescription()}</p>

              {/* Pagination Stats */}
              {totalItems > 0 && renderPaginationStats()}

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading packages...</p>
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
                        className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors font-medium flex items-center space-x-2"
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
                    <div className="text-center mt-8 p-4 bg-gray-900 rounded-lg border border-gray-800">
                      <p className="text-gray-400">
                        You&apos;ve reached the end! Showing all {totalItems} packages.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-xl text-center">
                  <Package size={48} className="text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No packages found</h3>
                  <p className="text-gray-400">We couldn&apos;t find any packages matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}