"use client";
import { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, Search } from 'lucide-react';
import LoadingLink from './LoadingLink';
import CountrySelector from './CountrySelector';
import { useLoading } from '../contexts/LoadingContext';

const Navbar = ({ activeCategory, activeSubcategory }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const categories = [
        {
            _id: 'cat-1',
            name: 'Media & Commercial',
            slug: 'media-commercial',
            hasSubcategories: false,
            subcategories: []
        },
        {
            _id: 'cat-2',
            name: 'Web Development',
            slug: 'website-development',
            hasSubcategories: true,
            // subcategories: [
            //     { _id: 'sub-2-1', name: 'E-commerce Websites', slug: 'ecommerce-website' },
            //     { _id: 'sub-2-2', name: 'Business Websites', slug: 'business-website' },
            //     { _id: 'sub-2-3', name: 'WordPress Websites', slug: 'wordpress-development' },
            // ]
        },
        {
            _id: 'cat-3',
            name: 'Graphic Design',
            slug: 'graphic-design',
            hasSubcategories: true,
            // subcategories: [
            //     { _id: 'sub-3-1', name: 'Logo Design', slug: 'logo-design' },
            //     { _id: 'sub-3-2', name: 'Social Media Graphics', slug: 'social-media-graphics' },
            //     { _id: 'sub-3-3', name: 'Print Design', slug: 'print-design' },
            //     { _id: 'sub-3-4', name: 'Brand Identity', slug: 'brand-identity' }
            // ]
        },
        {
            _id: 'cat-4',
            name: 'WordPress Plugins',
            slug: 'wordpress-plugins',
            hasSubcategories: true,
            // subcategories: [
            //     { _id: 'sub-4-1', name: 'Payment Gateway', slug: 'payment-gateway' },
            //     { _id: 'sub-4-2', name: 'E-commerce', slug: 'ecommerce' },
            //     { _id: 'sub-4-3', name: 'SEO Tools', slug: 'seo-tools' },
            //     { _id: 'sub-4-4', name: 'Security', slug: 'security' },
            //     { _id: 'sub-4-5', name: 'Performance', slug: 'performance' }
            // ]
        },
        {
            _id: 'cat-5',
            name: 'Digital Marketing',
            slug: 'digital-marketing',
            hasSubcategories: true,
            // subcategories: [
            //     { _id: 'sub-5-1', name: 'SEO Services', slug: 'seo-services' },
            //     { _id: 'sub-5-2', name: 'Social Media Management', slug: 'social-media-management' },
            //     { _id: 'sub-5-3', name: 'PPC Advertising', slug: 'ppc-advertising' },
            //     { _id: 'sub-5-4', name: 'Content Marketing', slug: 'content-marketing' }
            // ]
        },
        {
            _id: 'cat-6',
            name: 'More',
            slug: 'more',
            hasSubcategories: true,
            isCustomLinks: true, // Flag to indicate custom links
            // subcategories: [
            //     { _id: 'sub-6-1', name: 'Photography', slug: '/photography', isCustom: true },
            //     { _id: 'sub-6-2', name: 'Animation', slug: '/animation', isCustom: true },
            //     { _id: 'sub-6-3', name: 'Music & Audio', slug: '/music-audio', isCustom: true }
            // ]
        }
    ];

    const handleLinkClick = (href) => {
        if (href && href.startsWith('#')) {
            const el = document.getElementById(href.substring(1));
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMenuOpen(false);
        setActiveDropdown(null);
        setMobileSearchOpen(false);
    };

    const handleSearch = () => {
        if (searchQuery.trim()) {
            console.log('Searching for:', searchQuery);
            setSearchQuery('');
        }
    };

    const handleSearchKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <nav className={`bg-white border-b border-gray-200 sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
            <div className="max-w-7xl mx-auto px-4 ">
                {/* Top Section */}
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex items-center">
                        <LoadingLink
                            href="/"
                            onClick={() => handleLinkClick('/')}
                            className="flex flex-col group cursor-pointer"
                        >
                            <div className="text-2xl font-bold text-gray-900 group-hover:text-gray-600 transition-colors">
                                foxbeep
                            </div>
                            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Marketplace
                            </div>
                        </LoadingLink>
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-2xl mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search services, plugins..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleSearchKeyPress}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-500 text-black rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:bg-white transition-all"
                            />
                            <Search
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 cursor-pointer hover:text-gray-600"
                                size={20}
                                onClick={handleSearch}
                            />
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-3">
                        {/* Search Button - Mobile */}
                        <button
                            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                            className="md:hidden p-2 text-gray-600 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            aria-label="Search"
                        >
                            <Search size={20} />
                        </button>

                        {/* Currency Selector - Desktop */}
                        <div className="hidden sm:block">
                            <CountrySelector />
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-gray-600 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {mobileSearchOpen && (
                    <div className="md:hidden pb-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search services, plugins..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={handleSearchKeyPress}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:bg-white transition-all"
                                autoFocus
                            />
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
                                size={18}
                                onClick={handleSearch}
                            />
                        </div>
                    </div>
                )}

                {/* Categories Navigation - Desktop */}
                <div className="hidden md:flex items-center space-x-1 py-3 border-t border-gray-100">
                    <a href='/'><button className="cursor-pointer px-4 py-2 text-sm font-medium text-black bg-gray-100 rounded-full whitespace-nowrap hover:bg-gray-200 transition-colors">
                        All
                    </button></a>
                    {categories.map((cat) => {
                        const categorySlug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-');
                        const hasSub = cat.hasSubcategories && cat.subcategories?.length > 0;
                        const isActive = activeCategory === categorySlug;
                        const isMoreCategory = cat.isCustomLinks;

                        return (
                            <div
                                key={cat._id}
                                className="relative group"
                                onMouseEnter={() => hasSub && setActiveDropdown(cat._id)}
                                onMouseLeave={() => setActiveDropdown(null)}
                            >
                                {isMoreCategory ? (
                                    // "More" button without link
                                    <button
                                        className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors flex items-center ${isActive
                                                ? 'text-black bg-gray-50'
                                                : 'text-black hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        {cat.name}
                                        {hasSub && <ChevronDown size={14} className="ml-1" />}
                                    </button>
                                ) : (
                                    // Regular category with link
                                    <LoadingLink
                                        href={categorySlug === 'wordpress-plugins' ? '/plugins' : `/category/${categorySlug}`}
                                        className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors flex items-center ${isActive
                                                ? 'text-black bg-gray-50'
                                                : 'text-black hover:text-gray-900 hover:bg-gray-50'
                                            }`}
                                        onClick={() => handleLinkClick(categorySlug === 'wordpress-plugins' ? '/plugins' : `/category/${categorySlug}`)}
                                    >
                                        {cat.name}
                                        {hasSub && <ChevronDown size={14} className="ml-1" />}
                                    </LoadingLink>
                                )}

                                {/* Dropdown */}
                                {hasSub && activeDropdown === cat._id && (
                                    <div className="absolute top-full left-0 mt-0 w-64 bg-white shadow-lg border border-gray-300 py-2 z-50">
                                        {cat.subcategories.map((sub) => {
                                            // For custom links, use the slug directly as href
                                            const subHref = sub.isCustom 
                                                ? sub.slug 
                                                : (categorySlug === 'wordpress-plugins' 
                                                    ? `/plugins?category=${sub.slug}` 
                                                    : `/subcategory/${sub.slug}`);
                                            
                                            return (
                                                <LoadingLink
                                                    key={sub._id}
                                                    href={subHref}
                                                    className={`w-full text-left px-4 py-3 text-sm transition-colors block ${activeSubcategory === sub.slug
                                                            ? 'text-gray-600 bg-gray-50 font-medium'
                                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                        }`}
                                                    onClick={() => handleLinkClick(subHref)}
                                                >
                                                    {sub.name}
                                                </LoadingLink>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden border-t border-gray-200 py-4 px-4 space-y-2">
                    {categories.map((cat) => {
                        const categorySlug = cat.slug || cat.name?.toLowerCase().replace(/\s+/g, '-');
                        const hasSub = cat.hasSubcategories && cat.subcategories?.length > 0;
                        const isActive = activeCategory === categorySlug;
                        const isMoreCategory = cat.isCustomLinks;

                        return (
                            <div key={cat._id}>
                                <div className="flex items-center">
                                    {isMoreCategory ? (
                                        // "More" button without link in mobile
                                        <button
                                            className={`flex-1 text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                                    ? 'text-gray-600 bg-gray-50'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                            onClick={() => hasSub && setActiveDropdown(activeDropdown === cat._id ? null : cat._id)}
                                        >
                                            {cat.name}
                                        </button>
                                    ) : (
                                        // Regular category with link
                                        <LoadingLink
                                            href={categorySlug === 'wordpress-plugins' ? '/plugins' : `/category/${categorySlug}`}
                                            className={`flex-1 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive
                                                    ? 'text-gray-600 bg-gray-50'
                                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                                }`}
                                            onClick={() => handleLinkClick(categorySlug === 'wordpress-plugins' ? '/plugins' : `/category/${categorySlug}`)}
                                        >
                                            {cat.name}
                                        </LoadingLink>
                                    )}
                                    {hasSub && (
                                        <button
                                            className="p-2 mr-1 text-gray-500 hover:text-gray-600 transition-colors"
                                            onClick={() => setActiveDropdown(activeDropdown === cat._id ? null : cat._id)}
                                            aria-label={activeDropdown === cat._id ? 'Collapse' : 'Expand'}
                                        >
                                            <ChevronDown
                                                size={16}
                                                className={`${activeDropdown === cat._id ? 'rotate-180' : ''} transition-transform`}
                                            />
                                        </button>
                                    )}
                                </div>

                                {/* Mobile Subcategories */}
                                {hasSub && activeDropdown === cat._id && (
                                    <div className="mt-1 ml-4 space-y-1 border-l-2 border-gray-200 pl-3">
                                        {cat.subcategories.map((sub) => {
                                            // For custom links, use the slug directly as href
                                            const subHref = sub.isCustom 
                                                ? sub.slug 
                                                : (categorySlug === 'wordpress-plugins' 
                                                    ? `/plugins?category=${sub.slug}` 
                                                    : `/subcategory/${sub.slug}`);
                                            
                                            return (
                                                <LoadingLink
                                                    key={sub._id}
                                                    href={subHref}
                                                    className={`block px-3 py-2.5 rounded-lg transition-colors text-sm ${activeSubcategory === sub.slug
                                                            ? 'text-gray-600 bg-gray-50 font-medium'
                                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-600'
                                                        }`}
                                                    onClick={() => handleLinkClick(subHref)}
                                                >
                                                    {sub.name}
                                                </LoadingLink>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Mobile Currency Selector */}
                    <div className="sm:hidden pt-3 border-t border-gray-200">
                        <div className="px-4 py-3 flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Currency</span>
                            <CountrySelector />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;