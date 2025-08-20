import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PluginDetailPage from '../../components/PluginDetailPage';
import Layout from '../../components/Layout';

export default function PluginDetail() {
  const router = useRouter();
  const { pluginId } = router.query;
  const [pluginData, setPluginData] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightTheme, setLightTheme] = useState(true); // Always use white theme for plugins

  // Removed theme detection - always use white theme
  // useEffect(() => {
  //   const savedTheme = localStorage.getItem('theme');
  //   setLightTheme(savedTheme === 'light');
  // }, []);

  useEffect(() => {
    if (pluginId) {
      fetchPluginData();
      fetchCategories();
    }
  }, [pluginId]);

  const fetchPluginData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/plugins/${pluginId}`);
      const data = await response.json();

      if (data.success) {
        setPluginData(data.plugin);
      } else {
        console.error('Plugin not found');
        router.push('/plugins');
      }
    } catch (error) {
      console.error('Error fetching plugin:', error);
      router.push('/plugins');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      if (data.success) {
        setCategoryData(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDownloadRequest = (downloadData) => {
    // Handle download tracking
    console.log('Download requested:', downloadData);
    
    // You can add analytics tracking here
    // Example: Google Analytics event
    if (typeof gtag !== 'undefined') {
      gtag('event', 'download', {
        event_category: 'Plugin',
        event_label: downloadData.pluginName,
        value: 1
      });
    }
  };

  return (
      <PluginDetailPage
        pluginData={pluginData}
        categoryData={categoryData}
        onDownloadRequest={handleDownloadRequest}
        loading={loading}
        lightTheme={lightTheme}
      />
  );
}
