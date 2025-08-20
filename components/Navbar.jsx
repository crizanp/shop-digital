"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Menu, X } from 'lucide-react';

const Navbar = ({ categories = [], activeCategory, activeSubcategory }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isMounted, setIsMounted] = useState(false);

    // Handle client-side mounting
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        
        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', handleScroll);
            return () => window.removeEventListener('scroll', handleScroll);
        }
    }, []);

    // Auto-expand dropdown for active category with subcategories
    useEffect(() => {
        if (activeCategory && categories.length > 0) {
            const categoryIndex = categories.findIndex(cat => 
                cat.slug === activeCategory || cat.name?.toLowerCase().replace(/\s+/g, '-') === activeCategory
            );
            const category = categories[categoryIndex];
            if (category && (category.hasSubcategories || (category.subcategories && category.subcategories.length > 0))) {
                setActiveDropdown(categoryIndex);
            }
        }
    }, [activeCategory, categories]);

    // Safe scroll to element function
    const scrollToElement = (elementId) => {
        if (typeof window !== 'undefined') {
            const element = document.getElementById(elementId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const toggleDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    const closeAllDropdowns = () => {
        setActiveDropdown(null);
    };

    const handleMobileNavClick = () => {
        setIsOpen(false);
        setActiveDropdown(null);
    };

    const handleLinkClick = (href) => {
        // Handle hash links for smooth scrolling
        if (href.startsWith('#')) {
            const elementId = href.substring(1);
            scrollToElement(elementId);
            return;
        }
        closeAllDropdowns();
    };

    // Don't render until mounted to avoid hydration issues
    if (!isMounted) {
        return (
            <nav className="fixed top-0 left-0 w-full bg-white z-50 text-gray-900 pr-6 xl:pr-0 shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center h-16 md:h-18 lg:h-20">
                        <div className="flex items-center -ml-2">
                            <Link href="/" className="flex items-center">
                                <div className="relative w-32 h-12 md:w-36 md:h-14 lg:w-40 lg:h-30">
                                    <div className="w-full h-full bg-gray-200 animate-pulse rounded"></div>
                                </div>
                            </Link>
                        </div>
                        <div className="xl:hidden">
                            <div className="w-6 h-6 bg-gray-200 animate-pulse rounded"></div>
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav
            className={`fixed top-0 left-0 w-full bg-white z-50 text-gray-900 pr-6 xl:pr-0 transition-all duration-300 ${
                scrolled ? 'shadow-lg border-b border-gray-200' : 'shadow-sm border-b border-gray-100'
            }`}
            onMouseLeave={closeAllDropdowns}
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center h-16 md:h-18 lg:h-20">
                    {/* Logo */}
                        <div className="flex items-center -ml-2">
                            <Link 
                                href="/" 
                                className="flex items-center" 
                                onClick={() => handleLinkClick('/')}
                            >
                                <div className="relative w-28 h-10 md:w-32 md:h-12 lg:w-36 lg:h-8">
                                    <Image
                                        src="/images/logo_black.png"
                                        alt="Logo"
                                        width={140}
                                        height={38}
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                            </Link>
                        </div>

                    {/* Desktop Navigation - hidden on mobile and lg, shown on xl and up */}
                    <div className="hidden xl:flex items-center justify-end space-x-1 md:space-x-2 lg:space-x-4 xl:space-x-6 flex-1">
                        {categories && categories.length > 0 ? (
                            categories.map((category, index) => {
                                // Ensure category has required properties
                                const categorySlug = category.slug || category.name?.toLowerCase().replace(/\s+/g, '-') || `category-${index}`;
                                const categoryName = category.name || `Category ${index + 1}`;
                                const hasSubcategories = category.hasSubcategories || (category.subcategories && category.subcategories.length > 0);
                                const subcategories = category.subcategories || [];

                                return (
                                    <div key={category._id || category.id || `cat-${index}`} className="relative group">
                                        <Link
                                                        href={`/category/${categorySlug}`}
                                                        className={`font-medium text-xs md:text-sm lg:text-base whitespace-nowrap hover:text-purple-500 transition-colors duration-200 flex items-center py-2 px-1 md:px-2 ${
                                                            activeCategory === categorySlug ? 'text-purple-600' : 'text-gray-700'
                                                        }`}
                                            onMouseEnter={() => hasSubcategories && setActiveDropdown(index)}
                                            onClick={() => handleLinkClick(`/category/${categorySlug}`)}
                                        >
                                            {categoryName}
                                            {hasSubcategories && (
                                                <ChevronDown 
                                                    size={14} 
                                                    className={`ml-1 transition-transform duration-200 ${
                                                        activeDropdown === index ? 'rotate-180' : ''
                                                    }`} 
                                                />
                                            )}
                                        </Link>

                                        {/* Desktop Dropdown */}
                                        {hasSubcategories && subcategories.length > 0 && activeDropdown === index && (
                                            <div 
                                                className="fixed left-0 w-full bg-white border-t border-gray-200 shadow-lg shadow-black/5 z-20"
                                                style={{ top: '5rem' }}
                                            >
                                                <div className="container mx-auto py-4 md:py-6 lg:py-8 px-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                        {subcategories.map((subcategory, subIndex) => {
                                                            const subcategorySlug = subcategory.slug || subcategory.name?.toLowerCase().replace(/\s+/g, '-') || `subcategory-${subIndex}`;
                                                            const subcategoryName = subcategory.name || `Subcategory ${subIndex + 1}`;
                                                            
                                                                return (
                                                                <Link
                                                                    key={subcategory._id || subcategory.id || `sub-${subIndex}`}
                                                                    href={`/subcategory/${subcategorySlug}`}
                                                                    className={`block p-3 rounded-lg transition-colors duration-200 ${
                                                                        activeSubcategory === subcategorySlug
                                                                            ? 'bg-purple-600 text-white'
                                                                            : 'hover:bg-gray-50 text-gray-700 hover:text-purple-600'
                                                                    }`}
                                                                    onClick={() => {
                                                                        handleLinkClick(`/subcategory/${subcategorySlug}`);
                                                                        closeAllDropdowns();
                                                                    }}
                                                                >
                                                                    <div className="font-medium">{subcategoryName}</div>
                                                                    {subcategory.description && (
                                                                        <div className="text-sm text-gray-500 mt-1">
                                                                            {subcategory.description}
                                                                        </div>
                                                                    )}
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            // Fallback navigation items if no categories
                            <div className="flex items-center space-x-6">
                                <Link href="/" className="text-gray-700 hover:text-purple-600 transition-colors">
                                    Home
                                </Link>
                                <Link href="/plugins" className="text-gray-700 hover:text-purple-600 transition-colors">
                                    WordPress Plugins
                                </Link>
                                <Link href="/about" className="text-gray-700 hover:text-purple-600 transition-colors">
                                    About
                                </Link>
                                <Link href="/services" className="text-gray-700 hover:text-purple-600 transition-colors">
                                    Services
                                </Link>
                                <Link href="/contact" className="text-gray-700 hover:text-purple-600 transition-colors">
                                    Contact
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button - visible until xl breakpoint */}
                    <div className="xl:hidden flex items-center">
                        <button
                            className="text-gray-700 hover:text-purple-600 focus:outline-none transition-colors"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label={isOpen ? "Close menu" : "Open menu"}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation - Only visible on mobile and lg */}
            {isOpen && (
                <div className="xl:hidden bg-gray-900 border-t border-gray-800 overflow-hidden max-h-screen overflow-y-auto">
                    <div className="container mx-auto px-4 py-3">
                        <ul className="space-y-1">
                            {categories && categories.length > 0 ? (
                                categories.map((category, index) => {
                                    const categorySlug = category.slug || category.name?.toLowerCase().replace(/\s+/g, '-') || `category-${index}`;
                                    const categoryName = category.name || `Category ${index + 1}`;
                                    const hasSubcategories = category.hasSubcategories || (category.subcategories && category.subcategories.length > 0);
                                    const subcategories = category.subcategories || [];

                                    return (
                                        <li key={category._id || category.id || `mobile-cat-${index}`} className="py-1">
                                            {hasSubcategories ? (
                                                <div>
                                                    {/* Category with subcategories */}
                                                    <div className="flex items-center justify-between">
                                                        <Link
                                                            href={`/category/${categorySlug}`}
                                                            className={`flex-1 py-2 font-medium hover:text-green-400 transition-colors duration-200 ${
                                                                activeCategory === categorySlug ? 'text-green-400' : 'text-gray-300'
                                                            }`}
                                                            onClick={handleMobileNavClick}
                                                        >
                                                            {categoryName}
                                                        </Link>
                                                        <button
                                                            className="p-2 text-gray-400 hover:text-green-400 focus:outline-none transition-colors"
                                                            onClick={() => toggleDropdown(index)}
                                                            aria-label={activeDropdown === index ? "Collapse subcategories" : "Expand subcategories"}
                                                        >
                                                            <ChevronDown
                                                                size={16}
                                                                className={`transition-transform duration-200 ease-in-out ${
                                                                    activeDropdown === index ? 'transform rotate-180' : ''
                                                                }`}
                                                            />
                                                        </button>
                                                    </div>
                                                    
                                                    {/* Mobile Subcategories */}
                                                    {activeDropdown === index && subcategories.length > 0 && (
                                                        <div className="pl-4 mt-2 border-l-2 border-green-400 space-y-1">
                                                            {subcategories.map((subcategory, subIndex) => {
                                                                const subcategorySlug = subcategory.slug || subcategory.name?.toLowerCase().replace(/\s+/g, '-') || `subcategory-${subIndex}`;
                                                                const subcategoryName = subcategory.name || `Subcategory ${subIndex + 1}`;
                                                                
                                                                return (
                                                                    <Link
                                                                        key={subcategory._id || subcategory.id || `mobile-sub-${subIndex}`}
                                                                        href={`/subcategory/${subcategorySlug}`}
                                                                        className={`block py-2 text-sm transition-colors duration-200 ${
                                                                            activeSubcategory === subcategorySlug
                                                                                ? 'text-green-400 font-medium'
                                                                                : 'text-gray-400 hover:text-green-400'
                                                                        }`}
                                                                        onClick={handleMobileNavClick}
                                                                    >
                                                                        {subcategoryName}
                                                                    </Link>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                /* Category without subcategories */
                                                <Link
                                                    href={`/category/${categorySlug}`}
                                                    className={`block py-2 font-medium hover:text-green-400 transition-colors duration-200 ${
                                                        activeCategory === categorySlug ? 'text-green-400' : 'text-gray-300'
                                                    }`}
                                                    onClick={handleMobileNavClick}
                                                >
                                                    {categoryName}
                                                </Link>
                                            )}
                                        </li>
                                    );
                                })
                            ) : (
                                // Fallback mobile navigation
                                <>
                                    <li>
                                        <Link 
                                            href="/" 
                                            className="block py-2 font-medium text-gray-300 hover:text-green-400 transition-colors"
                                            onClick={handleMobileNavClick}
                                        >
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            href="/plugins" 
                                            className="block py-2 font-medium text-gray-300 hover:text-green-400 transition-colors"
                                            onClick={handleMobileNavClick}
                                        >
                                            WordPress Plugins
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            href="/about" 
                                            className="block py-2 font-medium text-gray-300 hover:text-green-400 transition-colors"
                                            onClick={handleMobileNavClick}
                                        >
                                            About
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            href="/services" 
                                            className="block py-2 font-medium text-gray-300 hover:text-green-400 transition-colors"
                                            onClick={handleMobileNavClick}
                                        >
                                            Services
                                        </Link>
                                    </li>
                                    <li>
                                        <Link 
                                            href="/contact" 
                                            className="block py-2 font-medium text-gray-300 hover:text-green-400 transition-colors"
                                            onClick={handleMobileNavClick}
                                        >
                                            Contact
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;