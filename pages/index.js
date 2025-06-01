// pages/pricing.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import PackageCard from '../components/PackageCard';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Filter, SortAsc, SortDesc, Package, ChevronRight } from 'lucide-react';
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

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/categories');
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

  // Fetch packages from API
  const fetchPackages = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/admin/packages');
      if (!response.ok) {
        throw new Error('Failed to fetch packages');
      }
      const data = await response.json();
      setPackages(data.packages || []);
    } catch (err) {
      setError('Failed to load packages');
      console.error('Error fetching packages:', err);
    }
  };

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchPackages()]);
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
          
          // Filter packages by category ID and subcategory index
          setFilteredPackages(packages.filter(pkg => 
            pkg.categoryId === category._id && pkg.subcategoryIndex === subcategoryIndex
          ));
        }
      }
    } else if (categorySlug) {
      // Filter by category slug
      setActiveCategory(categorySlug);
      setActiveSubcategory(null);
      
      const category = findCategoryBySlug(categorySlug);
      
      if (category) {
        // Filter packages by category ID
        setFilteredPackages(packages.filter(pkg => pkg.categoryId === category._id));
      }
    } else {
      // No filter, show all packages
      setFilteredPackages(packages);
      setActiveCategory(null);
      setActiveSubcategory(null);
    }
  }, [router.isReady, categorySlug, subcategorySlug, categories, packages]);

  // Apply sorting whenever filteredPackages or sortBy changes
  useEffect(() => {
    let sorted = [...filteredPackages];

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
  }, [filteredPackages, sortBy]);

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

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading... | Professional Design Solutions</title>
        </Head>
        <Navbar />
        <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
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

      <div className="min-h-screen bg-black text-gray-200">
        <div className="container mx-auto pt-16 pb-10 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - takes 1/4 of screen on large screens */}
            <div className="lg:col-span-1">
              <Sidebar
                categories={categories}
                activeCategory={activeCategory}
                activeSubcategory={activeSubcategory}
              />
            </div>

            {/* Package Cards - takes 3/4 of screen on large screens */}
            <div className="lg:col-span-3">
              {/* Page header with breadcrumbs */}
              <div className="mb-8">
                <div className="flex items-center text-sm text-gray-400 mb-2">
                  <Link href="/pricing" className="hover:text-purple-400 transition-colors">
                    Home
                  </Link>

                  {activeCategory && (
                    <>
                      <ChevronRight size={16} className="mx-1 text-gray-500" />
                      <Link 
                        href={`/category/${activeCategory}`}
                        className="hover:text-purple-400 transition-colors"
                      >
                        {getActiveCategoryName()}
                      </Link>
                    </>
                  )}
                  {activeSubcategory && (
                    <>
                      <ChevronRight size={16} className="mx-1 text-gray-500" />
                      <span className="text-purple-400">{getActiveSubcategoryName()}</span>
                    </>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">{getHeaderTitle()}</h1>
                <p className="text-gray-400">{getHeaderDescription()}</p>
              </div>

              {/* Filter and Sort Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-gray-900 p-4 rounded-lg border border-gray-800">
                <div className="mb-4 sm:mb-0">
                  <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)} 
                    className="flex items-center text-gray-300 hover:text-purple-400 transition-colors"
                  >
                    <Filter size={18} className="mr-2" />
                    <span>Filter</span>
                  </button>
                </div>
                
                <div className="flex space-x-2">
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-800 border border-gray-700 text-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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

              {displayedPackages.length > 0 ? (
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
              ) : (
                <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-xl text-center">
                  <Package size={48} className="text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No packages found</h3>
                  <p className="text-gray-400">We couldn&apos;t find any packages matching your criteria.</p>
                </div>
              )}

              {/* Pagination - can be added if needed */}
              {displayedPackages.length > 12 && (
                <div className="flex justify-center mt-10">
                  <nav className="inline-flex rounded-lg shadow-lg">
                    <button className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-l-lg text-gray-300 hover:bg-gray-800 transition-colors">Previous</button>
                    <button className="px-4 py-2 bg-purple-600 border border-purple-600 text-white">1</button>
                    <button className="px-4 py-2 bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors">2</button>
                    <button className="px-4 py-2 bg-gray-900 border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors">3</button>
                    <button className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-r-lg text-gray-300 hover:bg-gray-800 transition-colors">Next</button>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}