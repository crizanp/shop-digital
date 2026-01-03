/**
 * SEO Meta Information for Foxbeep
 * Quick reference for all SEO elements
 */

export const HOMEPAGE_SEO = {
  title: "Digital Services Marketplace | Web Design, WordPress Plugins & More - Foxbeep",
  description: "Foxbeep is a leading digital marketplace offering web development, graphic design, WordPress plugins, digital marketing, video editing, and custom app development services. Browse 1000+ quality services from professional providers.",
  keywords: "web design, graphic design, WordPress plugins, digital marketing, web development, video editing, content writing, mobile app development, digital services, freelance services, SEO services, social media management, AI automation, branding services, e-commerce solutions",
  
  // Open Graph
  og: {
    title: "Foxbeep Digital Services Marketplace - Professional Solutions",
    description: "Discover and purchase premium digital services including web design, graphic design, WordPress plugins, and digital marketing solutions on Foxbeep marketplace.",
    image: "https://shop.foxbeep.com/images/logo_black.png",
    type: "website",
    url: "https://shop.foxbeep.com"
  },
  
  // Twitter
  twitter: {
    card: "summary_large_image",
    title: "Foxbeep Digital Services Marketplace - Professional Solutions",
    description: "Discover and purchase premium digital services including web design, graphic design, WordPress plugins, and digital marketing solutions.",
    image: "https://shop.foxbeep.com/images/logo_black.png",
    creator: "@foxbeep",
    site: "@foxbeep"
  },
  
  // Robots Meta
  robots: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  googlebot: "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  
  // Canonical
  canonical: "https://shop.foxbeep.com",
  
  // Language
  language: "en",
  
  // Author
  author: "Foxbeep Digital Solutions",
  copyright: "Foxbeep Digital Solutions"
};

export const CATEGORY_PAGE_SEO = (category) => ({
  title: `${category.name} Services | Professional ${category.name} Solutions - Foxbeep`,
  description: `Hire top-rated ${category.name} professionals on Foxbeep. Browse verified ${category.name} services, compare prices, and hire trusted experts for your project.`,
  keywords: `${category.name}, ${category.name} services, hire ${category.name}, professional ${category.name}, ${category.name} provider, ${category.name} solutions`,
  
  og: {
    title: `${category.name} Services on Foxbeep Marketplace`,
    description: `Discover professional ${category.name} services on Foxbeep. Find and hire verified ${category.name} experts.`,
    image: `https://shop.foxbeep.com${category.image || '/images/logo_black.png'}`,
    type: "website"
  }
});

export const PRODUCT_PAGE_SEO = (product) => ({
  title: `${product.title} | ${product.price} - Buy on Foxbeep`,
  description: `${product.title} on Foxbeep. ${product.description || 'Professional digital service'} | Rating: ${product.rating || 5}/5 | Price: ${product.price}`,
  keywords: `${product.title}, ${product.category}, ${product.title} price, buy ${product.title}, ${product.title} reviews`,
  
  og: {
    title: product.title,
    description: product.description || `Professional ${product.category} service on Foxbeep`,
    image: `https://shop.foxbeep.com${product.image}`,
    type: "product",
    url: `https://shop.foxbeep.com/package/${product.slug}`
  },
  
  // Product specific schema
  schema: {
    '@type': 'Product',
    'name': product.title,
    'description': product.description,
    'image': `https://shop.foxbeep.com${product.image}`,
    'brand': {
      '@type': 'Brand',
      'name': 'Foxbeep'
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': product.rating || 5,
      'reviewCount': product.reviews || 0
    },
    'offers': {
      '@type': 'Offer',
      'url': `https://shop.foxbeep.com/package/${product.slug}`,
      'priceCurrency': 'USD',
      'price': product.price,
      'availability': 'https://schema.org/InStock'
    }
  }
});

export const PLUGIN_PAGE_SEO = (plugin) => ({
  title: `${plugin.name} WordPress Plugin - Download Free/Premium - Foxbeep`,
  description: `Download ${plugin.name} - Professional WordPress plugin for ${plugin.category}. Features: ${plugin.features || 'advanced functionality'}. Install today!`,
  keywords: `${plugin.name}, WordPress plugin, ${plugin.category} plugin, download ${plugin.name}, ${plugin.name} features`,
  
  og: {
    title: `${plugin.name} - WordPress Plugin`,
    description: `Powerful WordPress plugin: ${plugin.name}. Enhance your site functionality.`,
    image: `https://shop.foxbeep.com${plugin.image}`,
    type: "product"
  }
});

/**
 * SEO Best Practices
 */
export const SEO_BEST_PRACTICES = {
  TITLE_LENGTH: {
    MIN: 30,
    OPTIMAL: 50,
    MAX: 60
  },
  
  DESCRIPTION_LENGTH: {
    MIN: 120,
    OPTIMAL: 150,
    MAX: 160
  },
  
  H1_GUIDELINES: {
    count: "One per page",
    include_keyword: true,
    length: "50-60 characters",
    importance: "Critical for SEO"
  },
  
  IMAGE_OPTIMIZATION: {
    file_format: "WebP with JPEG fallback",
    compression: "90% quality minimum",
    alt_text: "Descriptive, keyword-relevant",
    max_size: "200KB for web",
    dimensions: "Optimized aspect ratios"
  },
  
  CONTENT_OPTIMIZATION: {
    keyword_density: "0.5-2.5%",
    word_count: "Minimum 300 words",
    readability: "9th grade level",
    LSI_keywords: "Include semantic variations",
    multimedia: "Include images, videos"
  },
  
  INTERNAL_LINKING: {
    anchor_text: "Descriptive, keyword-rich",
    link_depth: "Max 3 clicks from homepage",
    link_ratio: "3-5 internal links per 1000 words",
    target_pages: "Important pages",
    rel_attribute: "Use 'rel' wisely"
  },
  
  METADATA: {
    viewport: "width=device-width, initial-scale=1",
    charset: "UTF-8",
    language: "Proper HTML lang attribute",
    robots: "Appropriate robots directives",
    canonical: "All duplicate pages"
  }
};

/**
 * Red Flags to Avoid
 */
export const SEO_RED_FLAGS = [
  "Keyword stuffing (>3% keyword density)",
  "Duplicate content",
  "Thin content (<300 words)",
  "Auto-generated content",
  "Cloaking (showing different content to users vs search engines)",
  "Hidden text or links",
  "Private link networks (PBNs)",
  "Article spinning",
  "Exact match domains without quality content",
  "Suspicious backlinks",
  "Redirects to irrelevant content",
  "Slow page load times (>3 seconds)",
  "Poor mobile experience",
  "Intrusive interstitials",
  "Misleading/clickbait titles"
];

/**
 * SEO Tools to Use
 */
export const SEO_TOOLS = {
  RESEARCH: [
    "Google Keyword Planner",
    "Semrush",
    "Ahrefs",
    "Moz",
    "Ubersuggest",
    "AnswerThePublic"
  ],
  
  OPTIMIZATION: [
    "Google Search Console",
    "Google PageSpeed Insights",
    "GTmetrix",
    "Screaming Frog",
    "Yoast SEO",
    "Rank Math"
  ],
  
  ANALYTICS: [
    "Google Analytics 4",
    "Bing Webmaster Tools",
    "Clicky",
    "Matomo",
    "Hotjar"
  ],
  
  BACKLINK_ANALYSIS: [
    "Semrush Backlink Analytics",
    "Ahrefs Backlink Checker",
    "Majestic",
    "Monitor Backlinks"
  ]
};

/**
 * SEO Checklist for Launch
 */
export const LAUNCH_CHECKLIST = {
  BEFORE_LAUNCH: [
    "❌ Meta tags optimized (title, description, keywords)",
    "❌ Canonical URLs set up",
    "❌ Schema markup validated",
    "❌ Open Graph tags configured",
    "❌ Robots.txt created",
    "❌ Sitemap created and linked",
    "❌ 404 page customized",
    "❌ Internal linking structure planned",
    "❌ Images optimized",
    "❌ Page speed optimized (>90 Lighthouse score)",
    "❌ Mobile responsiveness tested",
    "❌ SSL/HTTPS enabled",
    "❌ Breadcrumb navigation added",
    "❌ Contact information visible"
  ],
  
  AFTER_LAUNCH: [
    "❌ Submit sitemap to Google Search Console",
    "❌ Submit sitemap to Bing Webmaster Tools",
    "❌ Set up Google Analytics 4",
    "❌ Set up Google Search Console",
    "❌ Request URL indexing in GSC",
    "❌ Monitor crawl errors",
    "❌ Set up alerts for issues",
    "❌ Create content calendar",
    "❌ Start link building campaign",
    "❌ Monitor keyword rankings",
    "❌ Analyze user behavior",
    "❌ Plan content updates"
  ]
};

export default {
  HOMEPAGE_SEO,
  CATEGORY_PAGE_SEO,
  PRODUCT_PAGE_SEO,
  PLUGIN_PAGE_SEO,
  SEO_BEST_PRACTICES,
  SEO_RED_FLAGS,
  SEO_TOOLS,
  LAUNCH_CHECKLIST
};
