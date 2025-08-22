"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Menu, X, MoreVertical, Globe } from 'lucide-react';
import CountrySelector from './CountrySelector';

const Navbar = ({ activeCategory, activeSubcategory }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const router = useRouter();

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

    const handleLinkClick = () => {
        setIsOpen(false);
        setActiveDropdown(null);
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
                    {/* Categories Button */}
                    <button
                        className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm border border-purple-200/70 px-3 py-2 rounded-xl text-sm font-medium shadow-sm hover:bg-white hover:shadow-md hover:border-purple-300 transition-all duration-200 text-gray-800"
                        onClick={() => setIsOpen(true)}
                        aria-label="Show categories"
                    >
                        <Menu size={18} className="text-gray-700" />
                        <span className="hidden sm:inline">Categories</span>
                        <span className="sm:hidden">Menu</span>
                    </button>

                    {/* Logo */}
                    <Link href="/" className="flex-1 flex justify-center" onClick={handleLinkClick}>
                        <div className="relative w-28 h-8 sm:w-32 sm:h-9 hover:scale-105 transition-transform duration-200">
                            <Image 
                                src="/images/logo_black.png" 
                                alt="Foxbeep" 
                                fill 
                                className="object-contain" 
                                priority 
                            />
                        </div>
                    </Link>

                    {/* More Options */}
                    <button
                        className="p-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200"
                        onClick={() => setActiveDropdown(activeDropdown === 'more' ? null : 'more')}
                        aria-label="More options"
                    >
                        <MoreVertical size={20} />
                    </button>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:flex items-center justify-between h-20 px-6">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0 group" onClick={handleLinkClick}>
                        <div className="relative w-40 h-12 group-hover:scale-105 transition-transform duration-200">
                            <Image 
                                src="/images/logo_black.png" 
                                alt="Foxbeep" 
                                fill 
                                className="object-contain" 
                                priority 
                            />
                        </div>
                    </Link>

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
                                    <Link
                                        href={categorySlug === 'wordpress-plugins' ? '/plugins' : `/category/${categorySlug}`}
                                        className={`
                                            flex items-center px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 
                                            ${isActive 
                                                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white ' 
                                                : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50/80 '
                                            }
                                        `}
                                        onClick={handleLinkClick}
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
                                    </Link>

                                    {/* Desktop Dropdown */}
                                    {hasSub && activeDropdown === index && (
                                        <div className="absolute top-full left-0 pt-2 w-64 z-50">
                                            <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100 py-2 overflow-hidden">
                                                {category.subcategories.map((sub) => (
                                                    <Link
                                                        key={sub._id}
                                                        href={categorySlug === 'wordpress-plugins' ? `/plugins?category=${sub.slug}` : `/subcategory/${sub.slug}`}
                                                        className={`
                                                            block px-4 py-3 text-sm font-medium transition-all duration-200 
                                                            ${activeSubcategory === sub.slug 
                                                                ? 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border-l-2 border-purple-500' 
                                                                : 'text-gray-700 hover:bg-purple-50/70 hover:text-purple-600 hover:translate-x-1'
                                                            }
                                                        `}
                                                        onClick={handleLinkClick}
                                                    >
                                                        {sub.name}
                                                    </Link>
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

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Menu */}
                    <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white/95 backdrop-blur-lg shadow-2xl z-50 lg:hidden transform transition-transform duration-300">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900">Categories</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Categories */}
                        <div className="flex-1 overflow-y-auto py-4">
                            {categories.map((category, index) => {
                                const categorySlug = category.slug || category.name?.toLowerCase().replace(/\s+/g, '-');
                                const hasSub = category.hasSubcategories && category.subcategories?.length > 0;
                                const isActive = activeCategory === categorySlug;
                                
                                return (
                                    <div key={category._id} className="px-4 mb-2">
                                        <div className="flex items-center">
                                            <Link
                                                href={categorySlug === 'wordpress-plugins' ? '/plugins' : `/category/${categorySlug}`}
                                                className={`
                                                    flex-1 px-4 py-3 text-base font-semibold rounded-xl transition-all duration-200
                                                    ${isActive 
                                                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg' 
                                                        : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'
                                                    }
                                                `}
                                                onClick={handleLinkClick}
                                            >
                                                {category.name}
                                            </Link>
                                            {hasSub && (
                                                <button 
                                                    className="p-3 ml-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-200" 
                                                    onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                                                >
                                                    <ChevronDown 
                                                        size={16} 
                                                        className={`transition-transform duration-200 ${activeDropdown === index ? 'rotate-180' : ''}`} 
                                                    />
                                                </button>
                                            )}
                                        </div>

                                        {/* Mobile Subcategories */}
                                        {hasSub && activeDropdown === index && (
                                            <div className="mt-2 ml-4 pl-4 border-l-2 border-purple-200 space-y-1">
                                                {category.subcategories.map((sub) => (
                                                    <Link
                                                        key={sub._id}
                                                        href={categorySlug === 'wordpress-plugins' ? `/plugins?category=${sub.slug}` : `/subcategory/${sub.slug}`}
                                                        className={`
                                                            block px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium
                                                            ${activeSubcategory === sub.slug 
                                                                ? 'bg-purple-100 text-purple-700 shadow-sm' 
                                                                : 'text-gray-600 hover:bg-gray-50 hover:text-purple-600'
                                                            }
                                                        `}
                                                        onClick={handleLinkClick}
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}

            {/* Mobile More Options Dropdown */}
            {activeDropdown === 'more' && (
                <div className="absolute top-full right-4 mt-2 w-48 bg-white/95 backdrop-blur-lg rounded-xl shadow-xl border border-gray-100 z-50 lg:hidden">
                    <div className="py-2">
                        <button className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200">
                            About Us
                        </button>
                        <button className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200">
                            Contact
                        </button>
                        <button className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-200">
                            Support
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;