# SEO Implementation Examples

Complete working examples for implementing SEO across different page types in your Foxbeep marketplace.

---

## 1. Homepage Example (Already Implemented)

**File:** `pages/index.js`

```javascript
import SEOHead from '@/components/SEOHead';

export default function Homepage({ initialFeaturedPackages }) {
  const homePageSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Foxbeep Digital Solutions Marketplace",
    "url": "https://shop.foxbeep.com",
    "description": "Buy and sell digital services",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://shop.foxbeep.com/search?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <>
      <SEOHead
        title="Digital Services Marketplace | Web Design, WordPress Plugins & More - Foxbeep"
        description="Foxbeep is a leading digital marketplace offering web development, graphic design, WordPress plugins, digital marketing, and more."
        keywords="web design, graphic design, WordPress plugins, digital marketing, web development, video editing"
        canonical="https://shop.foxbeep.com"
        ogTitle="Foxbeep Digital Services Marketplace"
        ogDescription="Browse 1000+ quality services from professional providers."
        ogImage="https://shop.foxbeep.com/images/logo_black.png"
        ogType="website"
        structuredData={homePageSchema}
      />
      {/* Page Content */}
    </>
  );
}
```

---

## 2. Category Page Example

**File:** `pages/category/[categorySlug].js`

```javascript
import SEOHead from '@/components/SEOHead';
import { generateCategoryMeta } from '@/lib/seo-helpers';

export default function CategoryPage({ category, products }) {
  const meta = generateCategoryMeta(category);

  const categorySchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": category.name,
    "description": category.description,
    "url": `https://shop.foxbeep.com/category/${category.slug}`,
    "image": category.image,
    "mainEntity": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "offerCount": products.length,
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <>
      <SEOHead
        title={meta.title}
        description={meta.description}
        keywords={meta.keywords}
        canonical={`https://shop.foxbeep.com/category/${category.slug}`}
        ogTitle={`${category.name} Services on Foxbeep`}
        ogDescription={meta.description}
        ogImage={meta.image}
        ogType="website"
        structuredData={categorySchema}
        additionalMeta={[
          { name: 'robots', content: 'index, follow' }
        ]}
      />
      <div>
        <h1>{category.name}</h1>
        <p>{category.description}</p>
        {/* Products grid */}
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  // Fetch category data
  const category = await fetchCategory(params.categorySlug);
  const products = await fetchProducts({ category: params.categorySlug });

  return {
    props: { category, products },
    revalidate: 3600 // Revalidate every hour
  };
}
```

---

## 3. Product/Package Page Example

**File:** `pages/package/[slug].js`

```javascript
import SEOHead from '@/components/SEOHead';
import { generateProductSchema } from '@/lib/seo-config';

export default function ProductPage({ product }) {
  const schema = generateProductSchema({
    name: product.title,
    description: product.description,
    price: product.price,
    rating: product.rating,
    reviewCount: product.reviews,
    image: product.image,
    url: `https://shop.foxbeep.com/package/${product.slug}`,
    currency: 'USD'
  });

  const breadcrumbs = [
    { name: 'Home', url: 'https://shop.foxbeep.com' },
    { name: product.category, url: `https://shop.foxbeep.com/category/${product.category}` },
    { name: product.title, url: `https://shop.foxbeep.com/package/${product.slug}` }
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };

  return (
    <>
      <SEOHead
        title={`${product.title} | $${product.price} - Buy on Foxbeep`}
        description={`${product.title} on Foxbeep. Professional ${product.category} service. Rating: ${product.rating}/5 | ${product.reviews} reviews. Price: $${product.price}`}
        keywords={`${product.title}, ${product.category}, buy ${product.title}, ${product.category} services, ${product.title} price`}
        canonical={`https://shop.foxbeep.com/package/${product.slug}`}
        ogTitle={product.title}
        ogDescription={product.description}
        ogImage={`https://shop.foxbeep.com${product.image}`}
        ogType="product"
        structuredData={[schema, breadcrumbSchema]}
        additionalMeta={[
          { property: 'product:price:amount', content: product.price },
          { property: 'product:price:currency', content: 'USD' },
          { property: 'product:category', content: product.category },
          { property: 'product:availability', content: 'in stock' }
        ]}
      />
      <div>
        <h1>{product.title}</h1>
        <p className="price">${product.price}</p>
        <div className="rating">Rating: {product.rating}/5 ({product.reviews} reviews)</div>
        <p className="description">{product.description}</p>
        {/* Product details */}
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const product = await fetchProduct(params.slug);

  return {
    props: { product },
    revalidate: 3600
  };
}
```

---

## 4. Blog/Article Page Example

**File:** `pages/blog/[slug].js`

```javascript
import SEOHead from '@/components/SEOHead';

export default function BlogPost({ article }) {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.excerpt,
    "image": article.featuredImage,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "datePublished": article.publishedDate,
    "dateModified": article.modifiedDate,
    "mainEntity": {
      "@type": "Article",
      "headline": article.title,
      "image": article.featuredImage,
      "datePublished": article.publishedDate,
      "dateModified": article.modifiedDate,
      "author": {
        "@type": "Person",
        "name": article.author
      }
    }
  };

  return (
    <>
      <SEOHead
        title={`${article.title} | Foxbeep Blog`}
        description={article.excerpt}
        keywords={article.tags.join(', ')}
        canonical={`https://shop.foxbeep.com/blog/${article.slug}`}
        ogTitle={article.title}
        ogDescription={article.excerpt}
        ogImage={article.featuredImage}
        ogType="article"
        structuredData={articleSchema}
        additionalMeta={[
          { property: 'article:published_time', content: article.publishedDate },
          { property: 'article:modified_time', content: article.modifiedDate },
          { property: 'article:author', content: article.author },
          ...article.tags.map(tag => ({
            property: 'article:tag',
            content: tag
          }))
        ]}
      />
      <article>
        <h1>{article.title}</h1>
        <time dateTime={article.publishedDate}>
          Published: {new Date(article.publishedDate).toLocaleDateString()}
        </time>
        <p className="author">By {article.author}</p>
        <div className="content" dangerouslySetInnerHTML={{ __html: article.content }} />
      </article>
    </>
  );
}
```

---

## 5. FAQ Page Example

**File:** `pages/faq.js`

```javascript
import SEOHead from '@/components/SEOHead';
import { generateFAQSchema } from '@/lib/seo-config';

export default function FAQPage({ faqs }) {
  const faqSchema = generateFAQSchema(faqs);

  return (
    <>
      <SEOHead
        title="Frequently Asked Questions | Foxbeep"
        description="Common questions about Foxbeep digital services marketplace. Find answers to your questions about buying, selling, and managing services."
        keywords="FAQ, frequently asked questions, help, support, how to, guide"
        canonical="https://shop.foxbeep.com/faq"
        ogTitle="Foxbeep FAQ - Get Answers to Common Questions"
        ogDescription="Browse our comprehensive FAQ section for answers to common questions."
        ogType="website"
        structuredData={faqSchema}
      />
      <div>
        <h1>Frequently Asked Questions</h1>
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <h2>{faq.question}</h2>
            <p>{faq.answer}</p>
          </div>
        ))}
      </div>
    </>
  );
}
```

---

## 6. Plugin Page Example

**File:** `pages/plugins/[pluginId].js`

```javascript
import SEOHead from '@/components/SEOHead';

export default function PluginPage({ plugin }) {
  const pluginSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": plugin.name,
    "description": plugin.description,
    "url": `https://shop.foxbeep.com/plugins/${plugin.id}`,
    "image": plugin.image,
    "applicationCategory": "CMS Plugin",
    "operatingSystem": "WordPress",
    "offers": {
      "@type": "Offer",
      "price": plugin.price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": plugin.rating,
      "reviewCount": plugin.reviews
    }
  };

  return (
    <>
      <SEOHead
        title={`${plugin.name} WordPress Plugin - Download - Foxbeep`}
        description={`Download ${plugin.name} WordPress plugin. ${plugin.shortDescription} Features: ${plugin.features}. Ratings: ${plugin.rating}/5.`}
        keywords={`${plugin.name}, WordPress plugin, ${plugin.category}, download plugin, ${plugin.name} download`}
        canonical={`https://shop.foxbeep.com/plugins/${plugin.id}`}
        ogTitle={`${plugin.name} - WordPress Plugin`}
        ogDescription={plugin.description}
        ogImage={plugin.image}
        ogType="product"
        structuredData={pluginSchema}
        additionalMeta={[
          { name: 'software-version', content: plugin.version },
          { name: 'software-category', content: 'WordPress Plugin' }
        ]}
      />
      <div>
        <h1>{plugin.name}</h1>
        <p className="category">{plugin.category} Plugin</p>
        <p className="rating">Rating: {plugin.rating}/5 ({plugin.reviews} reviews)</p>
        <h2>Features</h2>
        <ul>
          {plugin.features.split(',').map((feature, i) => (
            <li key={i}>{feature.trim()}</li>
          ))}
        </ul>
        {/* Plugin details */}
      </div>
    </>
  );
}
```

---

## 7. Using Helper Functions

**Example in any component:**

```javascript
import SEOHead from '@/components/SEOHead';
import {
  generateMeta,
  generateProductMeta,
  generateCategoryMeta,
  validateSEO
} from '@/lib/seo-helpers';

// For products
const productMeta = generateProductMeta({
  name: 'Web Design Service',
  description: 'Professional web design',
  price: 500,
  rating: 4.8,
  reviewCount: 25,
  image: '/images/service.jpg'
});

// Validate SEO
const validation = validateSEO(productMeta);
if (!validation.isValid) {
  console.error(validation.errors);
}
console.warn(validation.warnings);

// Use in component
<SEOHead
  title={productMeta.title}
  description={productMeta.description}
  keywords={productMeta.keywords}
  ogImage={productMeta.image}
/>
```

---

## 8. Custom Meta Tags Example

**Adding custom meta tags:**

```javascript
<SEOHead
  title="Your Title"
  description="Your description"
  additionalMeta={[
    // Pinterest
    { name: 'pinterest', content: 'nopin' },
    
    // Business hours
    { name: 'business:hours', content: 'Mon-Fri 9am-5pm' },
    
    // Price range
    { property: 'price:amount', content: '99' },
    { property: 'price:currency', content: 'USD' },
    
    // Product details
    { property: 'product:category', content: 'Services' },
    { property: 'product:availability', content: 'in stock' },
    
    // Custom analytics
    { name: 'analytics:custom_event', content: 'page_load' }
  ]}
/>
```

---

## 9. Dynamic Meta Tags Example

**Creating dynamic meta for product listings:**

```javascript
export default function ProductListing({ products }) {
  return (
    <>
      <SEOHead
        title={`Shop ${products.length}+ Services | Foxbeep`}
        description={`Browse and buy ${products.length} professional digital services on Foxbeep marketplace.`}
        keywords={products.slice(0, 5).map(p => p.category).join(', ')}
      />
      
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </>
  );
}
```

---

## 10. Multi-Schema Page Example

**Page with multiple structured data:**

```javascript
const multiSchema = [
  organizationSchema,
  breadcrumbSchema,
  productSchema,
  reviewSchema
];

<SEOHead
  title="Product Title"
  description="Product description"
  structuredData={multiSchema}  // Pass array of schemas
/>
```

---

## 11. SEO Configuration Override

**Overriding default SEO config:**

```javascript
import { SEO_CONFIG } from '@/lib/seo-config';

// Use custom base URL for specific page
const customCanonical = `${SEO_CONFIG.BASE_URL}/custom-path`;

<SEOHead
  title="Custom Title"
  description="Custom description"
  canonical={customCanonical}
/>
```

---

## 12. Image Optimization Example

**Optimizing images for SEO:**

```javascript
import { optimizeImageSEO } from '@/lib/seo-helpers';

const imageProps = optimizeImageSEO(
  '/images/web-design-services.jpg',
  'Professional web design services for small businesses'
);

<img {...imageProps} />
```

---

## Quick Copy-Paste Examples

### Basic Page:
```javascript
import SEOHead from '@/components/SEOHead';

export default function MyPage() {
  return (
    <>
      <SEOHead
        title="Page Title | Foxbeep"
        description="Page description here"
        keywords="keyword1, keyword2, keyword3"
      />
      <h1>Page Title</h1>
      {/* Content */}
    </>
  );
}
```

### Product Page:
```javascript
import SEOHead from '@/components/SEOHead';
import { generateProductMeta } from '@/lib/seo-helpers';

export default function ProductPage({ product }) {
  const meta = generateProductMeta(product);
  
  return (
    <>
      <SEOHead {...meta} />
      <h1>{product.name}</h1>
      {/* Content */}
    </>
  );
}
```

### Category Page:
```javascript
import SEOHead from '@/components/SEOHead';
import { generateCategoryMeta } from '@/lib/seo-helpers';

export default function CategoryPage({ category }) {
  const meta = generateCategoryMeta(category);
  
  return (
    <>
      <SEOHead {...meta} />
      <h1>{category.name}</h1>
      {/* Content */}
    </>
  );
}
```

---

## Validation Examples

### Validate before publishing:
```javascript
import { validateSEO } from '@/lib/seo-helpers';

const meta = {
  title: "Your Title",
  description: "Your description",
  keywords: "keyword1, keyword2"
};

const result = validateSEO(meta);

if (result.isValid) {
  console.log("✅ SEO looks good!");
} else {
  console.error("❌ Errors:", result.errors);
}

if (result.warnings.length > 0) {
  console.warn("⚠️ Warnings:", result.warnings);
}
```

---

## Testing SEO

### Using browser console:
```javascript
// Check meta tags
document.querySelector('title').textContent
document.querySelector('meta[name="description"]').content
document.querySelector('meta[name="keywords"]').content

// Check schema
JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent)
```

### Using online tools:
1. [Google Rich Results Test](https://search.google.com/test/rich-results)
2. [Schema.org Validator](https://validator.schema.org/)
3. [Open Graph Preview](https://www.opengraphcheck.com/)
4. [Lighthouse Audit](chrome://settings/lighthouse)

---

These examples cover all common page types and SEO scenarios in your marketplace!
