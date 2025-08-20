import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from './Navbar';
import Footer from './home/footer';

const Layout = ({
  children,
  title = 'Foxbeep — Creative Video & Media Services',
  description = 'Foxbeep offers professional video, animation, and social media content services to help brands tell their story with clarity and style.',
  keywords = 'software development, custom software, web development, mobile apps, AI solutions, blockchain, cloud development, UI/UX design, IT services',
  ogImage = '/images/logo.jpg',
  canonical = '',
  structuredData = null,
}) => {
  const router = useRouter();
  const canonicalUrl = canonical || process.env.NEXT_PUBLIC_SITE_URL;
  
  // Check if current route is an admin page
  const isAdminPage = router.pathname.startsWith('/admin');

  const defaultStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Build with Purpose",
    "url": process.env.NEXT_PUBLIC_SITE_URL,
    "logo": `${process.env.NEXT_PUBLIC_SITE_URL}/images/branding/logo.png`,
    "description": description,
    "sameAs": [
      "https://www.linkedin.com/company/your-company",
      "https://twitter.com/your-company",
      "https://github.com/your-company"
    ],
    "contactPoint": [{
      "@type": "ContactPoint",
      "telephone": "+1-800-123-4567",
      "contactType": "Customer Service",
      "areaServed": "Worldwide",
      "availableLanguage": "English"
    }]
  };

  return (
    <>
      <Head>
        {/* Basic Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />

        {/* Canonical URL */}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonicalUrl} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />

        {/* Favicons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/images/favicon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon.png" />
        <link rel="manifest" href="/images/favicon.png" />
        <link rel="mask-icon" href="/images/favicon.png" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
  <meta name="theme-color" content="#6d28d9" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData || defaultStructuredData),
          }}
        />
      </Head>

      {/* Conditionally render Navbar - hide on admin pages */}
      {!isAdminPage && <Navbar />}
      
      {/* Adjust main padding based on whether navbar is shown */}
      <main className={isAdminPage ? '' : 'pt-10 bg-white'}>
        {children}
      </main>
      
      {/* You might also want to hide footer on admin pages */}
      {!isAdminPage && <Footer />}
    </>
  );
};

export default Layout;