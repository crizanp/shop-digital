import { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import AdminPluginDashboard from './AdminPluginDashboard';

const AdminDashboard = ({ token, onLogout }) => {
    const [activeTab, setActiveTab] = useState('packages');
    const [packages, setPackages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        console.log('AdminDashboard props:', {
            token: token ? `${token.substring(0, 20)}...` : 'none',
            onLogout: typeof onLogout
        });
    }, [token, onLogout]);

    const getHeaders = () => {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (token && token !== 'undefined' && token.trim() !== '') {
            headers['Authorization'] = `Bearer ${token}`;
            console.log('Adding Authorization header:', `Bearer ${token.substring(0, 20)}...`);
        } else {
            console.warn('No valid token available for request');
        }

        return headers;
    };

    const fetchWithAuth = async (url, options = {}) => {
        try {
            const headers = getHeaders();
            console.log('Making request to:', url, 'with headers:', Object.keys(headers));

            const response = await fetch(url, {
                ...options,
                headers: {
                    ...headers,
                    ...options.headers
                }
            });

            console.log('Response status:', response.status);

            if (response.status === 401) {
                console.error('Authentication error - logging out');
                alert('Session expired. Please login again.');

                if (typeof onLogout === 'function') {
                    onLogout();
                } else {
                    console.error('onLogout is not a function:', typeof onLogout);
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('adminToken');
                        window.location.href = '/admin/login';
                    }
                }
                return null;
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            return response;
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    };

    const fetchAllCategories = async () => {
        try {
            const response = await fetchWithAuth('/api/admin/categories');
            if (response) {
                const data = await response.json();
                setAllCategories(data.categories || []);
            }
        } catch (error) {
            console.error('Fetch categories error:', error);
            alert('Failed to fetch categories');
        }
    };

    useEffect(() => {
        if (token) {
            fetchData();
            if (activeTab === 'packages') {
                fetchAllCategories();
            }
        }
    }, [activeTab, token]);

    const fetchData = async () => {
        if (!token) {
            console.warn('No token available, skipping fetch');
            return;
        }

        setLoading(true);
        try {
            const endpoint = activeTab === 'packages' ? '/api/admin/packages' : '/api/admin/categories';
            const response = await fetchWithAuth(endpoint);

            if (response) {
                const data = await response.json();
                if (activeTab === 'packages') {
                    setPackages(data.packages || []);
                } else {
                    setCategories(data.categories || []);
                }
            }
        } catch (error) {
            console.error('Fetch error:', error);
            alert('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('[FRONTEND] Form submission started', {
            formData,
            editingItem,
            activeTab
        });
        if (!token) {
            alert('No authentication token available. Please login again.');
            return;
        }

        setLoading(true);

        try {
            const endpoint = activeTab === 'packages' ? '/api/admin/packages' : '/api/admin/categories';
            const method = editingItem ? 'PUT' : 'POST';
            const url = editingItem ? `${endpoint}?id=${editingItem._id}` : endpoint;
            let processedFormData = { ...formData };

            if (activeTab === 'packages') {
                if (processedFormData.subcategoryId && processedFormData.subcategoryId.trim() !== '') {
                    const subcategoryIndex = parseInt(processedFormData.subcategoryId, 10);
                    if (!isNaN(subcategoryIndex)) {
                        processedFormData.subcategoryIndex = subcategoryIndex;
                        console.log('Setting subcategoryIndex to:', subcategoryIndex);
                    } else {
                        processedFormData.subcategoryIndex = null;
                    }
                } else {
                    processedFormData.subcategoryIndex = null;
                }

                delete processedFormData.subcategoryId;
            }

            console.log('[FRONTEND] Preparing to submit:', {
                method,
                url,
                processedFormData
            });

            const response = await fetchWithAuth(url, {
                method,
                body: JSON.stringify(processedFormData)
            });

            if (response) {
                alert(`${activeTab.slice(0, -1)} ${editingItem ? 'updated' : 'created'} successfully!`);
                setShowForm(false);
                setEditingItem(null);
                setFormData({});
                fetchData();
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert(`Failed to save ${activeTab.slice(0, -1)}: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        if (!token) {
            alert('No authentication token available. Please login again.');
            return;
        }

        try {
            const endpoint = activeTab === 'packages' ? '/api/admin/packages' : '/api/admin/categories';
            const response = await fetchWithAuth(`${endpoint}?id=${id}`, {
                method: 'DELETE'
            });

            if (response) {
                alert('Item deleted successfully!');
                fetchData();
            }
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete item');
        }
    };

    const handleEdit = (item) => {
        let editFormData = { ...item };

        if (item.subcategoryIndex !== null && !isNaN(item.subcategoryIndex)) {
            editFormData.subcategoryId = item.subcategoryIndex.toString();
        } else {
            editFormData.subcategoryId = '';
        }

        setEditingItem(item);
        setFormData(editFormData);
        setShowForm(true);
    };

    const resetForm = () => {
        setShowForm(false);
        setEditingItem(null);
        setFormData({});
    };

    const getCategoryName = (item) => {
        if (activeTab === 'packages') {
            const category = allCategories.find(cat => cat._id === item.categoryId);
            if (category) {
                if (item.subcategoryIndex !== undefined && item.subcategoryIndex !== null &&
                    category.subcategories && category.subcategories[item.subcategoryIndex]) {
                    return `${category.name} > ${category.subcategories[item.subcategoryIndex].name}`;
                }
                return category.name;
            }
        }
        return 'No Category';
    };
    const removePricingSection = (pricingIndex) => {
        const pricing = formData.pricing || [];
        setFormData(prev => ({
            ...prev,
            pricing: pricing.filter((_, i) => i !== pricingIndex)
        }));
    };

    const removePricingOption = (pricingIndex, optionIndex) => {
        const pricing = formData.pricing || [];
        const options = pricing[pricingIndex]?.options || [];
        pricing[pricingIndex] = {
            ...pricing[pricingIndex],
            options: options.filter((_, i) => i !== optionIndex)
        };
        setFormData(prev => ({ ...prev, pricing }));
    };
    if (!token || token === 'undefined') {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-black mb-4">Authentication Required</h2>
                    <p className="text-black mb-4">Please login to access the admin dashboard.</p>
                    <button
                        onClick={() => {
                            if (typeof onLogout === 'function') {
                                onLogout();
                            } else {
                                window.location.href = '/admin/login';
                            }
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">

                <div className="bg-white rounded-lg shadow mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 px-6">
                            <button
                                onClick={() => setActiveTab('packages')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'packages'
                                    ? 'border-blue-500 text-black'
                                    : 'border-transparent text-black hover:text-black'
                                    }`}
                            >
                                Packages
                            </button>
                            <button
                                onClick={() => setActiveTab('plugins')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'plugins'
                                    ? 'border-blue-500 text-black'
                                    : 'border-transparent text-black hover:text-black'
                                    }`}
                            >
                                WordPress Plugins
                            </button>
                            <button
                                onClick={() => setActiveTab('categories')}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'categories'
                                    ? 'border-blue-500 text-black'
                                    : 'border-transparent text-black hover:text-black'
                                    }`}
                            >
                                Categories
                            </button>
                        </nav>
                    </div>
                </div>

                {activeTab === 'plugins' ? (
                    <AdminPluginDashboard token={token} />
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-black capitalize">
                                Manage {activeTab}
                            </h2>
                            <button
                                onClick={() => setShowForm(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Add New {activeTab.slice(0, -1)}
                            </button>
                        </div>

                        {loading && (
                            <div className="text-center py-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        )}

                        {!loading && (
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Name/Title
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    {activeTab === 'packages' ? 'Price' : 'Slug'}
                                                </th>
                                                {activeTab === 'packages' && (
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Category
                                                    </th>
                                                )}
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {(activeTab === 'packages' ? packages : categories).map((item) => (
                                                <tr key={item._id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {item.title || item.name}
                                                        </div>
                                                        {item.subtitle && (
                                                            <div className="text-sm text-gray-500">{item.subtitle}</div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {item.price || item.slug}
                                                    </td>
                                                    {activeTab === 'packages' && (
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {getCategoryName(item)}
                                                        </td>
                                                    )}
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.isActive
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {item.isActive ? 'Active' : 'Inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(item)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            Edit
                                                        </button>
                                                        {item.demoUrl && (
                                                            <a
                                                                href={item.demoUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="ml-2 text-indigo-600 hover:text-indigo-900"
                                                            >
                                                                Live Demo
                                                            </a>
                                                        )}
                                                        <button
                                                            onClick={() => handleDelete(item._id)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {(activeTab === 'packages' ? packages : categories).length === 0 && (
                                                <tr>
                                                    <td colSpan={activeTab === 'packages' ? "5" : "4"} className="px-6 py-4 text-center text-gray-500">
                                                        No {activeTab} found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {showForm && (
                            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-screen overflow-y-auto">
                                    <div className="px-6 py-4 border-b border-gray-200">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {editingItem ? 'Edit' : 'Add New'} {activeTab.slice(0, -1)}
                                        </h3>
                                    </div>

                                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                        {activeTab === 'packages' ? (
                                            <PackageForm
                                                formData={formData}
                                                setFormData={setFormData}
                                                categories={allCategories}
                                            />
                                        ) : (
                                            <CategoryForm formData={formData} setFormData={setFormData} />
                                        )}

                                        <div className="flex justify-end space-x-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={resetForm}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                                disabled={loading}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                                            >
                                                {loading ? 'Saving...' : 'Save'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};


const PackageForm = ({ formData, setFormData, categories }) => {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        console.log('Form field changed:', { name, value, type, checked });

        if (name === 'categoryId') {
            setFormData(prev => {
                const newData = {
                    ...prev,
                    [name]: type === 'checkbox' ? checked : value,
                    subcategoryId: ''
                };
                console.log('Category changed, reset subcategory:', newData);
                return newData;
            });
        } else if (name === 'subcategoryId') {
            setFormData(prev => {
                const newData = {
                    ...prev,
                    [name]: value
                };
                console.log('Subcategory changed:', {
                    subcategoryId: value,
                    categoryId: prev.categoryId
                });
                return newData;
            });
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    }; const selectedCategory = formData.categoryId ?
        categories.find(cat => cat._id === formData.categoryId) : null;

    console.log('PackageForm render:', {
        categoryId: formData.categoryId,
        subcategoryId: formData.subcategoryId,
        selectedCategory: selectedCategory?.name,
        hasSubcategories: selectedCategory?.hasSubcategories,
        subcategoriesLength: selectedCategory?.subcategories?.length
    });
    const handleArrayChange = (field, index, value) => {
        const array = formData[field] || [];
        array[index] = value;
        setFormData(prev => ({ ...prev, [field]: array }));
    };

    const addArrayItem = (field, defaultValue = '') => {
        const array = formData[field] || [];
        setFormData(prev => ({ ...prev, [field]: [...array, defaultValue] }));
    };

    const removeArrayItem = (field, index) => {
        const array = formData[field] || [];
        setFormData(prev => ({ ...prev, [field]: array.filter((_, i) => i !== index) }));
    };

    const handleFAQChange = (index, field, value) => {
        const faqs = formData.faqs || [];
        faqs[index] = { ...faqs[index], [field]: value };
        setFormData(prev => ({ ...prev, faqs }));
    };

    const addFAQ = () => {
        const faqs = formData.faqs || [];
        setFormData(prev => ({
            ...prev,
            faqs: [...faqs, { question: '', answer: '' }]
        }));
    };

    const removeFAQ = (index) => {
        const faqs = formData.faqs || [];
        setFormData(prev => ({ ...prev, faqs: faqs.filter((_, i) => i !== index) }));
    };

    const handlePricingChange = (pricingIndex, field, value) => {
        const pricing = formData.pricing || [];
        pricing[pricingIndex] = { ...pricing[pricingIndex], [field]: value };
        setFormData(prev => ({ ...prev, pricing }));
    };

    const handlePricingOptionChange = (pricingIndex, optionIndex, field, value) => {
        const pricing = formData.pricing || [];
        const options = pricing[pricingIndex]?.options || [];
        options[optionIndex] = { ...options[optionIndex], [field]: value };
        pricing[pricingIndex] = { ...pricing[pricingIndex], options };
        setFormData(prev => ({ ...prev, pricing }));
    };

    const addPricingSection = () => {
        const pricing = formData.pricing || [];
        setFormData(prev => ({
            ...prev,
            pricing: [...pricing, { title: '', options: [{ name: '', price: '' }] }]
        }));
    };

    const addPricingOption = (pricingIndex) => {
        const pricing = formData.pricing || [];
        const options = pricing[pricingIndex]?.options || [];
        pricing[pricingIndex] = {
            ...pricing[pricingIndex],
            options: [...options, { name: '', price: '' }]
        };
        setFormData(prev => ({ ...prev, pricing }));
    };
    const removePricingSection = (pricingIndex) => {
        const pricing = formData.pricing || [];
        setFormData(prev => ({
            ...prev,
            pricing: pricing.filter((_, i) => i !== pricingIndex)
        }));
    };

    const removePricingOption = (pricingIndex, optionIndex) => {
        const pricing = formData.pricing || [];
        const options = pricing[pricingIndex]?.options || [];
        pricing[pricingIndex] = {
            ...pricing[pricingIndex],
            options: options.filter((_, i) => i !== optionIndex)
        };
        setFormData(prev => ({ ...prev, pricing }));
    };
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Basic Information</h4>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Title *</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 text-black"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                    <input
                        type="text"
                        name="subtitle"
                        value={formData.subtitle || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Live Demo URL (optional)</label>
                    <input
                        type="text"
                        name="demoUrl"
                        value={formData.demoUrl || ''}
                        onChange={handleChange}
                        placeholder="https://example.com/demo (optional)"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 text-black"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Price *</label>
                    <input
                        type="text"
                        name="price"
                        value={formData.price || ''}
                        onChange={handleChange}
                        placeholder="e.g. From: 99.00 USD/month"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 text-black"
                        required
                    />
                </div>

                <div>
                    <ImageUpload
                        value={formData.image || ''}
                        onChange={(imageUrl) => setFormData(prev => ({ ...prev, image: imageUrl }))}
                        required={true}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Category *</label>
                    <select
                        name="categoryId"
                        value={formData.categoryId || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 text-black"
                        required
                    >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category._id} value={category._id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                {selectedCategory?.subcategories?.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                        <select
                            name="subcategoryId"
                            value={formData.subcategoryId || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 text-black"
                        >
                            <option value="">Select a subcategory (optional)</option>
                            {selectedCategory.subcategories.map((sub, index) => (
                                <option key={index} value={index}>
                                    {sub.name}
                                </option>
                            ))}
                        </select>
                        <p className="mt-1 text-xs text-gray-500">
                            Selected index: {formData.subcategoryId || 'None'}
                        </p>
                    </div>
                )}


                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured || false}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">Featured Package</label>
                </div>

                <div className="flex items-center">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive !== false}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">Active</label>
                </div>
            </div>
            <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-900">Descriptions</h4>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Short Description *</label>
                    <textarea
                        name="description"
                        value={formData.description || ''}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 text-black"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Long Description (HTML) *</label>
                    <textarea
                        name="longDescription"
                        value={formData.longDescription || ''}
                        onChange={handleChange}
                        rows={6}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 text-black"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                    {(formData.features || []).map((feature, index) => (
                        <div key={index} className="flex mb-2">
                            <input
                                type="text"
                                value={feature}
                                onChange={(e) => handleArrayChange('features', index, e.target.value)}
                                className="flex-1 border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 text-black"
                                placeholder="Enter feature"
                            />
                            <button
                                type="button"
                                onClick={() => removeArrayItem('features', index)}
                                className="ml-2 text-red-600 hover:text-red-800"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => addArrayItem('features')}
                        className="text-blue-600 text-sm hover:text-blue-800"
                    >
                        + Add Feature
                    </button>
                </div>
            </div>

            <div className="col-span-full">
                <h4 className="text-lg font-medium text-gray-900 mb-4">FAQs</h4>
                {(formData.faqs || []).map((faq, index) => (
                    <div key={index} className="border p-4 rounded-lg mb-4">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Question</label>
                                <input
                                    type="text"
                                    value={faq.question || ''}
                                    onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Answer</label>
                                <textarea
                                    value={faq.answer || ''}
                                    onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                                    rows={3}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 text-black"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFAQ(index)}
                                className="text-red-600 hover:text-red-800 text-sm self-start"
                            >
                                Remove FAQ
                            </button>
                        </div>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addFAQ}
                    className="text-blue-600 text-sm hover:text-blue-800"
                >
                    + Add FAQ
                </button>
            </div>

            <div className="col-span-full">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Pricing Sections</h4>
                {(formData.pricing || []).map((pricingSection, pricingIndex) => (
                    <div key={pricingIndex} className="border p-4 rounded-lg mb-4">
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-sm font-medium text-gray-700">Section Title</label>
                            <button
                                type="button"
                                onClick={() => removePricingSection(pricingIndex)}
                                className="text-red-600 hover:text-red-800 text-sm"
                            >
                                Delete Section
                            </button>
                        </div>
                        <input
                            type="text"
                            value={pricingSection.title || ''}
                            onChange={(e) => handlePricingChange(pricingIndex, 'title', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 text-black"
                        />

                        <div className="mb-4 mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                            {(pricingSection.options || []).map((option, optionIndex) => (
                                <div key={optionIndex} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Option Name"
                                        value={option.name || ''}
                                        onChange={(e) => handlePricingOptionChange(pricingIndex, optionIndex, 'name', e.target.value)}
                                        className="flex-1 border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 text-black"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Price"
                                        value={option.price || ''}
                                        onChange={(e) => handlePricingOptionChange(pricingIndex, optionIndex, 'price', e.target.value)}
                                        className="flex-1 border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 text-black"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removePricingOption(pricingIndex, optionIndex)}
                                        className="text-red-600 hover:text-red-800 text-sm px-2"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => addPricingOption(pricingIndex)}
                                className="text-blue-600 text-sm hover:text-blue-800"
                            >
                                + Add Option
                            </button>
                        </div>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addPricingSection}
                    className="text-blue-600 text-sm hover:text-blue-800"
                >
                    + Add Pricing Section
                </button>
            </div>
        </div>
    );
};

const CategoryForm = ({ formData, setFormData }) => {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };


    const handleSubcategoryChange = (index, field, value) => {
        const subcategories = formData.subcategories || [];
        subcategories[index] = { ...subcategories[index], [field]: value };
        setFormData(prev => ({ ...prev, subcategories }));
    };

    const addSubcategory = () => {
        const subcategories = formData.subcategories || [];
        setFormData(prev => ({
            ...prev,
            subcategories: [...subcategories, { name: '', slug: '' }]
        }));
    };

    const removeSubcategory = (index) => {
        const subcategories = formData.subcategories || [];
        setFormData(prev => ({
            ...prev,
            subcategories: subcategories.filter((_, i) => i !== index)
        }));
    };

    return (
        <>
            <div>
                <label className="block text-sm font-medium text-gray-700">Name *</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 text-black"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Slug *</label>
                <input
                    type="text"
                    name="slug"
                    value={formData.slug || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 text-black"
                    required
                />
            </div>

            <div className="flex items-center mt-4">
                <input
                    type="checkbox"
                    name="hasSubcategories"
                    checked={formData.hasSubcategories || false}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Has Subcategories</label>
            </div>

            <div className="flex items-center mt-2">
                <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive !== false}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Active</label>
            </div>

            {formData.hasSubcategories && (
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subcategories</label>
                    {(formData.subcategories || []).map((sub, index) => (
                        <div key={index} className="grid grid-cols-2 gap-2 mb-2">
                            <input
                                type="text"
                                placeholder="Subcategory Name"
                                value={sub.name || ''}
                                onChange={(e) => handleSubcategoryChange(index, 'name', e.target.value)}
                                className="border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 text-black"
                            />
                            <div className="flex">
                                <input
                                    type="text"
                                    placeholder="Subcategory Slug"
                                    value={sub.slug || ''}
                                    onChange={(e) => handleSubcategoryChange(index, 'slug', e.target.value)}
                                    className="flex-1 border-gray-300 rounded-md shadow-sm p-2 border focus:ring-blue-500 focus:border-blue-500 text-black"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeSubcategory(index)}
                                    className="ml-2 text-red-600 hover:text-red-800"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addSubcategory}
                        className="mt-2 text-blue-600 hover:text-blue-800"
                    >
                        + Add Subcategory
                    </button>
                </div>
            )}
        </>
    );
};

export default AdminDashboard;