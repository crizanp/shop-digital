# SEO Quick Reference Guide for Foxbeep

## 🚀 Quick Start

### Import SEOHead in Your Page:
```javascript
import SEOHead from '@/components/SEOHead';

const YourPage = () => {
  return (
    <>
      <SEOHead
        title="Your Page Title | Foxbeep"
        description="Your page description (150-160 chars)"
        keywords="keyword1, keyword2, keyword3"
        ogImage="https://shop.foxbeep.com/image.jpg"
        structuredData={yourSchema}
      />
      {/* Your content */}
    </>
  );
};
```

---

## 📝 Meta Tag Guidelines

### Title Tag
- **Length:** 50-60 characters
- **Format:** `[Primary Keyword] | Descriptive Text - Foxbeep`
- **Example:** `Web Design Services | Professional Solutions - Foxbeep`
- **Tips:** Include primary keyword at start, unique for each page

### Meta Description
- **Length:** 150-160 characters
- **Format:** Sentence describing page content with call-to-action
- **Example:** `Hire professional web designers on Foxbeep. Browse verified portfolio, compare prices, and get your project started today.`
- **Tips:** Include secondary keywords, compelling, clickable

### Keywords Meta Tag
- **Count:** 5-15 keywords
- **Format:** Comma-separated list
- **Example:** `web design, website design, web development, professional design, custom website`
- **Tips:** Include long-tail variations, reflect content

---

## 🏗️ URL Structure

```
Homepage:     /
Categories:   /category/[slug]
Subcategory:  /subcategory/[slug]
Products:     /package/[slug]
Plugins:      /plugins/[pluginId]
Specific:     /plugins/[pluginId]
```

---

## 🔍 Heading Structure

```html
<!-- Homepage/Landing Page -->
<h1>Featured Digital Services</h1>      <!-- Only one per page -->
  <h2>Explore Our Digital Services</h2> <!-- Section headings -->
    <h3>Service Category Name</h3>      <!-- Subsections -->

<!-- Product Page -->
<h1>Exact Product Name</h1>
  <h2>Product Features</h2>
  <h2>Pricing</h2>
  <h2>Customer Reviews</h2>
```

---

## 🎯 Keyword Placement Formula

For an article/service page targeting keyword "web design services":

- **Title:** Include keyword early - 15% impact
- **Meta Description:** Include keyword - 10% impact
- **H1:** Include exact/close match - 15% impact
- **First 100 words:** Include keyword 2-3 times - 10% impact
- **H2/H3 headers:** Include variations - 5% impact
- **Throughout content:** 0.5-2.5% keyword density - 20% impact
- **Image alt text:** Include keyword - 5% impact
- **Internal links:** Use keyword-rich anchor text - 10% impact

**Total Optimal Keyword Density: 0.5-2.5% of content**

---

## 🎨 Image SEO Checklist

For each image:
- [ ] File size < 200KB (compressed)
- [ ] Format: WebP with JPEG fallback
- [ ] Dimensions: 16:9 or 1:1 aspect ratio
- [ ] Alt text: Descriptive, 8-12 words
- [ ] File name: keyword-descriptive-filename.jpg
- [ ] Lazy loading: `loading="lazy"`
- [ ] Responsive: Multiple sizes for devices

**Example:**
```html
<img 
  src="/images/web-design-services.webp"
  alt="Professional web design services for businesses"
  loading="lazy"
  width="800"
  height="450"
/>
```

---

## 📱 Open Graph Tags Template

```javascript
{
  ogTitle: "Your SEO Title | Foxbeep",           // 65 chars max
  ogDescription: "Short description for social", // 110 chars max
  ogImage: "https://shop.foxbeep.com/image.jpg", // 1200x630px
  ogType: "website",                             // or "product", "article"
  ogUrl: "https://shop.foxbeep.com/page"
}
```

---

## 🐦 Twitter Card Template

```javascript
{
  twitterCard: "summary_large_image",
  twitterTitle: "Your Title",
  twitterDescription: "Your description",
  twitterImage: "https://shop.foxbeep.com/image.jpg",
  twitterCreator: "@foxbeep",
  twitterSite: "@foxbeep"
}
```

---

## 📊 Structured Data Templates

### Product Schema (For Services)
```javascript
{
  "@type": "Product",
  "name": "Service Name",
  "description": "Full description",
  "image": "https://shop.foxbeep.com/image.jpg",
  "price": "999",
  "priceCurrency": "USD",
  "rating": {
    "@type": "AggregateRating",
    "ratingValue": 4.5,
    "reviewCount": 25
  },
  "offers": {
    "@type": "Offer",
    "price": "999",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}
```

### FAQ Schema
```javascript
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is your question?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Your answer text here..."
      }
    }
  ]
}
```

### BreadcrumbList Schema
```javascript
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://shop.foxbeep.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Category",
      "item": "https://shop.foxbeep.com/category/name"
    }
  ]
}
```

---

## ✅ Pre-Launch SEO Checklist

### On-Page
- [ ] Unique title (50-60 chars)
- [ ] Unique description (150-160 chars)
- [ ] Primary keyword in title
- [ ] Primary keyword in H1
- [ ] Target keywords in content
- [ ] Proper heading hierarchy
- [ ] Image alt text on all images
- [ ] Internal links (3-5 per 1000 words)
- [ ] Keyword density 0.5-2.5%
- [ ] Content length > 300 words

### Technical
- [ ] Canonical URL set
- [ ] Mobile responsive
- [ ] Page speed > 90 Lighthouse
- [ ] SSL certificate (HTTPS)
- [ ] Sitemap created
- [ ] Robots.txt configured
- [ ] Meta tags complete
- [ ] Open Graph tags added
- [ ] Twitter Cards added
- [ ] Structured data valid

### SEO
- [ ] No keyword stuffing
- [ ] No duplicate content
- [ ] External links (authority)
- [ ] LSI keywords used
- [ ] Readability > 9th grade
- [ ] Fresh, unique content
- [ ] Update date added
- [ ] Author information
- [ ] Contact page linked
- [ ] Privacy policy linked

---

## 🚫 SEO Red Flags to Avoid

❌ **Content Issues:**
- Keyword stuffing (>3% density)
- Thin content (<300 words)
- Duplicate content (same title/desc)
- Auto-generated content
- Cloaking (different content to users vs bots)

❌ **Technical Issues:**
- Slow page speed (>3 seconds)
- Poor mobile experience
- Broken links (404s)
- Noindex on homepage
- Redirect chains
- Orphan pages (no links to them)

❌ **Link Issues:**
- Private Blog Networks (PBNs)
- Link exchanges for ranking
- Suspicious backlink sources
- Over-optimization of anchor text
- Links from unrelated content

---

## 📈 Monitoring & Maintenance

### Weekly
- [ ] Check Google Search Console for errors
- [ ] Monitor keyword rankings
- [ ] Check page speed

### Monthly
- [ ] Review traffic sources
- [ ] Check crawl errors
- [ ] Update outdated content
- [ ] Monitor competitor activity

### Quarterly
- [ ] Full site SEO audit
- [ ] Backlink analysis
- [ ] Content strategy review
- [ ] Technical SEO review

---

## 🔗 Internal Linking Strategy

### Homepage Links To:
- ✅ All major category pages
- ✅ Top 5 best-selling products
- ✅ FAQ page
- ✅ Blog/News section
- ✅ About us

### Category Links To:
- ✅ 5-10 top products in category
- ✅ Related categories
- ✅ Homepage (footer)
- ✅ FAQ

### Product Pages Link To:
- ✅ Related products (3-5)
- ✅ Category page
- ✅ Homepage (footer)
- ✅ FAQ (for common questions)

**Anchor Text:** Keyword-rich, natural language

---

## 🎓 SEO Copy Formula

### For Service Pages:

**Title:** [Action Verb] + [Service] + [Benefit/Location] + Brand
- ❌ Services
- ✅ Hire Professional Web Designers | Custom Website Design - Foxbeep

**Description:** Problem + Solution + CTA + Brand
- ❌ We offer web design services
- ✅ Need a stunning website? Hire expert designers on Foxbeep. Browse portfolios, compare prices & hire today. $99-5000.

**H1:** [Action] + [Service] + [Benefit]
- ❌ Web Design
- ✅ Professional Web Design Services for Growing Businesses

---

## 💡 Quick Wins (Easy to Implement)

1. **Update meta descriptions** - 15 min
   - Add unique 150-160 char descriptions
   - Increase CTR by 20%

2. **Optimize images** - 30 min
   - Add descriptive alt text
   - Compress images
   - Improve Core Web Vitals

3. **Internal linking** - 20 min
   - Add 3-5 contextual links per page
   - Improve crawlability

4. **Fix broken links** - 15 min
   - Check GSC for 404s
   - Redirect or fix

5. **Update dated content** - 1 hour
   - Add current date
   - Refresh statistics
   - Signal freshness

---

## 🎯 Success Metrics

### Track These:
- Organic traffic growth (month-over-month)
- Keyword rankings (top 100 keywords)
- Click-through rate (CTR) from SERPs
- Conversion rate from organic
- Pages per session
- Bounce rate
- Average session duration

### Targets:
- **3 months:** 15-25% traffic increase
- **6 months:** 50-100% traffic increase
- **12 months:** 200%+ traffic increase

---

## 📞 Need Help?

**SEO Configuration:**
- File: `lib/seo-config.js`
- Update: Phone number, Analytics IDs, social links

**Add to Pages:**
- Import: `import SEOHead from '@/components/SEOHead';`
- Use helpers: `import { generateProductMeta } from '@/lib/seo-helpers';`

**Validation:**
- Use: `validateSEO()` function to check compliance
- Fix warnings before publishing

---

**Last Updated:** January 3, 2026
**Version:** 1.0
**Status:** Ready to Use ✅

---

For complete documentation, see `SEO_IMPLEMENTATION_COMPLETE.md`
