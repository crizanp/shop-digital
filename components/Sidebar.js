import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, Menu, X, Search, Layers, Package } from 'lucide-react';

const Sidebar = ({ categories = [], activeCategory, activeSubcategory }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [expandedCategories, setExpandedCategories] = useState({});
    const [isMobile, setIsMobile] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Check viewport width on mount and resize
    useEffect(() => {
        const checkViewport = () => {
            setIsMobile(window.innerWidth < 1024);
            setIsOpen(window.innerWidth >= 1024);
        };
        checkViewport();
        window.addEventListener('resize', checkViewport);

        return () => window.removeEventListener('resize', checkViewport);
    }, []);

    // Initialize expanded state based on active category
    useEffect(() => {
        if (activeCategory) {
            setExpandedCategories(prev => ({
                ...prev,
                [activeCategory]: true
            }));
        }
    }, [activeCategory]);

    // Auto-expand categories with subcategories
    useEffect(() => {
        if (categories.length > 0) {
            const expanded = {};
            categories.forEach(category => {
                if (category.hasSubcategories) {
                    expanded[category.slug] = true;
                }
            });
            setExpandedCategories(expanded);
        }
    }, [categories]);

    const toggleCategory = (categorySlug) => {
        setExpandedCategories(prev => ({
            ...prev,
            [categorySlug]: !prev[categorySlug]
        }));
    };

    // Filter categories based on search term
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.subcategories && category.subcategories.some(sub =>
            sub.name.toLowerCase().includes(searchTerm.toLowerCase())
        ))
    );

    return (
        <>
            {/* Mobile toggle button - fixed at the bottom */}
            <div className="lg:hidden fixed bottom-4 right-4 z-50 hide-scrollbar">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-purple-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center hover:bg-purple-600 transition"
                    aria-label={isOpen ? "Close categories menu" : "Open categories menu"}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Overlay for mobile */}
            {isOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar container with conditional positioning */}
            <div
                className={`bg-gray-900 rounded-2xl shadow-xl border border-gray-800 transition-all duration-300 ease-in-out hide-scrollbar
                    ${isMobile
                        ? `fixed bottom-0 left-0 right-0 z-40 max-h-[80vh] overflow-y-auto
                           ${isOpen ? 'translate-y-0' : 'translate-y-full'}`
                        : 'sticky top-4'}`
                }
            >
                <div className="p-6">
                    {/* Header section */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center">
                            <Package className="text-purple-400 mr-2" size={24} />
                            <h2 className="text-xl font-bold text-white">Our Offered Services</h2>
                        </div>
                        {isMobile && (
                            <button onClick={() => setIsOpen(false)} aria-label="Close menu">
                                <X size={24} className="text-gray-400 hover:text-white transition-colors" />
                            </button>
                        )}
                    </div>

                    {/* Search box */}
                    <div className="relative mb-6">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="text-gray-500" size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search categories..."
                            className="w-full pl-10 p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition text-gray-200 placeholder-gray-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                <X className="text-gray-500 hover:text-gray-300" size={20} />
                            </button>
                        )}
                    </div>

                    {/* All Packages Link */}
                    <div className="mb-4">
                        <Link
                            href="/"
                            className={`block py-3 px-2 rounded-lg transition-all duration-300 ${!activeCategory && !activeSubcategory
                                    ? 'bg-purple-600 text-white font-semibold'
                                    : 'text-gray-300 hover:text-purple-400 hover:bg-gray-800'
                                }`}
                            onClick={() => isMobile && setIsOpen(false)}
                        >
                            <div className="flex items-center">
                                <Package size={18} className="mr-2" />
                                All Packages
                            </div>
                        </Link>
                    </div>

                    {/* Categories list with animation */}
                    <div className="space-y-0 overflow-y-auto max-h-[60vh] pr-2 hide-scrollbar">
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((category) => (
                                <div key={category._id} className="border-b border-gray-800 last:border-b-0">
                                    {/* Main Category */}
                                    <div className="py-3 flex items-center justify-between group">
                                        <Link
                                            href={`/category/${category.slug}`}
                                            className={`${activeCategory === category.slug
                                                ? 'text-purple-400 font-semibold'
                                                : 'text-gray-300 group-hover:text-purple-400'} 
                                                flex-grow transition duration-300 flex items-center`}
                                            onClick={() => isMobile && setIsOpen(false)}
                                        >
                                            <span className="mr-2">{category.name}</span>
                                            {category.hasSubcategories && (
                                                <span className="text-xs bg-gray-800 text-purple-400 px-2 py-0.5 rounded-full">
                                                    {category.subcategories.length}
                                                </span>
                                            )}
                                        </Link>

                                        {category.hasSubcategories && (
                                            <button
                                                onClick={() => toggleCategory(category.slug)}
                                                className="p-1 text-gray-400 hover:text-purple-400 focus:outline-none"
                                                aria-label={expandedCategories[category.slug]
                                                    ? "Collapse category"
                                                    : "Expand category"}
                                            >
                                                {expandedCategories[category.slug]
                                                    ? <ChevronUp size={18} />
                                                    : <ChevronDown size={18} />}
                                            </button>
                                        )}
                                    </div>

                                    {/* Subcategories with smooth animation */}
                                    {category.hasSubcategories && category.subcategories && (
                                        <div
                                            className={`overflow-hidden transition-all duration-300 ease-in-out
                                                ${expandedCategories[category.slug] ? 'max-h-96' : 'max-h-0'}`}
                                        >
                                            {category.subcategories.map((subcategory) => (
                                                <div
                                                    key={subcategory._id}
                                                    className={`py-3 pl-6 border-t border-gray-800 
                                                        ${activeSubcategory === subcategory.slug
                                                            ? 'bg-gray-800 rounded-lg'
                                                            : 'hover:bg-gray-800/50 rounded-lg'} transition`}
                                                >
                                                    <Link
                                                        href={`/subcategory/${subcategory.slug}`}
                                                        className={`${activeSubcategory === subcategory.slug
                                                            ? 'text-purple-400 font-medium'
                                                            : 'text-gray-400 hover:text-purple-400'} 
                                                            transition duration-300 block`}
                                                        onClick={() => isMobile && setIsOpen(false)}
                                                    >
                                                        {subcategory.name}
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-400 py-6 bg-gray-800/50 rounded-lg">
                                <Search className="mx-auto mb-2 text-purple-500" size={24} />
                                <p>No categories found</p>
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="mt-2 text-purple-400 hover:text-purple-300 text-sm font-medium"
                                >
                                    Clear search
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile-only action buttons */}
                    {isMobile && (
                        <div className="mt-6 flex space-x-2">
                            <button
                                className="flex-1 bg-purple-700 text-white py-3 px-4 rounded-lg 
                                    hover:bg-purple-600 transition duration-300 flex items-center justify-center font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                Apply Filters
                            </button>
                            <button
                                className="flex-1 bg-gray-800 text-gray-300 py-3 px-4 rounded-lg 
                                    hover:bg-gray-700 transition duration-300 flex items-center justify-center font-medium"
                                onClick={() => {
                                    setSearchTerm('');
                                    setIsOpen(false);
                                }}
                            >
                                Reset
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Sidebar;