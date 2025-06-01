// pages/details/[title].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import PackageDetailPage from '../../components/PackageDetailPage';
import { packagesData } from '../../dummyContent'; // Make sure this path is correct

export default function PackageDetail() {
  const router = useRouter();
  const [debugInfo, setDebugInfo] = useState({
    routerReady: false,
    routerQuery: null,
    packageFound: false,
    packageData: null,
    error: null
  });
 
  useEffect(() => {
    // Update debug info whenever router changes
    if (router.isReady) {
      try {
        const { title } = router.query;
        console.log("Router query:", router.query);
        console.log("Looking for package with title:", title);
       
        // Check if packagesData exists and is properly structured
        if (!packagesData) {
          throw new Error("packagesData is undefined");
        }
       
        if (!Array.isArray(packagesData.packages)) {
          throw new Error("packagesData.packages is not an array");
        }
       
        console.log("Available packages:", packagesData.packages.map(p => p.title));
       
        const decodedTitle = decodeURIComponent(title);
        const packageData = packagesData.packages.find(pkg =>
          pkg.title === decodedTitle ||
          pkg.title.toLowerCase() === decodedTitle.toLowerCase()
        );
       
        setDebugInfo({
          routerReady: true,
          routerQuery: router.query,
          packageFound: Boolean(packageData),
          packageData: packageData || null,
          error: null
        });
      } catch (error) {
        console.error("Error finding package:", error);
        setDebugInfo(prev => ({
          ...prev,
          routerReady: true,
          error: error.message
        }));
      }
    }
  }, [router.isReady, router.query]);

  // Display debugging information if there's an issue
  if (debugInfo.error || !debugInfo.packageFound) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Package</h1>
        
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h2 className="font-bold">Debug Information:</h2>
          <pre className="mt-2 p-3 bg-gray-800 text-green-400 rounded overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
        
        <div className="mt-4">
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }
 
  // Show loading state
  if (!debugInfo.routerReady || !debugInfo.packageData) {
    return <div className="container mx-auto px-6 py-8">Loading package details...</div>;
  }
 
  // If everything is good, render the package detail
  return <PackageDetailPage packageData={debugInfo.packageData} />;
}