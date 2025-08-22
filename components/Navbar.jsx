"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Menu, X, MoreVertical, Globe } from 'lucide-react';
import LoadingLink from './LoadingLink';
import CountrySelector from './CountrySelector';
import { useLoading } from '../contexts/LoadingContext';

const Navbar = ({ activeCategory, activeSubcategory }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const router = useRouter();
    const { showLoading } = useLoading();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        const handleRouteChange = () => {
            setIsOpen(false);
            setActiveDropdown(null);
        };
        router.events.on('routeChangeStart', handleRouteChange);
        return () => {
            router.events.off('routeChangeStart', handleRouteChange);
        };
    }, [router.events]);

    const categories = [
        { 
            _id: 'cat-1', 
            name: 'Video Editing', 
            slug: 'video-editing', 
            hasSubcategories: false, 
            subcategories: [] 
        },
        {
            _id: 'cat-2',
            name: 'Web Development',
            slug: 'website-development',
            hasSubcategories: true,
            subcategories: [
                { _id: 'sub-2-1', name: 'E-commerce Websites', slug: 'ecommerce-website' },
                { _id: 'sub-2-2', name: 'Business Websites', slug: 'business-website' },
                { _id: 'sub-2-3', name: 'WordPress Websites', slug: 'wordpress-development' },
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

    const handleLinkClick = (href) => {
        if (href && href.startsWith('#')) {
            const el = document.getElementById(href.substring(1));
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
        setIsOpen(false);
        setActiveDropdown(null);
        
        // Show loading for navigation
        if (href && !href.startsWith('#')) {
            showLoading('Loading page...');
        }
    };

    const navbarClasses = `
        fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${scrolled 
            ? 'bg-white/95 backdrop-blur-lg border-b border-purple-100 shadow-lg' 
            : 'bg-gradient-to-r from-purple-50/90 via-white/90 to-purple-50/90 backdrop-blur-sm'
        }
    `.trim();

    return (
        <nav className={navbarClasses}>
            {/* Mobile Currency Bar */}
            <div className="lg:hidden border-b border-purple-100/50 bg-white/50">
                <div className="max-w-7xl mx-auto px-4 py-2">
                    <div className="flex items-center justify-between">
                        <div className="text-xs font-medium text-gray-600">
                            Currency
                        </div>
                        <CountrySelector />
                    </div>
                </div>
            </div>

            {/* Main Navigation Container */}
            <div className="max-w-7xl mx-auto">
                {/* Mobile Layout */}
                <div className="flex items-center justify-between h-16 lg:hidden px-4">
                    {/* Left: Show category button (like old navbar) */}
                    <button
                        className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm border border-purple-200/70 px-3 py-2 rounded-xl text-sm font-medium shadow-sm hover:bg-white hover:shadow-md hover:border-purple-300 transition-all duration-200 text-gray-800"
                        onClick={() => {
                            if (typeof window === 'undefined') return;
                            // If on plugins page, open plugin sidebar; otherwise open main sidebar
                            const path = typeof window !== 'undefined' ? window.location.pathname : '';
                            if (path && path.startsWith('/plugins')) {
                                window.dispatchEvent(new CustomEvent('openPluginSidebar'));
                            } else {
                                window.dispatchEvent(new CustomEvent('openSidebar'));
                            }
                        }}
                        aria-label="Show categories"
                    >
                        <Menu size={18} className="text-gray-700" />
                        <span className="hidden sm:inline">Show category</span>
                        <span className="sm:hidden">Menu</span>
                    </button>

                    {/* Center: Logo */}
                    <LoadingLink 
                        href="/" 
                        loadingText="Going to home..." 
                        onClick={() => handleLinkClick('/')}
                        className="flex-1 flex justify-center"
                    >
                        <div className="relative w-28 h-8 sm:w-32 sm:h-9 hover:scale-105 transition-transform duration-200">
                            <Image 
                                src="/images/logo_black.png" 
                                alt="Foxbeep" 
                                fill 
                                className="object-contain" 
                                priority 
                            />
                        </div>
                    </LoadingLink>

                    {/* Right: More options button (like old navbar) */}
                    <button
                        className="p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200"
                        onClick={() => setIsOpen(v => !v)}
                        aria-expanded={isOpen}
                        aria-label={isOpen ? 'Close menu' : 'Open menu'}
                    >
                        {isOpen ? <X size={24} /> : <MoreVertical size={20} />}
                    </button>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:flex items-center justify-between h-20 px-6">
                    {/* Logo */}
                    <LoadingLink 
                        href="/" 
                        loadingText="Going to home..." 
                        onClick={() => handleLinkClick('/')}
                        className="flex-shrink-0 group"
                    >
                        <div className="relative w-40 h-12 group-hover:scale-105 transition-transform duration-200">
                            <Image 
                                src="/images/logo_black.png" 
                                alt="Foxbeep" 
                                fill 
                                className="object-contain" 
                                priority 
                            />
                        </div>
                    </LoadingLink>

                    {/* Desktop Categories */}
                    <div className="flex items-center space-x-1 flex-1 justify-center">
                        {categories.map((category, index) => {
                            const categorySlug = category.slug || category.name?.toLowerCase().replace(/\s+/g, '-');
                            const hasSub = category.hasSubcategories && category.subcategories?.length > 0;
                            const isActive = activeCategory === categorySlug;
                            
                            return (
                                <div 
                                    key={category._id} 
                                    className="relative group" 
                                    onMouseEnter={() => hasSub && setActiveDropdown(index)} 
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <LoadingLink
                                        href={categorySlug === 'wordpress-plugins' ? '/plugins' : `/category/${categorySlug}`}
                                        className={`
                                            flex items-center px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 
                                            ${isActive 
                                                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white ' 
                                                : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50/80 '
                                            }
                                        `}
                                        onClick={() => handleLinkClick(categorySlug === 'wordpress-plugins' ? '/plugins' : `/category/${categorySlug}`)}
                                        loadingText={`Loading ${category.name}...`}
                                        style={{ fontSize: 'clamp(14px, 1.4vw, 16px)' }}
                                    >
                                        {category.name}
                                        {hasSub && (
                                            <ChevronDown 
                                                size={16} 
                                                className={`
                                                    ml-1 transition-transform duration-200 
                                                    ${activeDropdown === index ? 'rotate-180' : ''}
                                                `} 
                                            />
                                        )}
                                    </LoadingLink>

                                    {/* Desktop Dropdown */}
                                    {hasSub && activeDropdown === index && (
                                        <div className="absolute top-full left-0 pt-2 w-64 z-50" onMouseEnter={() => setActiveDropdown(index)} onMouseLeave={() => setActiveDropdown(null)}>
                                            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden">
                                                {category.subcategories.map((sub) => (
                                                    <LoadingLink
                                                        key={sub._id}
                                                        href={categorySlug === 'wordpress-plugins' ? `/plugins?category=${sub.slug}` : `/subcategory/${sub.slug}`}
                                                        className={`
                                                            block px-4 py-3 text-sm font-medium transition-all duration-200 
                                                            ${activeSubcategory === sub.slug 
                                                                ? 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border-l-2 border-purple-500' 
                                                                : 'text-gray-700 hover:bg-purple-50/70 hover:text-purple-600 hover:translate-x-1'
                                                            }
                                                        `}
                                                        onClick={() => handleLinkClick(categorySlug === 'wordpress-plugins' ? `/plugins?category=${sub.slug}` : `/subcategory/${sub.slug}`)}
                                                        loadingText={`Loading ${sub.name}...`}
                                                        style={{ fontSize: 'clamp(14px, 1.2vw, 16px)' }}
                                                    >
                                                        {sub.name}
                                                    </LoadingLink>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Desktop Currency Selector */}
                    <div className="flex-shrink-0">
                        <CountrySelector />
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay (like old navbar) */}
            {isOpen && (
                <div className="lg:hidden absolute left-4 right-4 top-full z-40 transition-all duration-300 ease-in-out">
                    <div className="bg-white/95 backdrop-blur-lg border border-purple-100 shadow-xl py-2 space-y-1 rounded-2xl overflow-hidden">
                        {categories.map((category, index) => {
                            const categorySlug = category.slug || category.name?.toLowerCase().replace(/\s+/g, '-');
                            const hasSub = category.hasSubcategories && category.subcategories?.length > 0;
                            const isActive = activeCategory === categorySlug;
                            
                            return (
                                <div key={category._id}>
                                    <div className="flex items-center">
                                        <LoadingLink
                                            href={categorySlug === 'wordpress-plugins' ? '/plugins' : `/category/${categorySlug}`}
                                            className={`
                                                flex-1 px-4 py-3 text-base font-semibold rounded-xl mx-2 transition-all duration-200
                                                ${isActive 
                                                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg' 
                                                    : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                                                }
                                            `}
                                            onClick={() => handleLinkClick(categorySlug === 'wordpress-plugins' ? '/plugins' : `/category/${categorySlug}`)}
                                            loadingText={`Loading ${category.name}...`}
                                            style={{ fontSize: 'clamp(16px, 2vw, 18px)' }}
                                        >
                                            {category.name}
                                        </LoadingLink>
                                        {hasSub && (
                                            <button 
                                                className="p-2 mr-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200" 
                                                onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                                                aria-label={activeDropdown === index ? 'Collapse' : 'Expand'}
                                            >
                                                <ChevronDown 
                                                    size={16} 
                                                    className={`${activeDropdown === index ? 'rotate-180' : ''} transition-transform`} 
                                                />
                                            </button>
                                        )}
                                    </div>

                                    {/* Mobile Subcategories */}
                                    {hasSub && activeDropdown === index && (
                                        <div className="ml-4 mr-2 mt-1 space-y-1 border-l-2 border-purple-200 pl-3">
                                            {category.subcategories.map((sub) => (
                                                <LoadingLink
                                                    key={sub._id}
                                                    href={categorySlug === 'wordpress-plugins' ? `/plugins?category=${sub.slug}` : `/subcategory/${sub.slug}`}
                                                    className={`
                                                        block px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium
                                                        ${activeSubcategory === sub.slug 
                                                            ? 'bg-purple-100 text-purple-700 shadow-sm font-medium' 
                                                            : 'text-gray-600 hover:bg-gray-50 hover:text-purple-600'
                                                        }
                                                    `}
                                                    onClick={() => handleLinkClick(categorySlug === 'wordpress-plugins' ? `/plugins?category=${sub.slug}` : `/subcategory/${sub.slug}`)}
                                                    loadingText={`Loading ${sub.name}...`}
                                                    style={{ fontSize: 'clamp(14px, 1.5vw, 16px)' }}
                                                >
                                                    {sub.name}
                                                </LoadingLink>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;