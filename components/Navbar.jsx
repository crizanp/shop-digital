"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useSmoothScroll, handleHashScroll } from '../hook/scrolling';

// Categories data imported from external file
const categories = [
  {
    "id": 1,
    "name": "Design Services",
    "hasSubcategories": false,
    "slug": "design-services"
  },
  {
    "id": 2,
    "name": "Website Services",
    "hasSubcategories": false,
    "slug": "website-services"
  },
  {
    "id": 3,
    "name": "Website Maintenance",
    "hasSubcategories": false,
    "slug": "website-maintenance"
  },
  {
    "id": 4,
    "name": "Digital Marketing",
    "hasSubcategories": false,
    "slug": "digital-marketing"
  },
  {
    "id": 5,
    "name": "Social Media Management",
    "hasSubcategories": false,
    "slug": "social-media-management"
  }
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    useSmoothScroll();
    handleHashScroll();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Transform the categories data to match the navItems structure
    const navItems = categories.map(category => ({
        name: category.name,
        href: `/category/${category.id}`,
        hasDropdown: category.hasSubcategories,
        id: category.id
    }));
    
    const toggleDropdown = (index) => {
        if (activeDropdown === index) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(index);
        }
    };

    const closeAllDropdowns = () => {
        setActiveDropdown(null);
    };

    return (
        <nav
            className={`fixed top-0 left-0 w-full bg-black z-50 text-white pr-6 xl:pr:0 transition-all duration-300 : ''}`}
            onMouseLeave={closeAllDropdowns}
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center h-16 md:h-18 lg:h-20">
                    {/* Logo */}
                    <div className="flex items-left">
                        <Link href="/" className="flex items-left" onClick={closeAllDropdowns}>
                            <div className="relative w-32 h-12 md:w-36 md:h-14 lg:w-40 lg:h-30">
                                <Image
                                    src="/logo.png"
                                    alt="Logo"
                                    fill
                                    className="object-contain brightness-150 invert"
                                    priority
                                />
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation - hidden on mobile and lg, shown on xl and up */}
                    <div className="hidden xl:flex items-center justify-end space-x-1 md:space-x-2 lg:space-x-4 xl:space-x-6 flex-1">
                        {navItems.map((item, index) => (
                            <div key={item.id} className="relative group">
                                <Link
                                    href={item.href}
                                    className={`font-medium text-xs md:text-sm lg:text-base whitespace-nowrap hover:text-purple-400 transition-colors duration-200 flex items-center py-2 px-1 md:px-2 ${item.active ? 'text-purple-400' : 'text-gray-300'}`}
                                    onMouseEnter={() => item.hasDropdown && setActiveDropdown(index)}
                                >
                                    {item.name}
                                    {item.hasDropdown && (
                                        <ChevronDown size={14} className="ml-1 transition-transform group-hover:rotate-180 duration-200" />
                                    )}
                                </Link>

                                {item.hasDropdown && activeDropdown === index && (
                                    <div className="fixed left-0 w-full bg-gray-900 border-t border-gray-800 shadow-lg shadow-black/50 z-20"
                                        style={{ top: '5rem' }}>
                                        <div className="container mx-auto py-4 md:py-6 lg:py-8 px-4">
                                            {/* Placeholder for dropdown content */}
                                            <p className="text-sm text-gray-400">Subcategories for {item.name} would appear here</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Mobile menu button - visible until xl breakpoint */}
                    <div className="xl:hidden flex items-center">
                        <button
                            className="text-gray-300 hover:text-purple-400 focus:outline-none"
                            onClick={() => setIsOpen(!isOpen)}
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
                            {navItems.map((item, index) => (
                                <li key={item.id} className="py-1">
                                    {item.hasDropdown ? (
                                        <div>
                                            <button
                                                className={`flex items-center justify-between w-full py-2 font-medium hover:text-purple-400 focus:outline-none ${item.active ? 'text-purple-400' : 'text-gray-300'}`}
                                                onClick={() => toggleDropdown(index)}
                                            >
                                                {item.name}
                                                <ChevronDown
                                                    size={16}
                                                    className={`transition-transform duration-200 ease-in-out ${activeDropdown === index ? 'transform rotate-180' : ''}`}
                                                />
                                            </button>
                                            {activeDropdown === index && (
                                                <div className="pl-4 mt-2 border-l-2 border-purple-400">
                                                    {/* Placeholder for dropdown content */}
                                                    <p className="text-sm text-gray-400 py-2">Subcategories for {item.name} would appear here</p>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className={`block py-2 font-medium hover:text-purple-400 ${item.active ? 'text-purple-400' : 'text-gray-300'}`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;