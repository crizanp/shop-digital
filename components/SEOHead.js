import Head from 'next/head';
import { useRouter } from 'next/router';

const SEOHead = ({
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
  const baseUrl = 'https://foxbeep.com';
  const currentUrl = canonical || `${baseUrl}${router.asPath}`;
  const defaultOgImage = `${baseUrl}/images/logo_black.png`;

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content="Foxbeep Digital Solutions" />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage || defaultOgImage} />
      <meta property="og:image:alt" content="Foxbeep Digital Solutions Logo" />
      <meta property="og:site_name" content="Foxbeep Digital Solutions" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={currentUrl} />
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={ogImage || defaultOgImage} />
      <meta name="twitter:image:alt" content="Foxbeep Digital Solutions Logo" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="rating" content="General" />
      <meta name="distribution" content="web" />
      
      {/* Business Information */}
      <meta name="company" content="Foxbeep Digital Solutions" />
      <meta name="contact" content="admin@foxbeep.com" />
      
      {/* Additional custom meta tags */}
      {additionalMeta.map((meta, index) => (
        <meta key={index} {...meta} />
      ))}
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
      
      {/* Default Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Foxbeep Digital Solutions",
            "url": baseUrl,
            "logo": defaultOgImage,
            "description": "Professional digital solutions including web design, graphic design, WordPress plugins, digital marketing, and more.",
            "contactPoint": {
              "@type": "ContactPoint",
              "email": "admin@foxbeep.com",
              "contactType": "customer service"
            },
            "sameAs": [
              "https://facebook.com/foxbeep",
              "https://twitter.com/foxbeep",
              "https://linkedin.com/company/foxbeep"
            ],
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "category": "Digital Services"
            }
          })
        }}
      />
    </Head>
  );
};

export default SEOHead;
