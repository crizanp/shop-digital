// pages/pricing.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import PackageCard from '../components/PackageCard';
import PluginCard from '../components/PluginCard';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Package, ChevronRight, ChevronLeft, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import LoadingButton from '../components/LoadingButton';
import LoadingLink from '../components/LoadingLink';
import { useLoading } from '../contexts/LoadingContext';

export default function PricingPage({ initialCategories = [], initialPackages = [], initialPagination = {}, initialPlugins = [] }) {
  const router = useRouter();
  const { categorySlug, subcategorySlug } = router.query;

  const [categories, setCategories] = useState(initialCategories);
  const [packages, setPackages] = useState(initialPackages);
  const [plugins, setPlugins] = useState(initialPlugins);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [displayedPackages, setDisplayedPackages] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [packagesPerPage] = useState(6);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchCategories = async () => {};

  const fetchPackages = async (page = 1, categoryId = null, subcategoryIndex = null, reset = false) => {
    try {
      if (reset) {
        setLoadingMore(true);
      }
      
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
        // For pagination, always replace packages instead of appending
        setPackages(data.packages || []);
      }
      
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

  const findCategoryBySlug = (slug) => {
    return categories.find(cat => cat.slug === slug);
  };

  const findSubcategoryBySlug = (categorySlug, subcategorySlug) => {
    const category = findCategoryBySlug(categorySlug);
    if (!category || !category.subcategories) return null;
    return category.subcategories.find(sub => sub.slug === subcategorySlug);
  };

  useEffect(() => {
    if (!router.isReady) return;

    const loadFilteredData = async () => {
      setLoading(true);
      
      if (subcategorySlug) {
        setActiveSubcategory(subcategorySlug);

        let parentCategorySlug = categorySlug;
        if (!parentCategorySlug) {
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
            if (category.slug === 'wordpress-plugins') {
              router.push(`/plugins?category=${subcategorySlug}`);
              return;
            }
            
            const subcategoryIndex = category.subcategories.findIndex(sub => sub.slug === subcategorySlug);
            
            await fetchPackages(1, category._id, subcategoryIndex, true);
          }
        }
      } else if (categorySlug) {
        setActiveCategory(categorySlug);
        setActiveSubcategory(null);

        const category = findCategoryBySlug(categorySlug);

        if (category) {
          if (category.slug === 'wordpress-plugins') {
            router.push('/plugins');
            return;
          }
          await fetchPackages(1, category._id, null, true);
        }
      } else {
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

  useEffect(() => {
    const term = searchTerm?.trim().toLowerCase();

    const packageMatchesSearch = (pkg) => {
      if (!term) return true;

      const fields = [];
      if (pkg.title) fields.push(pkg.title);
      if (pkg.name) fields.push(pkg.name);
      if (pkg.description) fields.push(pkg.description);
      if (pkg.shortDescription) fields.push(pkg.shortDescription);
      if (pkg.tags && Array.isArray(pkg.tags)) fields.push(pkg.tags.join(' '));

      try {
        const cat = categories.find(c => c._id === pkg.categoryId || c.slug === pkg.categorySlug || c.name === pkg.categoryName);
        if (cat) {
          fields.push(cat.name);
          if (cat.subcategories && Array.isArray(cat.subcategories)) {
            const sub = cat.subcategories[pkg.subcategoryIndex] || cat.subcategories.find(s => s.slug === pkg.subcategorySlug || s.name === pkg.subcategoryName);
            if (sub) fields.push(sub.name);
          }
        }
      } catch (e) {
      }

      const haystack = fields.filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(term);
    };

    let filtered = packages.filter(packageMatchesSearch);

    switch (sortBy) {
      case 'price-low-high':
        filtered = filtered.sort((a, b) => {
          const priceA = parseFloat((a.price || '').replace(/[^0-9.]/g, '')) || 0;
          const priceB = parseFloat((b.price || '').replace(/[^0-9.]/g, '')) || 0;
          return priceA - priceB;
        });
        break;
      case 'price-high-low':
        filtered = filtered.sort((a, b) => {
          const priceA = parseFloat((a.price || '').replace(/[^0-9.]/g, '')) || 0;
          const priceB = parseFloat((b.price || '').replace(/[^0-9.]/g, '')) || 0;
          return priceB - priceA;
        });
        break;
      case 'latest':
        filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered = filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'featured':
        filtered = filtered.sort((a, b) => {
          const fa = a.featured ? 1 : 0;
          const fb = b.featured ? 1 : 0;
          const byFeatured = fb - fa; // negative => a before b when a.featured
          if (byFeatured !== 0) return byFeatured;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        break;
      default:
        filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    const featuredFirst = (() => {
      const featured = [];
      const others = [];
      for (const p of filtered) {
        if (p && p.featured) featured.push(p);
        else others.push(p);
      }
      return [...featured, ...others];
    })();

    setDisplayedPackages(featuredFirst);
  }, [packages, sortBy, searchTerm, categories]);

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
      return `Professional ${subcategoryName} solutions with fast delivery and competitive pricing. Quality work guaranteed.`;
    } else if (activeCategory) {
      return `High-quality ${categoryName} services delivered by experienced professionals. Quick turnaround times.`;
    } else {
      return 'Get high-quality design packages and digital services with fast delivery and competitive pricing.';
    }
  };

  const nextPage = async () => {
    if (!hasNextPage || loadingMore) return;
    
    setLoadingMore(true);
    const newPage = currentPage + 1;
    let categoryId = null;
    let subcategoryIndex = null;
    
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
    
    await fetchPackages(newPage, categoryId, subcategoryIndex, false);
    setLoadingMore(false);
    
    // Scroll to top after loading new page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevPage = async () => {
    if (!hasPrevPage || loadingMore) return;
    
    setLoadingMore(true);
    const newPage = currentPage - 1;
    let categoryId = null;
    let subcategoryIndex = null;
    
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
    
    await fetchPackages(newPage, categoryId, subcategoryIndex, false);
    setLoadingMore(false);
    
    // Scroll to top after loading new page
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <Navbar 
        activeCategory={activeCategory}
        activeSubcategory={activeSubcategory}
      />

      <div className="min-h-screen bg-white text-gray-900">
        {/* Hero Section for all pages */}

        {/* Hero Section for all pages */}
        <section className="bg-purple-50 py-12 my-4">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {activeSubcategory ? getActiveSubcategoryName() : 
               activeCategory ? getActiveCategoryName() : 
               'Professional Digital Solutions'}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {getHeaderDescription()}
            </p>
          </div>
        </section>

        <div className="container mx-auto sm:pt-10 sm:pb-10 px-4" id="services">
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
              {!(router.pathname === '/' || router.asPath === '/') && (
                <div className="mb-3 text-sm text-gray-500">
                  <nav className="flex items-center space-x-2">
                    <LoadingLink href="/" className="hover:text-purple-500" loadingText="Going to home...">Home</LoadingLink>
                    {(activeCategory || activeSubcategory) && (
                      <>
                        <ChevronRight size={14} className="text-gray-400" />
                        {activeCategory && (
                          <LoadingLink href={`/category/${activeCategory}`} className="hover:text-purple-500" loadingText={`Loading ${getActiveCategoryName()}...`}>{getActiveCategoryName()}</LoadingLink>
                        )}
                        {activeSubcategory && (
                          <>
                            <ChevronRight size={14} className="text-gray-400" />
                            <span className="text-purple-500">{getActiveSubcategoryName()}</span>
                          </>
                        )}
                      </>
                    )}
                  </nav>
                </div>
              )}

              <div className="flex flex-col mb-8 sm:flex-row justify-between items-start sm:items-center mb-2 bg-purple-50 px-4 py-2 rounded-lg">
                <div className="w-full sm:w-1/2  sm:mb-0 ">
                  <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search any packages"
                    className="w-full px-3 py-2 border border-gray-200 rounded-md "
                  />
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

              {/* Pagination stats hidden on main page */}

              {displayedPackages.length > 0 ? (
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

                  {/* Pagination Navigation */}
                  {(hasNextPage || hasPrevPage) && (
                    <div className="flex justify-center items-center gap-4 mt-8">
                      {/* Previous Button */}
                      <LoadingButton
                        onClick={prevPage}
                        disabled={!hasPrevPage || loadingMore}
                        className={`${
                          !hasPrevPage || loadingMore 
                            ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        } px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors`}
                        loadingText="Loading previous..."
                      >
                        <ChevronLeft size={16} />
                        <span>Previous</span>
                      </LoadingButton>

                      {/* Page Info */}
                      <div className="flex items-center space-x-4 px-4">
                        <span className="text-gray-600 font-medium">
                          Page {currentPage} of {totalPages}
                        </span>
                      </div>

                      {/* Next Button */}
                      <LoadingButton
                        onClick={nextPage}
                        disabled={!hasNextPage || loadingMore}
                        className={`${
                          !hasNextPage || loadingMore 
                            ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                            : 'bg-purple-600 hover:bg-purple-700 text-white'
                        } px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors`}
                        loadingText="Loading next..."
                      >
                        <span>Next</span>
                        <ChevronRight size={16} />
                      </LoadingButton>
                    </div>
                  )}

                  {/* End of Results Message */}
                  {totalItems > 0 && !hasNextPage && !hasPrevPage && totalPages === 1 && (
                    <div className="text-center mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-700">
                        Showing all {totalItems} packages
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