import React, { useRef, useState } from 'react';
import { Search, Menu, X, ChevronDown, ChevronRight, Star, Clock, TrendingUp, Package, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import SEOHead from '@/components/SEOHead';
import { useCurrency } from '../contexts/CurrencyContext';
import Footer from '@/components/Footer';
import { PackageCardSkeleton, CategoryCardSkeleton } from '@/components/SkeletonLoader';

const ModernMarketplace = ({ initialFeaturedPackages = [] }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredPackages, setFeaturedPackages] = useState(initialFeaturedPackages);
  const { currencyInfo, exchangeRates } = useCurrency();
  const sliderRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const getPackageLink = (pkg) => {
    const category = pkg.category || pkg.categorySlug || pkg.categoryName || '';
    const categoryLower = category.toLowerCase();

    if (categoryLower.includes('wordpress') && categoryLower.includes('plugin')) {
      return `/plugins/${pkg.slug}`;
    }

    return `/package/${pkg.slug}`;
  };

  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === featuredPackages.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? featuredPackages.length - 1 : prev - 1
    );
  };

  const convertPrice = (price) => {
    const numericPrice = typeof price === 'string' 
      ? parseFloat(price.replace(/[^0-9.]/g, '')) 
      : parseFloat(price);
    
    const convertedPrice = numericPrice * exchangeRates[currencyInfo.currency];
    
    return `${currencyInfo.symbol}${convertedPrice.toFixed(2)}`;
  };

  // Array of light background colors for featured cards
  const featuredCardColors = [
    'bg-blue-50',
    'bg-purple-50',
    'bg-pink-50',
    'bg-green-50',
    'bg-yellow-50',
    'bg-orange-50',
    'bg-teal-50',
    'bg-indigo-50'
  ];

  const categories = [
    {
      id: 1,
      name: 'Media and commercial',
      slug: 'media-commercial',
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

  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Foxbeep Digital Services Marketplace",
    "url": "https://shop.foxbeep.com",
    "description": "Buy and sell digital services - website development, graphic design, WordPress plugins, digital marketing, and more",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://shop.foxbeep.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "image": "https://shop.foxbeep.com/images/logo_black.png",
    "author": {
      "@type": "Organization",
      "name": "Foxbeep Digital Solutions",
      "logo": "https://shop.foxbeep.com/images/logo_black.png",
      "url": "https://shop.foxbeep.com",
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "email": "admin@foxbeep.com",
        "availableLanguage": ["en", "ne"]
      },
      "sameAs": [
        "https://facebook.com/foxbeeptech",
        "https://twitter.com/foxbeeptech",
        "https://linkedin.com/company/foxbeeptech",
        "https://instagram.com/foxbeeptech"
      ]
    },
    "aggregateOffer": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "offerCount": 1000
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://shop.foxbeep.com"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What services does Foxbeep offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Foxbeep offers a wide range of digital services including web development, graphic design, WordPress plugins, digital marketing, video editing, content writing, mobile app development, and AI automation solutions."
        }
      },
      {
        "@type": "Question",
        "name": "How do I purchase services from Foxbeep?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Browse our marketplace, select the service you need, add it to your cart, and proceed to checkout. You can pay using various payment methods."
        }
      },
      {
        "@type": "Question",
        "name": "What payment methods do you accept?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We accept credit cards, debit cards, bank transfers, and various digital payment methods."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer refunds?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, we offer refunds within 30 days of purchase if you are not satisfied with the service. Please contact our customer support for more details."
        }
      }
    ]
  };

  return (
    <>
      <SEOHead
        title="Digital Services Marketplace | Website Development, Digital Marketing, Media and commercial - Foxbeep"
        description="Foxbeep is a leading digital marketplace offering web development, graphic design, WordPress plugins, digital marketing, video editing, and custom app development services. Browse 1000+ quality services from professional providers."
        keywords="web design, graphic design, WordPress plugins, digital marketing, web development, video editing, content writing, mobile app development, digital services, freelance services, SEO services, social media management, AI automation, branding services, e-commerce solutions"
        canonical="https://shop.foxbeep.com"
        ogTitle="Foxbeep Digital Services Marketplace - Professional Solutions"
        ogDescription="Discover and purchase premium digital services including web design, graphic design, WordPress plugins, and digital marketing solutions on Foxbeep marketplace."
        ogImage="https://shop.foxbeep.com/images/logo_black.png"
        ogType="website"
        structuredData={[homePageSchema, breadcrumbSchema, faqSchema]}
        additionalMeta={[
          { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
          { name: 'theme-color', content: '#000000' },
          { name: 'apple-mobile-web-app-capable', content: 'yes' },
          { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
          { name: 'format-detection', content: 'telephone=no' },
          { property: 'og:locale', content: 'en_US' },
          { property: 'og:locale:alternate', content: 'ne_NP' },
          { name: 'geo.placename', content: 'Nepal' },
          { name: 'geo.region', content: 'NP' },
          { name: 'ICBM', content: '27.7172,85.3240' }
        ]}
      />

      <div className="min-h-screen bg-gray-50">
        <Navbar />

        {/* Featured Products - Responsive Slider/Grid */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-2xl px-2 text-black font-semibold">Featured Digital Services</h2>
          </div>

          {/* Mobile Slider */}
          <div className="block md:hidden relative">
            <div className="overflow-hidden">
              <div
                ref={sliderRef}
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredPackages && featuredPackages.length > 0 ? (
                  featuredPackages.map((pkg, index) => (
                    <div key={pkg._id || pkg.id} className="w-full flex-shrink-0 px-2">
                      <Link href={getPackageLink(pkg)}>
                        <div className={`${featuredCardColors[index % featuredCardColors.length]} rounded-xl overflow-hidden border border-gray-400 transition-all duration-300`}>
                          {/* Image Section - Square */}
                          <div className="relative w-full aspect-square bg-white/30 overflow-hidden">
                            {pkg.images && pkg.images.length > 0 ? (
                              <img
                                src={pkg.images[0]}
                                alt={pkg.title}
                                className="w-full h-full object-cover"
                              />
                            ) : pkg.image ? (
                              <img
                                src={pkg.image}
                                alt={pkg.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-16 h-16 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Content Section */}
                          <div className="p-5">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 min-h-[3.5rem]">
                              {pkg.title}
                            </h3>
                            <div className="text-xl font-bold text-gray-800">
                              {convertPrice(pkg.price)}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))
                ) : (
                  <PackageCardSkeleton count={4} />
                )}
              </div>
            </div>

            {/* Slider Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-white cursor-pointer rounded-full p-2 shadow-lg hover:bg-gray-100 border border-gray-900 transition-colors z-10"
              aria-label="Previous slide"
            >
              <ChevronLeft size={24} className="text-gray-900" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-white cursor-pointer rounded-full p-2 shadow-lg hover:bg-gray-100 border border-gray-900 transition-colors z-10"
              aria-label="Next slide"
            >
              <ChevronRight size={24} className="text-gray-900" />
            </button>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 px-2">
            {featuredPackages && featuredPackages.length > 0 ? (
              featuredPackages.map((pkg, index) => (
                <Link key={pkg._id || pkg.id} href={getPackageLink(pkg)}>
                  <div className={`${featuredCardColors[index % featuredCardColors.length]} rounded-xl overflow-hidden border border-gray-400 transition-all duration-300 hover:scale-[1.02] h-full flex flex-col`}>
                    {/* Image Section - Square */}
                    <div className="relative w-full aspect-square bg-black/70 overflow-hidden">
                      {pkg.images && pkg.images.length > 0 ? (
                        <img
                          src={pkg.images[0]}
                          alt={pkg.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      ) : pkg.image ? (
                        <img
                          src={pkg.image}
                          alt={pkg.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-20 h-20 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <h3 className="text-lg text-black mb-3 line-clamp-2 min-h-[3.5rem] hover:underline">
                        {pkg.title}
                      </h3>
                      <div className="text-xl font-bold text-gray-800">
                        {convertPrice(pkg.price)}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <PackageCardSkeleton count={4} />
            )}
          </div>
        </section>

        {/* Explore Categories */}
        <section className="max-w-7xl mx-auto px-4 pb-8 pt-4" aria-label="Service Categories">
          <h2 className="text-2xl md:text-2xl px-2 text-black font-semibold">Explore Our Digital Services</h2>
          <p className="text-transparent px-2 py-2">Choose from a wide range of professional services tailored to your needs</p>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 auto-rows-fr">
            {categories && categories.length > 0 ? (
              categories.map((category) => (
                <Link
                  href={category.slug === 'wordpress-plugins' ? `/plugins` : `/category/${category.slug}`}
                  key={category.id}
                >
                  <div
                    className={`${category.bgColor} h-full rounded-2xl p-6 
                      transition-all duration-300 cursor-pointer group 
                      border border-gray-400 flex items-center justify-center`}
                  >
                    <div className="flex items-center justify-center gap-2 text-center">
                      <span className="text-sm sm:text-lg text-black group-hover:underline">
                        {category.name}
                      </span>
                      <ChevronRight className="text-gray-900" size={12} />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <CategoryCardSkeleton count={9} />
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}

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