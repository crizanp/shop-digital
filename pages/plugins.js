import { useState, useEffect } from 'react';
import PluginsPage from '../components/PluginsPage';
import Layout from '../components/Layout';

export default function PluginsPageRoute() {
  const [plugins, setPlugins] = useState([]);
  const [categories, setCategories] = useState([]);
  const [lightTheme, setLightTheme] = useState(true); // Changed to white theme
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // You can add theme detection logic here
    const savedTheme = localStorage.getItem('theme');
    setLightTheme(savedTheme !== 'dark'); // Default to light theme
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pluginsRes, categoriesRes] = await Promise.all([
          fetch('/api/plugins'),
          fetch('/api/categories')
        ]);

        if (!pluginsRes.ok || !categoriesRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const pluginsData = await pluginsRes.json();
        const categoriesData = await categoriesRes.json();

        setPlugins(pluginsData.plugins || []);
        setCategories(categoriesData.categories || []);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Layout lightTheme={lightTheme}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout lightTheme={lightTheme}>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Plugins</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout lightTheme={lightTheme}>
      <PluginsPage 
        plugins={plugins} 
        categories={categories} 
        lightTheme={lightTheme} 
      />
    </Layout>
  );
}
