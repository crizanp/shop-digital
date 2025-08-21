import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import LoadingButton from './LoadingButton';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  Star,
  Package,
  Calendar,
  User,
  Globe,
  Tag,
  DollarSign,
  TrendingUp
} from 'lucide-react';

const AdminPluginDashboard = ({ token }) => {
  const [plugins, setPlugins] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlugin, setEditingPlugin] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    featured: '',
    isPremium: '',
    isActive: 'true'
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPlugins, setTotalPlugins] = useState(0);

  useEffect(() => {
    fetchPlugins();
    fetchCategories();
  }, [fetchPlugins, fetchCategories]);

  // Authentication helper
  const getHeaders = () => {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (token && token !== 'undefined' && token.trim() !== '') {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  };

  const fetchPlugins = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...filters
      });

      console.log('Fetching plugins with filters:', filters);
      console.log('API URL:', `/api/admin/plugins?${params}`);

      const response = await fetch(`/api/admin/plugins?${params}`);
      const data = await response.json();

      console.log('Plugins API response:', data);

      if (data.success) {
        setPlugins(data.plugins);
        setTotalPages(data.pagination.pages);
        setTotalPlugins(data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching plugins:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/categories');
      const data = await response.json();
      console.log('Categories API response:', data);
      if (data.success && data.categories) {
        setCategories(data.categories);
        console.log('Loaded categories:', data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, []);

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this plugin?')) {
      try {
        const response = await fetch(`/api/admin/plugins/${id}`, {
          method: 'DELETE',
          headers: getHeaders(),
        });

        if (response.ok) {
          fetchPlugins();
        } else {
          const error = await response.json();
          alert(error.message || 'Failed to delete plugin');
        }
      } catch (error) {
        console.error('Error deleting plugin:', error);
        alert('Failed to delete plugin');
      }
    }
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: '',
      featured: '',
      isPremium: '',
      isActive: 'true'
    });
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Package className="mr-3 text-blue-600" />
            WordPress Plugins
          </h1>
          <p className="text-gray-600 mt-1">Manage your WordPress plugin collection</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Plugin
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Plugins</p>
              <p className="text-2xl font-bold text-gray-900">{totalPlugins}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Featured</p>
              <p className="text-2xl font-bold text-gray-900">
                {plugins.filter(p => p.featured).length}
              </p>
            </div>
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Premium</p>
              <p className="text-2xl font-bold text-gray-900">
                {plugins.filter(p => p.isPremium).length}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
            <Tag className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search plugins..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filters.featured}
              onChange={(e) => handleFilterChange('featured', e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Plugins</option>
              <option value="true">Featured Only</option>
              <option value="false">Not Featured</option>
            </select>
          </div>

          <div>
            <select
              value={filters.isPremium}
              onChange={(e) => handleFilterChange('isPremium', e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="true">Premium Only</option>
              <option value="false">Free Only</option>
            </select>
          </div>

          <div>
            <button
              onClick={resetFilters}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Plugins Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Plugin</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Category</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Author</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Version</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Price</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Downloads</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {plugins.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-600">
                    No plugins found
                  </td>
                </tr>
              ) : (
                plugins.map((plugin) => (
                  <tr key={plugin._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg mr-4 flex items-center justify-center">
                          {plugin.images?.[0]?.url ? (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                              <Image
                                src={plugin.images[0].url}
                                alt={plugin.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                          ) : (
                            <Package className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{plugin.name}</p>
                          <p className="text-sm text-gray-600 truncate max-w-xs">
                            {plugin.shortDescription}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {plugin.categoryName || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">{plugin.author}</td>
                    <td className="px-6 py-4 text-gray-900">{plugin.version}</td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${plugin.isPremium ? 'text-green-600' : 'text-blue-600'}`}>
                        {plugin.price}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      <div className="flex items-center">
                        <Download className="w-4 h-4 mr-1" />
                        {plugin.downloads.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {plugin.featured && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          plugin.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {plugin.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => window.open(`/plugins/${plugin.slug}`, '_blank')}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View Plugin"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingPlugin(plugin);
                            setShowForm(true);
                          }}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Edit Plugin"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(plugin._id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete Plugin"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalPlugins)} of {totalPlugins} plugins
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors text-gray-700"
              >
                Previous
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors text-gray-700"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Plugin Form Modal */}
      {showForm && (
        <PluginFormModal
          plugin={editingPlugin}
          categories={categories}
          token={token}
          onClose={() => {
            setShowForm(false);
            setEditingPlugin(null);
          }}
          onSave={() => {
            setShowForm(false);
            setEditingPlugin(null);
            fetchPlugins();
          }}
        />
      )}
    </div>
  );
};

// Plugin Form Modal Component
const PluginFormModal = ({ plugin, categories, token, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    shortDescription: '',
    longDescription: '',
    documentation: '',
    version: '1.0.0',
    author: '',
    authorUrl: '',
    pluginUrl: '',
    downloadUrl: '',
    demoUrl: '',
    images: [],
    categoryId: '',
    subcategoryIndex: null,
    tags: [],
    features: [],
    requirements: {
      wordpressVersion: '5.0+',
      phpVersion: '7.4+',
      testedUpTo: '6.4'
    },
    pricing: [],
    isPremium: false,
    price: 'Free',
    featured: false,
    isActive: true
  });

  const [loading, setLoading] = useState(false);

  // Authentication helper for modal
  const getAuthHeaders = () => {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (token && token !== 'undefined' && token.trim() !== '') {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  };

  useEffect(() => {
    if (plugin) {
      setFormData({
        ...plugin,
        tags: plugin.tags || [],
        features: plugin.features || [],
        requirements: plugin.requirements || {
          wordpressVersion: '5.0+',
          phpVersion: '7.4+',
          testedUpTo: '6.4'
        },
        pricing: plugin.pricing || [],
        images: plugin.images || []
      });
    }
  }, [plugin]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayChange = (field, index, value) => {
    const array = [...(formData[field] || [])];
    array[index] = value;
    setFormData(prev => ({ ...prev, [field]: array }));
  };

  const addArrayItem = (field, defaultValue = '') => {
    const array = [...(formData[field] || [])];
    array.push(defaultValue);
    setFormData(prev => ({ ...prev, [field]: array }));
  };

  const removeArrayItem = (field, index) => {
    const array = [...(formData[field] || [])];
    array.splice(index, 1);
    setFormData(prev => ({ ...prev, [field]: array }));
  };

  const handleRequirementChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        [field]: value
      }
    }));
  };

  const handleImageChange = (index, field, value) => {
    const images = [...(formData.images || [])];
    images[index] = { ...images[index], [field]: value };
    setFormData(prev => ({ ...prev, images }));
  };

  const addImage = () => {
    const images = [...(formData.images || [])];
    images.push({ url: '', alt: '', isPrimary: false });
    setFormData(prev => ({ ...prev, images }));
  };

  const removeImage = (index) => {
    const images = [...(formData.images || [])];
    images.splice(index, 1);
    setFormData(prev => ({ ...prev, images }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = plugin ? `/api/admin/plugins/${plugin._id}` : '/api/admin/plugins';
      const method = plugin ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSave();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to save plugin');
      }
    } catch (error) {
      console.error('Error saving plugin:', error);
      alert('Failed to save plugin');
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = categories.find(cat => cat._id === formData.categoryId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {plugin ? 'Edit Plugin' : 'Add New Plugin'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plugin Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Version *</label>
                <input
                  type="text"
                  name="version"
                  value={formData.version}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Author URL</label>
                <input
                  type="url"
                  name="authorUrl"
                  value={formData.authorUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Download URL *</label>
                <input
                  type="url"
                  name="downloadUrl"
                  value={formData.downloadUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Demo URL</label>
                <input
                  type="url"
                  name="demoUrl"
                  value={formData.demoUrl}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Categorization</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCategory?.subcategories?.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
                  <select
                    name="subcategoryIndex"
                    value={formData.subcategoryIndex || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a subcategory (optional)</option>
                    {selectedCategory.subcategories.map((sub, index) => (
                      <option key={index} value={index}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g., Free, $29, $199"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPremium"
                    checked={formData.isPremium}
                    onChange={handleChange}
                    className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Premium Plugin</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Featured Plugin</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                    className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Descriptions</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description *</label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                rows={3}
                maxLength={300}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <p className="text-xs text-gray-500 mt-1">{formData.shortDescription.length}/300 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Long Description (HTML) *</label>
              <textarea
                name="longDescription"
                value={formData.longDescription}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Documentation (HTML)</label>
              <textarea
                name="documentation"
                value={formData.documentation}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Features</h3>
            {(formData.features || []).map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleArrayChange('features', index, e.target.value)}
                  placeholder="Enter feature"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('features', index)}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('features')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add Feature
            </button>
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Tags</h3>
            {(formData.tags || []).map((tag, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                  placeholder="Enter tag"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('tags', index)}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('tags')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add Tag
            </button>
          </div>

          {/* Images */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Images</h3>
            {(formData.images || []).map((image, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                    <input
                      type="url"
                      value={image.url || ''}
                      onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
                    <input
                      type="text"
                      value={image.alt || ''}
                      onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={image.isPrimary || false}
                      onChange={(e) => handleImageChange(index, 'isPrimary', e.target.checked)}
                      className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">Primary Image</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addImage}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              + Add Image
            </button>
          </div>

          {/* Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WordPress Version</label>
                <input
                  type="text"
                  value={formData.requirements?.wordpressVersion || ''}
                  onChange={(e) => handleRequirementChange('wordpressVersion', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PHP Version</label>
                <input
                  type="text"
                  value={formData.requirements?.phpVersion || ''}
                  onChange={(e) => handleRequirementChange('phpVersion', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tested Up To</label>
                <input
                  type="text"
                  value={formData.requirements?.testedUpTo || ''}
                  onChange={(e) => handleRequirementChange('testedUpTo', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <LoadingButton
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
              loadingText="Saving..."
            >
              {plugin ? 'Update Plugin' : 'Create Plugin'}
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPluginDashboard;
