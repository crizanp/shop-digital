/**
 * SEO Helper Functions
 * Utilities for implementing SEO across the entire application
 */

import { SEO_CONFIG } from './seo-config';

/**
 * Generate meta tags for a page
 */
export const generateMeta = (options = {}) => {
  const {
    title = SEO_CONFIG.DEFAULT_TITLE,
    description = SEO_CONFIG.DEFAULT_DESCRIPTION,
    keywords = SEO_CONFIG.DEFAULT_KEYWORDS,
    canonical = SEO_CONFIG.BASE_URL,
    ogTitle,
    ogDescription,
    ogImage = SEO_CONFIG.DEFAULT_OG_IMAGE,
    ogType = 'website',
    twitterHandle = '@foxbeep',
    noindex = false,
    lang = 'en'
  } = options;

  return {
    title,
    description,
    keywords,
    canonical,
    ogTitle: ogTitle || title,
    ogDescription: ogDescription || description,
    ogImage,
    ogType,
    twitterHandle,
    noindex,
    lang
  };
};

/**
 * Generate slug from string
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Truncate text to specific length
 */
export const truncateText = (text, length = 160) => {
  if (text.length <= length) return text;
  return text.substring(0, length).trimEnd() + '...';
};

/**
 * Generate readable URL friendly text
 */
export const urlFriendly = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

/**
 * Extract first 100 words for meta description
 */
export const getMetaDescription = (text, length = 160) => {
  const trimmed = text.substring(0, length).trim();
  return trimmed.endsWith('.') ? trimmed : trimmed + '...';
};

/**
 * Generate breadcrumb schema from path
 */
export const generateBreadcrumbs = (pathname) => {
  const parts = pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    {
      name: 'Home',
      url: SEO_CONFIG.BASE_URL
    }
  ];

  let currentPath = '';
  parts.forEach((part) => {
    currentPath += `/${part}`;
    const name = part
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
    
    breadcrumbs.push({
      name,
      url: `${SEO_CONFIG.BASE_URL}${currentPath}`
    });
  });

  return breadcrumbs;
};

/**
 * Validate SEO meta data
 */
export const validateSEO = (meta) => {
  const errors = [];
  const warnings = [];

  // Title validation
  if (!meta.title) errors.push('Title is missing');
  if (meta.title && meta.title.length < 30) warnings.push('Title is too short (<30 chars)');
  if (meta.title && meta.title.length > 60) warnings.push('Title is too long (>60 chars)');

  // Description validation
  if (!meta.description) errors.push('Meta description is missing');
  if (meta.description && meta.description.length < 120) warnings.push('Description is too short (<120 chars)');
  if (meta.description && meta.description.length > 160) warnings.push('Description is too long (>160 chars)');

  // Keywords validation
  if (!meta.keywords) warnings.push('Keywords are missing');
  if (meta.keywords && meta.keywords.split(',').length > 15) warnings.push('Too many keywords (>15)');

  // OG Image validation
  if (!meta.ogImage) warnings.push('OG image is missing');

  // Canonical validation
  if (!meta.canonical) warnings.push('Canonical URL is missing');

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Generate structured data for common types
 */
export const generateStructuredData = (type, data) => {
  const baseStructure = {
    '@context': 'https://schema.org',
    '@type': type,
  };

  const structures = {
    Article: {
      ...baseStructure,
      headline: data.title,
      description: data.description,
      image: data.image,
      author: {
        '@type': 'Organization',
        'name': SEO_CONFIG.COMPANY_NAME
      },
      publisher: {
        '@type': 'Organization',
        'name': SEO_CONFIG.COMPANY_NAME,
        'logo': {
          '@type': 'ImageObject',
          'url': SEO_CONFIG.LOGO
        }
      },
      datePublished: data.publishedDate,
      dateModified: data.modifiedDate
    },

    BlogPosting: {
      ...baseStructure,
      headline: data.title,
      description: data.description,
      image: data.image,
      author: {
        '@type': 'Person',
        'name': data.author || SEO_CONFIG.COMPANY_NAME
      },
      datePublished: data.publishedDate,
      dateModified: data.modifiedDate
    },

    NewsArticle: {
      ...baseStructure,
      headline: data.title,
      description: data.description,
      image: data.image,
      datePublished: data.publishedDate,
      dateModified: data.modifiedDate
    },

    VideoObject: {
      ...baseStructure,
      name: data.title,
      description: data.description,
      thumbnailUrl: data.thumbnail,
      uploadDate: data.uploadDate,
      duration: data.duration,
      contentUrl: data.videoUrl
    },

    Review: {
      ...baseStructure,
      name: data.title,
      reviewRating: {
        '@type': 'Rating',
        'ratingValue': data.rating,
        'bestRating': 5,
        'worstRating': 1
      },
      author: {
        '@type': 'Person',
        'name': data.reviewer
      },
      reviewBody: data.reviewText
    }
  };

  return structures[type] || baseStructure;
};

/**
 * Optimize image for SEO
 */
export const optimizeImageSEO = (imagePath, altText) => {
  return {
    src: imagePath,
    alt: altText,
    title: altText,
    loading: 'lazy',
    decoding: 'async'
  };
};

/**
 * Generate JSON-LD script tag
 */
export const generateJSONLD = (schema) => {
  return {
    __html: JSON.stringify(schema)
  };
};

/**
 * Check keyword density
 */
export const calculateKeywordDensity = (text, keyword) => {
  const words = text.toLowerCase().split(/\s+/).length;
  const matches = text.toLowerCase().match(new RegExp(keyword.toLowerCase(), 'g'));
  const keywordCount = matches ? matches.length : 0;
  
  return {
    density: ((keywordCount / words) * 100).toFixed(2),
    count: keywordCount,
    percentage: `${((keywordCount / words) * 100).toFixed(2)}%`,
    optimal: keywordCount > 0 && keywordCount / words >= 0.005 && keywordCount / words <= 0.025
  };
};

/**
 * Generate reading time estimate
 */
export const calculateReadingTime = (text) => {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  
  return {
    minutes,
    seconds: Math.round(((words % wordsPerMinute) / wordsPerMinute) * 60),
    text: `${minutes} min read`
  };
};

/**
 * Generate canonical URL with trailing slash handling
 */
export const getCanonicalURL = (path, options = {}) => {
  const {
    baseUrl = SEO_CONFIG.BASE_URL,
    trailingSlash = false
  } = options;

  let url = baseUrl + path;
  
  if (trailingSlash && !url.endsWith('/')) {
    url += '/';
  } else if (!trailingSlash && url.endsWith('/') && url !== baseUrl + '/') {
    url = url.slice(0, -1);
  }

  return url;
};

/**
 * Generate dynamic meta tags for product page
 */
export const generateProductMeta = (product) => {
  return {
    title: `${product.name} | ${product.price} - Buy on Foxbeep`,
    description: `${product.name} on Foxbeep. ${product.shortDescription || ''} Price: ${product.price}. Rating: ${product.rating || 5}/5.`,
    keywords: `${product.name}, ${product.category}, buy ${product.name}, ${product.name} price`,
    image: product.image,
    price: product.price,
    currency: product.currency || 'USD',
    rating: product.rating || 5,
    reviews: product.reviewCount || 0
  };
};

/**
 * Generate dynamic meta tags for category page
 */
export const generateCategoryMeta = (category) => {
  return {
    title: `${category.name} Services | Hire Professional ${category.name} - Foxbeep`,
    description: `Browse ${category.itemCount || 50}+ professional ${category.name} services on Foxbeep. ${category.description}`,
    keywords: `${category.name}, ${category.name} services, hire ${category.name}, professional ${category.name}`,
    image: category.image || SEO_CONFIG.DEFAULT_OG_IMAGE
  };
};

/**
 * Get all SEO information for a page in one call
 */
export const getCompleteSEOData = (options = {}) => {
  return {
    meta: generateMeta(options),
    validation: validateSEO(generateMeta(options)),
    breadcrumbs: options.pathname ? generateBreadcrumbs(options.pathname) : []
  };
};

export default {
  generateMeta,
  generateSlug,
  truncateText,
  urlFriendly,
  getMetaDescription,
  generateBreadcrumbs,
  validateSEO,
  generateStructuredData,
  optimizeImageSEO,
  generateJSONLD,
  calculateKeywordDensity,
  calculateReadingTime,
  getCanonicalURL,
  generateProductMeta,
  generateCategoryMeta,
  getCompleteSEOData
};
