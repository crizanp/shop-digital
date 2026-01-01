import React, { useState } from 'react';
import { Search, Menu, X, ChevronDown, ChevronRight, Star, Clock, TrendingUp, Package } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useCurrency } from '../contexts/CurrencyContext';

const ModernMarketplace = ({ initialFeaturedPackages = [] }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredPackages, setFeaturedPackages] = useState(initialFeaturedPackages);
  const { currencyInfo, exchangeRates } = useCurrency();

  const getPackageLink = (pkg) => {
    // Check multiple possible category field variations
    const category = pkg.category || pkg.categorySlug || pkg.categoryName || '';
    const categoryLower = category.toLowerCase();
    
    // Check if it's a WordPress plugin
    if (categoryLower.includes('wordpress') && categoryLower.includes('plugin')) {
      return `/plugins/${pkg.slug}`;
    }
    
    return `/package/${pkg.slug}`;
  };

  const convertPrice = (price) => {
    // Handle both numeric and string prices
    const numericPrice = typeof price === 'string'
      ? parseFloat(price.replace(/[^0-9.]/g, ''))
      : parseFloat(price);

    // Assume prices are stored in USD, convert to selected currency
    const convertedPrice = numericPrice * exchangeRates[currencyInfo.currency];

    // Format with currency symbol
    return `${currencyInfo.symbol}${convertedPrice.toFixed(2)}`;
  };

  const categories = [
    {
      id: 1,
      name: 'Video Editing',
      slug: 'video-editing',
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      icon: '🎬',
      description: 'Professional video editing services for any project'
    },
    {
      id: 2,
      name: 'Web Development',
      slug: 'website-development',
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      icon: '💻',
      description: 'Build stunning websites with expert developers',
      subcategories: [
        { name: 'E-commerce Websites', slug: 'ecommerce-website' },
        { name: 'Business Websites', slug: 'business-website' },
        { name: 'WordPress Development', slug: 'wordpress-development' }
      ]
    },
    {
      id: 3,
      name: 'Graphic Design',
      slug: 'graphic-design',
      color: 'from-pink-400 to-pink-600',
      bgColor: 'bg-pink-50',
      icon: '🎨',
      description: 'Creative design solutions that bring your vision to life',
      subcategories: [
        { name: 'Logo Design', slug: 'logo-design' },
        { name: 'Social Media Graphics', slug: 'social-media-graphics' },
        { name: 'Print Design', slug: 'print-design' },
        { name: 'Brand Identity', slug: 'brand-identity' }
      ]
    },
    {
      id: 4,
      name: 'WordPress Plugins',
      slug: 'wordpress-plugins',
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      icon: '🔌',
      description: 'Enhance your WordPress site with premium plugins',
      subcategories: [
        { name: 'Payment Gateway', slug: 'payment-gateway' },
        { name: 'E-commerce', slug: 'ecommerce' },
        { name: 'SEO Tools', slug: 'seo-tools' },
        { name: 'Security', slug: 'security' }
      ]
    },
    {
      id: 5,
      name: 'Digital Marketing',
      slug: 'digital-marketing',
      color: 'from-orange-400 to-orange-600',
      bgColor: 'bg-orange-50',
      icon: '📈',
      description: 'Grow your business with strategic marketing services',
      subcategories: [
        { name: 'SEO Services', slug: 'seo-services' },
        { name: 'Social Media Management', slug: 'social-media-management' },
        { name: 'PPC Advertising', slug: 'ppc-advertising' }
      ]
    },
    {
      id: 6,
      name: 'Writing & Content',
      slug: 'writing-content',
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-yellow-50',
      icon: '✍️',
      description: 'Quality content that engages and converts'
    },
    {
      id: 7,
      name: 'Mobile App Development',
      slug: 'mobile-app-development',
      color: 'from-teal-400 to-teal-600',
      bgColor: 'bg-teal-50',
      icon: '📱',
      description: 'Custom mobile apps for iOS and Android platforms'
    },
    {
      id: 8,
      name: 'AI and Automation',
      slug: 'ai-automation',
      color: 'from-indigo-400 to-indigo-600',
      bgColor: 'bg-indigo-50',
      icon: '🤖',
      description: 'Implement AI solutions to streamline your business'
    },
    {
      id: 9,
      name: 'Branding Services',
      slug: 'branding-services',
      color: 'from-red-400 to-red-600',
      bgColor: 'bg-red-50',
      icon: '🎨',
      description: 'Complete branding solutions for your business'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modern Navbar */}
      <Navbar />

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl text-black">Featured Products</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredPackages.map((pkg) => (
            <Link 
              key={pkg._id || pkg.id} 
              href={getPackageLink(pkg)} 
              className="h-full"
            >
              <div
                className="h-full cursor-pointer group bg-white overflow-hidden shadow-sm 
                   transition-all duration-300 border p-2 border-gray-500
                   flex flex-col"
              >
                {/* Image Section */}
                <div className="relative overflow-hidden h-48 w-full">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover 
                       transition-transform duration-500 
                       group-hover:scale-105"
                  />
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <h3 className="text-lg text-center text-gray-900 mb-4 group-hover:underline">
                    {pkg.title}
                  </h3>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                      {pkg.reviews ? (
                        <>
                          <div className="flex items-center">
                            <Star size={16} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-sm font-semibold text-gray-900 ml-1">
                              {pkg.rating || 5}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            ({pkg.reviews})
                          </span>
                        </>
                      ) : null}
                    </div>

                    <div className="text-xl font-bold text-gray-900">
                      {convertPrice(pkg.price)}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Explore Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl px-2 text-gray-900 mb-8">Explore categories</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link 
              href={category.slug === 'wordpress-plugins' ? `/plugins` : `/category/${category.slug}`} 
              key={category.id}
            >
              <div
                className={`${category.bgColor} rounded-2xl p-8 transition-all duration-300 cursor-pointer group border border-gray-100`}
              >
                <div className="flex items-center justify-center gap-2 mb-4 group-hover:text-gray-700">
                  <div className="text-xl text-black group-hover:underline">
                    {category.name}
                  </div>
                  <ChevronRight
                    className="text-gray-400"
                    size={24}
                  />
                </div>

                <p className="text-sm text-gray-600">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-gray-300 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Video Editing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Web Development</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Graphic Design</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 Foxbeep Marketplace. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ModernMarketplace;

export async function getServerSideProps() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/packages?featured=true&limit=4`);

    if (!response.ok) {
      throw new Error('Failed to fetch featured packages');
    }

    const data = await response.json();
    const featuredPackages = data.packages || [];

    return {
      props: {
        initialFeaturedPackages: featuredPackages
      }
    };
  } catch (error) {
    console.error('Error fetching featured packages:', error);
    return {
      props: {
        initialFeaturedPackages: []
      }
    };
  }
}