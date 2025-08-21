import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
              <Head>
          {/* DNS Prefetch for external resources */}
          <link rel="dns-prefetch" href="//fonts.googleapis.com" />
          <link rel="dns-prefetch" href="//www.google-analytics.com" />
          
          {/* Preconnect to external domains */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          
          {/* Font optimization */}
          <link 
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
            rel="stylesheet"
            media="print"
            onLoad="this.media='all'"
          />
          <noscript>
            <link 
              href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
              rel="stylesheet"
            />
          </noscript>
          
          {/* PWA Manifest */}
          <link rel="manifest" href="/manifest.json" />
          
          {/* Favicon and icons */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/images/favicon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon.png" />
          
          {/* Theme color */}
          <meta name="theme-color" content="#6d28d9" />
          <meta name="msapplication-TileColor" content="#6d28d9" />
        </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
