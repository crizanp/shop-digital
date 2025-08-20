import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PluginsPage from '../components/PluginsPage';
import Layout from '../components/Layout';
import Navbar from '../components/Navbar';
import Head from 'next/head';

export default function PluginsPageRoute({ initialPlugins = [], initialCategories = [] }) {
  const router = useRouter();
  const { category } = router.query; // Get category from URL query
  
  const [plugins, setPlugins] = useState(initialPlugins);
  const [categories, setCategories] = useState(initialCategories);
  const [lightTheme, setLightTheme] = useState(true); // Always white theme
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Handle URL category parameter
  useEffect(() => {
    if (router.isReady && category) {
      setSelectedCategory(category);
    }
  }, [router.isReady, category]);

  // No need for useEffect data fetching since we have server-side props

  if (error) {
    return (
      <>
        <Head>
          <title>Error | WordPress Plugins</title>
        </Head>
        <Navbar />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Plugins</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>WordPress Plugins | Professional WordPress Solutions</title>
        <meta name="description" content="Discover powerful WordPress plugins to extend your website functionality, improve performance, and enhance user experience." />
      </Head>
      <Navbar 
        activeCategory="wordpress-plugins"
        activeSubcategory={selectedCategory !== 'all' ? selectedCategory : null}
      />
      <PluginsPage 
        plugins={plugins} 
        categories={categories} 
        lightTheme={lightTheme}
        initialSelectedCategory={selectedCategory}
      />
    </>
  );
}

// Server-side rendering to fetch plugins and categories
export async function getServerSideProps(context) {
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = context.req.headers.host;
  const baseUrl = `${protocol}://${host}`;

  try {
    // Fetch plugins and categories
    const [pluginsRes, categoriesRes] = await Promise.all([
      fetch(`${baseUrl}/api/plugins`),
      fetch(`${baseUrl}/api/categories`)
    ]);

    const pluginsData = await pluginsRes.json();
    const categoriesData = await categoriesRes.json();

    return {
      props: {
        initialPlugins: pluginsData.plugins || [],
        initialCategories: categoriesData.categories || []
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        initialPlugins: [],
        initialCategories: []
      }
    };
  }
}
