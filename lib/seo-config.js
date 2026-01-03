/**
 * SEO Configuration File
 * Centralized SEO settings for the entire application
 */

export const SEO_CONFIG = {
  // Base URLs
  BASE_URL: 'https://shop.foxbeep.com',
  MAIN_SITE_URL: 'https://foxbeep.com.np',
  
  // Site Information
  SITE_NAME: 'Foxbeep Digital Solutions',
  COMPANY_NAME: 'Foxbeep Digital Solutions',
  COMPANY_EMAIL: 'admin@foxbeep.com',
  COMPANY_PHONE: '+977-XXXXXXXXXX',
  
  // Location Information
  LOCATION: {
    CITY: 'Kathmandu',
    REGION: 'Nepal',
    COUNTRY_CODE: 'NP',
    LATITUDE: '27.7172',
    LONGITUDE: '85.3240',
    POSTAL_CODE: '44600',
    STREET_ADDRESS: 'Kathmandu',
  },
  
  // Social Media
  SOCIAL_LINKS: {
    FACEBOOK: 'https://facebook.com/foxbeep',
    TWITTER: 'https://twitter.com/foxbeep',
    INSTAGRAM: 'https://instagram.com/foxbeep',
    LINKEDIN: 'https://linkedin.com/company/foxbeep',
    YOUTUBE: 'https://youtube.com/foxbeep',
  },
  
  // Logo and Images
  LOGO: '/images/logo_black.png',
  LOGO_WIDTH: 200,
  LOGO_HEIGHT: 200,
  DEFAULT_OG_IMAGE: '/images/logo_black.png',
  
  // Default Meta Tags
  DEFAULT_TITLE: 'Digital Services Marketplace | Foxbeep',
  DEFAULT_DESCRIPTION: 'Foxbeep is a leading digital marketplace offering web development, graphic design, WordPress plugins, digital marketing, and custom app development services.',
  DEFAULT_KEYWORDS: 'web design, graphic design, WordPress plugins, digital marketing, web development, freelance services, digital services',
  
  // Language Settings
  LANGUAGE: 'en',
  LANGUAGES: {
    EN: 'en_US',
    NE: 'ne_NP',
  },
  
  // Search Engines
  GOOGLE_SITE_VERIFICATION: 'your-google-verification-code',
  BING_SITE_VERIFICATION: 'your-bing-verification-code',
  
  // Analytics
  GOOGLE_ANALYTICS_ID: 'G-XXXXXXXXXX',
  
  // Sitemap
  SITEMAP_URL: '/sitemap.xml',
  
  // RSS Feed
  RSS_FEED_URL: '/feed.xml',
  
  // Contact Information Schema
  contactPoint: {
    '@type': 'ContactPoint',
    'contactType': 'Customer Service',
    'email': 'admin@foxbeep.com',
    'availableLanguage': ['en', 'ne'],
  },
  
  // Address Schema
  address: {
    '@type': 'PostalAddress',
    'streetAddress': 'Kathmandu',
    'addressLocality': 'Kathmandu',
    'addressRegion': 'Nepal',
    'postalCode': '44600',
    'addressCountry': 'NP',
  },
};

/**
 * Generate canonical URL
 */
export const getCanonicalUrl = (path = '') => {
  const basePath = path.startsWith('/') ? path : `/${path}`;
  return `${SEO_CONFIG.BASE_URL}${basePath}`;
};

/**
 * Generate Open Graph meta object
 */
export const getOGMeta = (title, description, image = null) => {
  return {
    ogTitle: title,
    ogDescription: description,
    ogImage: image || SEO_CONFIG.DEFAULT_OG_IMAGE,
    ogType: 'website',
  };
};

/**
 * Generate Schema.org structured data
 */
export const generateSchemaData = (type, data = {}) => {
  const baseSchema = {
    '@context': 'https://schema.org',
    '@type': type,
    'name': data.name || SEO_CONFIG.SITE_NAME,
    'url': data.url || SEO_CONFIG.BASE_URL,
  };
  
  return { ...baseSchema, ...data };
};

/**
 * Generate WebSite Schema
 */
export const generateWebsiteSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': SEO_CONFIG.SITE_NAME,
    'url': SEO_CONFIG.BASE_URL,
    'description': SEO_CONFIG.DEFAULT_DESCRIPTION,
    'image': SEO_CONFIG.DEFAULT_OG_IMAGE,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${SEO_CONFIG.BASE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
};

/**
 * Generate Organization Schema
 */
export const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SEO_CONFIG.BASE_URL}/#organization`,
    'name': SEO_CONFIG.COMPANY_NAME,
    'url': SEO_CONFIG.BASE_URL,
    'logo': {
      '@type': 'ImageObject',
      'url': SEO_CONFIG.LOGO,
      'width': SEO_CONFIG.LOGO_WIDTH,
      'height': SEO_CONFIG.LOGO_HEIGHT,
    },
    'image': SEO_CONFIG.DEFAULT_OG_IMAGE,
    'description': SEO_CONFIG.DEFAULT_DESCRIPTION,
    'email': SEO_CONFIG.COMPANY_EMAIL,
    'telephone': SEO_CONFIG.COMPANY_PHONE,
    'address': SEO_CONFIG.address,
    'contactPoint': SEO_CONFIG.contactPoint,
    'sameAs': Object.values(SEO_CONFIG.SOCIAL_LINKS),
    'foundingDate': '2020',
  };
};

/**
 * Generate LocalBusiness Schema
 */
export const generateLocalBusinessSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SEO_CONFIG.BASE_URL}/#localbusiness`,
    'name': SEO_CONFIG.COMPANY_NAME,
    'image': SEO_CONFIG.DEFAULT_OG_IMAGE,
    'description': SEO_CONFIG.DEFAULT_DESCRIPTION,
    'address': SEO_CONFIG.address,
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': SEO_CONFIG.LOCATION.LATITUDE,
      'longitude': SEO_CONFIG.LOCATION.LONGITUDE,
    },
    'url': SEO_CONFIG.BASE_URL,
    'email': SEO_CONFIG.COMPANY_EMAIL,
    'telephone': SEO_CONFIG.COMPANY_PHONE,
    'priceRange': '$',
  };
};

/**
 * Generate BreadcrumbList Schema
 */
export const generateBreadcrumbSchema = (breadcrumbs) => {
  const items = breadcrumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'name': crumb.name,
    'item': crumb.url,
  }));
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items,
  };
};

/**
 * Generate Product Schema
 */
export const generateProductSchema = (product) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.name || product.title,
    'description': product.description,
    'image': product.image,
    'url': product.url,
    'price': product.price,
    'priceCurrency': product.currency || 'USD',
    'rating': {
      '@type': 'AggregateRating',
      'ratingValue': product.rating || 5,
      'reviewCount': product.reviewCount || 0,
    },
    'offers': {
      '@type': 'Offer',
      'price': product.price,
      'priceCurrency': product.currency || 'USD',
      'availability': 'https://schema.org/InStock',
      'url': product.url,
    },
  };
};

/**
 * Generate FAQ Schema
 */
export const generateFAQSchema = (faqs) => {
  const mainEntity = faqs.map(faq => ({
    '@type': 'Question',
    'name': faq.question,
    'acceptedAnswer': {
      '@type': 'Answer',
      'text': faq.answer,
    },
  }));
  
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': mainEntity,
  };
};

/**
 * Generate AggregateOffer Schema
 */
export const generateAggregateOfferSchema = (offers) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateOffer',
    'priceCurrency': 'USD',
    'availability': 'https://schema.org/InStock',
    'offerCount': offers.length,
    'offers': offers.map(offer => ({
      '@type': 'Offer',
      'name': offer.name,
      'price': offer.price,
      'priceCurrency': 'USD',
      'availability': 'https://schema.org/InStock',
    })),
  };
};

export default SEO_CONFIG;
