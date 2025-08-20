"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Menu, X } from 'lucide-react';

const Navbar = ({ activeCategory, activeSubcategory }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isMounted, setIsMounted] = useState(false);

    // Hardcoded categories for the navbar only
    const categories = [
        { _id: 'cat-1', name: 'Video Editing', slug: 'video-editing', hasSubcategories: false, subcategories: [] },
        {
            _id: 'cat-2',
            name: 'Web Development',
            slug: 'web-development',
            hasSubcategories: true,
            subcategories: [
                { _id: 'sub-2-1', name: 'E-commerce Websites', slug: 'ecommerce-websites' },
                { _id: 'sub-2-2', name: 'Business Websites', slug: 'business-websites' },
                { _id: 'sub-2-3', name: 'Portfolio Websites', slug: 'portfolio-websites' },
                { _id: 'sub-2-4', name: 'Landing Pages', slug: 'landing-pages' }
            ]
        },
        {
            _id: 'cat-3',
            name: 'Graphic Design',
            slug: 'graphic-design',
            hasSubcategories: true,
            subcategories: [
                { _id: 'sub-3-1', name: 'Logo Design', slug: 'logo-design' },
                { _id: 'sub-3-2', name: 'Social Media Graphics', slug: 'social-media-graphics' },
                { _id: 'sub-3-3', name: 'Print Design', slug: 'print-design' },
                { _id: 'sub-3-4', name: 'Brand Identity', slug: 'brand-identity' }
            ]
        },
        {
            _id: 'cat-4',
            name: 'WordPress Plugins',
            slug: 'wordpress-plugins',
            hasSubcategories: true,
            subcategories: [
                { _id: 'sub-4-1', name: 'Payment Gateway', slug: 'payment-gateway' },
                { _id: 'sub-4-2', name: 'E-commerce', slug: 'ecommerce' },
                { _id: 'sub-4-3', name: 'SEO Tools', slug: 'seo-tools' },
                { _id: 'sub-4-4', name: 'Security', slug: 'security' },
                { _id: 'sub-4-5', name: 'Performance', slug: 'performance' }
            ]
        },
        {
            _id: 'cat-5',
            name: 'Digital Marketing',
            slug: 'digital-marketing',
            hasSubcategories: true,
            subcategories: [
                { _id: 'sub-5-1', name: 'SEO Services', slug: 'seo-services' },
                { _id: 'sub-5-2', name: 'Social Media Management', slug: 'social-media-management' },
                { _id: 'sub-5-3', name: 'PPC Advertising', slug: 'ppc-advertising' },
                { _id: 'sub-5-4', name: 'Content Marketing', slug: 'content-marketing' }
            ]
        }
    ];

    useEffect(() => {
        setIsMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 10);
        
        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const closeAllDropdowns = () => {
        setActiveDropdown(null);
        setIsOpen(false);
    };

    const handleLinkClick = (href) => {
        if (href && href.startsWith('#')) {
            const elementId = href.substring(1);
            const el = document.getElementById(elementId);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
        closeAllDropdowns();
    };

    // Loading skeleton
    if (!isMounted) {
        return (
            <nav className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="w-32 h-8 bg-gray-200 animate-pulse rounded"></div>
                        <div className="w-6 h-6 bg-gray-200 animate-pulse rounded lg:hidden"></div>
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav
            className={`fixed top-0 left-0 w-full bg-white/95 backdrop-blur-sm z-50 transition-all duration-300 ${
                scrolled ? 'shadow-md border-b border-gray-300' : 'shadow-sm border-b border-gray-200'
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main navbar content */}
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link href="/" onClick={() => handleLinkClick('/')}>
                            <div className="relative w-28 h-8 sm:w-32 sm:h-9 md:w-36 md:h-10">
                                <Image 
                                    src="/images/logo_black.png" 
                                    alt="Foxbeep" 
                                    fill
                                    className="object-contain" 
                                    priority 
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {categories.map((category, index) => {
                            const categorySlug = category.slug || category.name?.toLowerCase().replace(/\s+/g, '-');
                            const categoryName = category.name;
                            const hasSubcategories = category.hasSubcategories && category.subcategories?.length > 0;

                            return (
                                <div 
                                    key={category._id} 
                                    className="relative dropdown-container"
                                    onMouseEnter={() => hasSubcategories && setActiveDropdown(index)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <Link
                                        href={categorySlug === 'wordpress-plugins' ? '/plugins' : `/category/${categorySlug}`}
                                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                                            activeCategory === categorySlug
                                                ? 'bg-purple-600 text-white shadow-sm'
                                                : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                                        }`}
                                        onClick={() => handleLinkClick(categorySlug === 'wordpress-plugins' ? '/plugins' : `/category/${categorySlug}`)}
                                    >
                                        {categoryName}
                                        {hasSubcategories && (
                                            <ChevronDown 
                                                size={16} 
                                                className={`ml-1 transition-transform duration-200 ${
                                                    activeDropdown === index ? 'rotate-180' : ''
                                                }`} 
                                            />
                                        )}
                                    </Link>

                                    {/* Desktop Dropdown */}
                                    {hasSubcategories && activeDropdown === index && (
                                        <div 
                                            className="absolute top-full left-0 pt-2 w-64 z-50"
                                            onMouseEnter={() => setActiveDropdown(index)}
                                            onMouseLeave={() => setActiveDropdown(null)}
                                        >
                                            <div className="bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                                                {category.subcategories.map((subcategory) => {
                                                    const subcategorySlug = subcategory.slug;
                                                    const subcategoryName = subcategory.name;

                                                    return (
                                                        <Link
                                                            key={subcategory._id}
                                                            href={categorySlug === 'wordpress-plugins' ? `/plugins?category=${subcategorySlug}` : `/subcategory/${subcategorySlug}`}
                                                            className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                                                                activeSubcategory === subcategorySlug
                                                                    ? 'bg-purple-600 text-white'
                                                                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                                                            }`}
                                                            onClick={() => handleLinkClick(categorySlug === 'wordpress-plugins' ? `/plugins?category=${subcategorySlug}` : `/subcategory/${subcategorySlug}`)}
                                                        >
                                                            {subcategoryName}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden">
                        <button
                            className="p-2 text-gray-700 hover:text-purple-600 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label={isOpen ? 'Close menu' : 'Open menu'}
                        >
                            {isOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className={`lg:hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                } overflow-hidden`}>
                    <div className="py-2 space-y-1 border-t border-gray-200">
                        {categories.map((category, index) => {
                            const categorySlug = category.slug;
                            const categoryName = category.name;
                            const hasSubcategories = category.hasSubcategories && category.subcategories?.length > 0;

                            return (
                                <div key={category._id}>
                                    <div className="flex items-center">
                                        <Link
                                            href={categorySlug === 'wordpress-plugins' ? '/plugins' : `/category/${categorySlug}`}
                                            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                                activeCategory === categorySlug
                                                    ? 'bg-purple-600 text-white'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                            onClick={() => handleLinkClick(categorySlug === 'wordpress-plugins' ? '/plugins' : `/category/${categorySlug}`)}
                                        >
                                            {categoryName}
                                        </Link>
                                        {hasSubcategories && (
                                            <button
                                                className="p-2 text-gray-500 hover:text-purple-600 transition-colors"
                                                onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                                                aria-label={activeDropdown === index ? 'Collapse' : 'Expand'}
                                            >
                                                <ChevronDown 
                                                    size={16} 
                                                    className={`transition-transform duration-200 ${
                                                        activeDropdown === index ? 'rotate-180' : ''
                                                    }`} 
                                                />
                                            </button>
                                        )}
                                    </div>

                                    {/* Mobile Subcategories */}
                                    {hasSubcategories && activeDropdown === index && (
                                        <div className="ml-4 mt-1 space-y-1 border-l-2 border-purple-200 pl-3">
                                            {category.subcategories.map((subcategory) => {
                                                const subcategorySlug = subcategory.slug;
                                                const subcategoryName = subcategory.name;

                                                return (
                                                    <Link
                                                        key={subcategory._id}
                                                        href={categorySlug === 'wordpress-plugins' ? `/plugins?category=${subcategorySlug}` : `/subcategory/${subcategorySlug}`}
                                                        className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                                                            activeSubcategory === subcategorySlug
                                                                ? 'bg-purple-100 text-purple-700 font-medium'
                                                                : 'text-gray-600 hover:bg-gray-50 hover:text-purple-600'
                                                        }`}
                                                        onClick={() => handleLinkClick(categorySlug === 'wordpress-plugins' ? `/plugins?category=${subcategorySlug}` : `/subcategory/${subcategorySlug}`)}
                                                    >
                                                        {subcategoryName}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;