// pages/package/[packageId].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import PackageDetailPage from '../../components/PackageDetailPage';
import Navbar from '@/components/Navbar';
import { Package, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function PackageDetail() {
  const router = useRouter();
  const { packageId } = router.query;
  
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch package data from API
  const fetchPackageData = async (id) => {
    try {
      setLoading(true);
      setError(null);

      // Use relative URL instead of hardcoded localhost
      const response = await fetch(`/api/admin/packages/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Package not found');
        }
        if (response.status === 500) {
          throw new Error('Server error occurred');
        }
        throw new Error(`Failed to fetch package: ${response.status}`);
      }

      const data = await response.json();
      
      // Validate response data
      if (!data || !data.package) {
        throw new Error('Invalid package data received');
      }

      setPackageData(data.package);
    } catch (err) {
      console.error('Error fetching package:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when router is ready and packageId is available
  useEffect(() => {
    if (router.isReady && packageId) {
      fetchPackageData(packageId);
    }
  }, [router.isReady, packageId]);

  // Handle retry
  const handleRetry = () => {
    if (packageId) {
      fetchPackageData(packageId);
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Head>
          <title>Loading Package... | Professional Design Solutions</title>
          <meta name="robots" content="noindex" />
        </Head>
        <Navbar />
        <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-xl text-gray-300">Loading package details...</p>
            <p className="text-sm text-gray-500 mt-2">Please wait while we fetch the information</p>
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    const isNotFound = error === 'Package not found';
    
    return (
      <>
        <Head>
          <title>{isNotFound ? 'Package Not Found' : 'Error Loading Package'} | Professional Design Solutions</title>
          <meta name="robots" content="noindex" />
        </Head>
        <Navbar />
        <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <Package size={64} className={`${isNotFound ? 'text-red-400' : 'text-yellow-400'} mx-auto mb-4`} />
            
            <h1 className="text-3xl font-bold text-white mb-2">
              {isNotFound ? 'Package Not Found' : 'Loading Error'}
            </h1>
            
            <p className="text-gray-400 mb-6">
              {isNotFound 
                ? "The package you're looking for doesn't exist or may have been removed."
                : `Sorry, we couldn't load the package details. ${error}`
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.back()}
                className="flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                <ArrowLeft size={20} className="mr-2" />
                Go Back
              </button>
              
              <Link 
                href="/pricing"
                className="flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Browse All Packages
              </Link>
            </div>

            {!isNotFound && (
              <button 
                onClick={handleRetry}
                className="mt-4 flex items-center justify-center mx-auto text-purple-400 hover:text-purple-300 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 rounded px-3 py-1"
              >
                <RefreshCw size={16} className="mr-1" />
                Try Again
              </button>
            )}
          </div>
        </div>
      </>
    );
  }

  // Success state - render package details
  if (packageData) {
    return (
      <>
        <Head>
          <title>{packageData.title} | Professional Design Solutions</title>
          <meta 
            name="description" 
            content={
              packageData.description || 
              `Professional ${packageData.title} design package with fast turnaround and competitive pricing.`
            } 
          />
          {/* Add structured data for SEO */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                "name": packageData.title,
                "description": packageData.description,
                "offers": {
                  "@type": "Offer",
                  "price": packageData.price,
                  "priceCurrency": "USD"
                }
              })
            }}
          />
        </Head>
        <PackageDetailPage packageData={packageData} />
      </>
    );
  }

  // Fallback state - shouldn't reach here normally
  return (
    <>
      <Head>
        <title>Package Details | Professional Design Solutions</title>
        <meta name="robots" content="noindex" />
      </Head>
      <Navbar />
      <div className="min-h-screen bg-black text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <Package size={64} className="text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl text-white mb-2">Something went wrong</h2>
          <p className="text-gray-400 mb-4">Unable to load package details</p>
          <button 
            onClick={() => router.push('/pricing')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Browse All Packages
          </button>
        </div>
      </div>
    </>
  );
}