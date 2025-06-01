// pages/pricing.js
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import PackageCard from '../components/PackageCard';
import { packagesData as data } from '../dummyContent.js';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Filter, SortAsc, SortDesc, Package, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function PricingPage() {
  const { categories, packages } = data;
  const router = useRouter();
  const { categoryId, subcategoryId } = router.query;

  const [filteredPackages, setFilteredPackages] = useState(packages);
  const [displayedPackages, setDisplayedPackages] = useState(packages);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (subcategoryId) {
      const subCatId = parseInt(subcategoryId);
      setActiveSubcategory(subCatId);
      setFilteredPackages(packages.filter(pkg => pkg.categoryId === subCatId));

      // Find parent category
      for (const category of categories) {
        if (category.hasSubcategories) {
          const found = category.subcategories.find(sub => sub.id === subCatId);
          if (found) {
            setActiveCategory(category.id);
            break;
          }
        }
      }
    } else if (categoryId) {
      const catId = parseInt(categoryId);
      setActiveCategory(catId);
      setActiveSubcategory(null);

      // Find category
      const category = categories.find(cat => cat.id === catId);

      if (category) {
        if (category.hasSubcategories) {
          // Get all packages from all subcategories
          const subCategoryIds = category.subcategories.map(sub => sub.id);
          setFilteredPackages(packages.filter(pkg => subCategoryIds.includes(pkg.categoryId)));
        } else {
          // Direct category
          setFilteredPackages(packages.filter(pkg => pkg.categoryId === catId));
        }
      }
    } else {
      // No filter, show all packages
      setFilteredPackages(packages);
      setActiveCategory(null);
      setActiveSubcategory(null);
    }
  }, [categoryId, subcategoryId, categories, packages]);

  // Apply sorting whenever filteredPackages or sortBy changes
  useEffect(() => {
    let sorted = [...filteredPackages];

    switch (sortBy) {
      case 'price-low-high':
        sorted = sorted.sort((a, b) => {
          const priceA = parseFloat(a.price.match(/\d+(\.\d+)?/)[0]);
          const priceB = parseFloat(b.price.match(/\d+(\.\d+)?/)[0]);
          return priceA - priceB;
        });
        break;
      case 'price-high-low':
        sorted = sorted.sort((a, b) => {
          const priceA = parseFloat(a.price.match(/\d+(\.\d+)?/)[0]);
          const priceB = parseFloat(b.price.match(/\d+(\.\d+)?/)[0]);
          return priceB - priceA;
        });
        break;
      case 'latest':
        sorted = sorted.sort((a, b) => b.id - a.id);
        break;
      case 'oldest':
        sorted = sorted.sort((a, b) => a.id - b.id);
        break;
      default:
        sorted = sorted.sort((a, b) => a.id - b.id);
    }

    setDisplayedPackages(sorted);
  }, [filteredPackages, sortBy]);

  // Find active category/subcategory names
  const getActiveCategoryName = () => {
    if (activeCategory) {
      const category = categories.find(cat => cat.id === activeCategory);
      return category ? category.name : 'All Categories';
    }
    return 'All Categories';
  };

  const getActiveSubcategoryName = () => {
    if (activeSubcategory && activeCategory) {
      const category = categories.find(cat => cat.id === activeCategory);
      if (category && category.hasSubcategories) {
        const subcategory = category.subcategories.find(sub => sub.id === activeSubcategory);
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
                  <span className="hover:text-purple-400 transition-colors cursor-pointer">Home</span>

                  {activeCategory && (
                    <>
                      <ChevronRight size={16} className="mx-1 text-gray-500" />
                      <span className="hover:text-purple-400 transition-colors cursor-pointer">{getActiveCategoryName()}</span>
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
                  </select>
                </div>
              </div>

              {displayedPackages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {displayedPackages.map((pkg) => (
                    <PackageCard
                      key={pkg.id}
                      title={pkg.title}
                      subtitle={pkg.subtitle}
                      price={pkg.price}
                      image={pkg.image}
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