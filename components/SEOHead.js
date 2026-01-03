import Head from 'next/head';
import { useRouter } from 'next/router';

export const SEOHead = ({
  title,
  description,
  keywords,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  noindex = false,
  structuredData = null,
  additionalMeta = []
}) => {
  const router = useRouter();
  const baseUrl = 'https://shop.foxbeep.com';
  const currentUrl = canonical || `${baseUrl}${router.asPath}`;
  const defaultOgImage = `${baseUrl}/images/logo_black.png`;
  
  // Ensure structuredData is always an array
  const schemaArray = Array.isArray(structuredData) ? structuredData : (structuredData ? [structuredData] : []);

  return (
    <Head>
      {/* Primary Meta Tags - Essential for SEO */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Author and Copyright Information */}
      <meta name="author" content="Foxbeep Digital Solutions" />
      <meta name="copyright" content="Foxbeep Digital Solutions" />
      <meta name="creator" content="Foxbeep Digital Solutions" />
      <meta name="publisher" content="Foxbeep Digital Solutions" />
      
      {/* Robots and Crawling Instructions */}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      <meta name="googlebot" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      <meta name="bingbot" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />
      <meta name="revisit-after" content="7 days" />
      <meta name="rating" content="General" />
      <meta name="distribution" content="global" />
      
      {/* Canonical URL - Important to avoid duplicate content */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Alternate Language Tags */}
      <link rel="alternate" hrefLang="en" href={currentUrl} />
      <link rel="alternate" hrefLang="ne" href={currentUrl.replace('en_US', 'ne_NP')} />
      <link rel="alternate" hrefLang="x-default" href={currentUrl} />
      
      {/* Favicon and App Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
      
      {/* Open Graph Meta Tags - Better social sharing */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage || defaultOgImage} />
      <meta property="og:image:alt" content="Foxbeep Digital Solutions" />
      <meta property="og:site_name" content="Foxbeep Digital Solutions Marketplace" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:locale:alternate" content="ne_NP" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={ogImage || defaultOgImage} />
      <meta name="twitter:image:alt" content="Foxbeep Digital Solutions" />
      <meta name="twitter:creator" content="@foxbeep" />
      <meta name="twitter:site" content="@foxbeep" />
      
      {/* Mobile Optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Foxbeep" />
      <meta name="theme-color" content="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="language" content="English" />
      <meta name="content-type" content="text/html; charset=utf-8" />
      <meta name="charset" charSet="UTF-8" />
      
      {/* Business Information and Contact */}
      <meta name="company" content="Foxbeep Digital Solutions" />
      <meta name="contact" content="admin@foxbeep.com" />
      <meta name="email" content="admin@foxbeep.com" />
      
      {/* Geo-Location Meta Tags */}
      <meta name="geo.placename" content="Nepal" />
      <meta name="geo.region" content="NP" />
      <meta name="geo.position" content="27.7172,85.3240" />
      <meta name="ICBM" content="27.7172,85.3240" />
      
      {/* Performance and Security */}
      <meta name="format-detection" content="telephone=no" />
      <meta name="format-detection" content="email=no" />
      <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
      <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      
      {/* DNS Prefetch for External Resources */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Sitemap Link */}
      <link rel="sitemap" type="application/xml" href={`${baseUrl}/sitemap.xml`} />
      
      {/* Feed/RSS Links */}
      <link rel="alternate" type="application/rss+xml" href={`${baseUrl}/feed.xml`} />
      
      {/* Additional custom meta tags passed as props */}
      {additionalMeta.map((meta, index) => (
        <meta key={index} {...meta} />
      ))}
      
      {/* Multiple Structured Data Schemas */}
      {schemaArray.map((schema, index) => (
        <script
          key={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema)
          }}
        />
      ))}
      
      {/* Organization Schema - Default */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": `${baseUrl}/#organization`,
            "name": "Foxbeep Digital Solutions",
            "url": baseUrl,
            "logo": {
              "@type": "ImageObject",
              "url": defaultOgImage,
              "width": 200,
              "height": 200
            },
            "image": defaultOgImage,
            "description": "Professional digital marketplace offering web design, graphic design, WordPress plugins, digital marketing, and custom development services.",
            "email": "admin@foxbeep.com",
            "telephone": "+977-XXXXXXXXXX",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Kathmandu",
              "addressLocality": "Kathmandu",
              "addressRegion": "Nepal",
              "postalCode": "44600",
              "addressCountry": "NP"
            },
            "foundingDate": "2020",
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Customer Service",
              "email": "admin@foxbeep.com",
              "availableLanguage": ["en", "ne"]
            },
            "sameAs": [
              "https://facebook.com/foxbeep",
              "https://twitter.com/foxbeep",
              "https://linkedin.com/company/foxbeep",
              "https://instagram.com/foxbeep",
              "https://foxbeep.com.np"
            ],
            "memberOf": {
              "@type": "Organization",
              "name": "Digital Service Providers Association"
            }
          })
        }}
      />
      
      {/* LocalBusiness Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": `${baseUrl}/#localbusiness`,
            "name": "Foxbeep Digital Solutions",
            "image": defaultOgImage,
            "description": "Digital services marketplace in Nepal",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Kathmandu",
              "addressLocality": "Kathmandu",
              "addressRegion": "Nepal",
              "addressCountry": "NP"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": "27.7172",
              "longitude": "85.3240"
            },
            "url": baseUrl,
            "email": "admin@foxbeep.com",
            "priceRange": "$",
            "telephone": "+977-XXXXXXXXXX",
            "openingHoursSpecification": {
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday", 
                "Saturday"
              ],
              "opens": "09:00", 
              "closes": "18:00"
            }
          })
        }}
      />
    </Head>
  );
};

export default SEOHead;
