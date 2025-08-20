"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Menu, X, MoreVertical } from 'lucide-react';

const Navbar = ({ activeCategory, activeSubcategory }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const categories = [
        { _id: 'cat-1', name: 'Video Editing', slug: 'video-editing', hasSubcategories: false, subcategories: [] },
        {
            _id: 'cat-2',
            name: 'Web Development',
            slug: 'website-development',
            hasSubcategories: true,
            subcategories: [
                { _id: 'sub-2-1', name: 'E-commerce Websites', slug: 'ecommerce-website' },
                { _id: 'sub-2-2', name: 'Business Websites', slug: 'business-website' },
                { _id: 'sub-2-3', name: 'Wordpress Websites', slug: 'wordpress-development' },
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
    };

    return (
        <nav className="fixed top-0 left-0 w-full backdrop-blur-sm z-50 transition-all duration-300" style={{ backgroundColor: '#f2e4ff' }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">

                {/* Left: Show category (mobile) */}
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 lg:hidden">
                    <button
                        className="flex items-center space-x-2 bg-white border border-gray-200 px-3 py-2 rounded-md text-sm font-medium shadow-sm hover:bg-gray-50 text-black"
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
                        <Menu size={16} className="text-black" />
                        <span>Show category</span>
                    </button>
                </div>

                <div className="flex justify-between items-center h-16">
                    {/* Desktop logo (left) */}
                    <div className="flex-shrink-0 hidden lg:block ">
                        <Link href="/" onClick={() => handleLinkClick('/')}> 
                            <div className="relative w-32 h-10 sm:w-36 sm:h-12 md:w-40 md:h-14">
                                <Image src="/images/logo_black.png" alt="Foxbeep" fill className="object-contain" priority />
                            </div>
                        </Link>
                    </div>

                    {/* Mobile centered logo */}
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 lg:hidden ml-6">
                        <Link href="/" onClick={() => handleLinkClick('/')}> 
                            <div className="relative w-36 h-12 sm:w-40 sm:h-14">
                                <Image src="/images/logo_black.png" alt="Foxbeep" fill className="object-contain" priority />
                            </div>
                        </Link>
                    </div>

                    {/* Desktop nav */}
                    <div className="hidden lg:flex items-center space-x-1">
                        {categories.map((category, index) => {
                            const categorySlug = category.slug || category.name?.toLowerCase().replace(/\s+/g, '-');
                            const hasSub = category.hasSubcategories && category.subcategories?.length > 0;
                            return (
                                <div key={category._id} className="relative" onMouseEnter={() => hasSub && setActiveDropdown(index)} onMouseLeave={() => setActiveDropdown(null)}>
                                    <Link
                                        href={categorySlug === 'wordpress-plugins' ? '/plugins' : `/category/${categorySlug}`}
                                        className={`flex items-center px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${activeCategory === categorySlug ? 'bg-purple-600 text-white' : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'}`}
                                        onClick={() => handleLinkClick(categorySlug === 'wordpress-plugins' ? '/plugins' : `/category/${categorySlug}`)}
                                        style={{ fontSize: 'clamp(12px, 1.2vw, 14px)' }}
                                    >
                                        {category.name}
                                        {hasSub && <ChevronDown size={16} className={`ml-1 transition-transform duration-200 ${activeDropdown === index ? 'rotate-180' : ''}`} />}
                                    </Link>

                                    {hasSub && activeDropdown === index && (
                                        <div className="absolute top-full left-0 pt-2 w-64 z-50" onMouseEnter={() => setActiveDropdown(index)} onMouseLeave={() => setActiveDropdown(null)}>
                                            <div className="bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                                                {category.subcategories.map((sub) => (
                                                    <Link
                                                        key={sub._id}
                                                        href={categorySlug === 'wordpress-plugins' ? `/plugins?category=${sub.slug}` : `/subcategory/${sub.slug}`}
                                                        className={`block px-4 py-2 text-xs sm:text-sm transition-colors duration-200 ${activeSubcategory === sub.slug ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'}`}
                                                        onClick={() => handleLinkClick(categorySlug === 'wordpress-plugins' ? `/plugins?category=${sub.slug}` : `/subcategory/${sub.slug}`)}
                                                        style={{ fontSize: 'clamp(11px, 1.0vw, 13px)' }}
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

                    {/* Right: mobile toggle for navbar menu */}
                    <div className="lg:hidden absolute right-4 top-1/2 transform -translate-y-1/2 z-50">
                        <button
                            className="p-2 text-gray-700 hover:text-purple-600 hover:bg-gray-100 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                            onClick={() => setIsOpen(v => !v)}
                            aria-expanded={isOpen}
                            aria-label={isOpen ? 'Close menu' : 'Open menu'}
                        >
                            {isOpen ? <X size={22} /> : <MoreVertical size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu overlay (doesn't push navbar) */}
                {isOpen && (
                    <div className="lg:hidden absolute left-4 right-4 top-full z-40 transition-all duration-300 ease-in-out">
                        <div className="bg-white border-t border-gray-200 shadow-md py-2 space-y-1 rounded-lg overflow-hidden">
                            {categories.map((category, index) => {
                                const hasSub = category.hasSubcategories && category.subcategories?.length > 0;
                                return (
                                    <div key={category._id}>
                                        <div className="flex items-center">
                                            <Link
                                                href={category.slug === 'wordpress-plugins' ? '/plugins' : `/category/${category.slug}`}
                                                className={`flex-1 px-4 py-2 text-xs sm:text-sm rounded-md transition-colors ${activeCategory === category.slug ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
                                                onClick={() => handleLinkClick(category.slug === 'wordpress-plugins' ? '/plugins' : `/category/${category.slug}`)}
                                                style={{ fontSize: 'clamp(10px, 1.0vw, 13px)' }}
                                            >
                                                {category.name}
                                            </Link>
                                            {hasSub && (
                                                <button className="p-2 text-gray-500 hover:text-purple-600" onClick={() => setActiveDropdown(activeDropdown === index ? null : index)} aria-label={activeDropdown === index ? 'Collapse' : 'Expand'}>
                                                    <ChevronDown size={16} className={`${activeDropdown === index ? 'rotate-180' : ''} transition-transform`} />
                                                </button>
                                            )}
                                        </div>

                                        {hasSub && activeDropdown === index && (
                                            <div className="ml-4 mt-1 space-y-1 border-l-2 border-purple-200 pl-3">
                                                {category.subcategories.map((sub) => (
                                                    <Link
                                                        key={sub._id}
                                                        href={category.slug === 'wordpress-plugins' ? `/plugins?category=${sub.slug}` : `/subcategory/${sub.slug}`}
                                                        className={`block px-3 py-2 rounded-md transition-colors text-xs sm:text-sm ${activeSubcategory === sub.slug ? 'bg-purple-100 text-purple-700 font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-purple-600'}`}
                                                        onClick={() => handleLinkClick(category.slug === 'wordpress-plugins' ? `/plugins?category=${sub.slug}` : `/subcategory/${sub.slug}`)}
                                                        style={{ fontSize: 'clamp(10px, 0.9vw, 12px)' }}
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
                )}
            </div>
        </nav>
    );
};

export default Navbar;
