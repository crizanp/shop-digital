// pages/details/[slug].js
import Head from 'next/head';
import { useState } from 'react';
import { Star, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import connectDB from '@/lib/mongodb';
import { Package, Category } from '@/lib/models';
import { useCurrency } from '@/contexts/CurrencyContext';
import Link from 'next/link';
import Footer from '@/components/Footer';

const slugify = (s = '') =>
  s
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export default function PackageDetail({ packageData, categories, relatedPackages }) {
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const { currencyInfo, exchangeRates } = useCurrency();
  const convertPrice = (priceString) => {
    const numericPrice = parseFloat(priceString.replace(/[^0-9.]/g, ''));
    const convertedPrice = numericPrice * exchangeRates[currencyInfo.currency];
    return `${currencyInfo.symbol}${convertedPrice.toFixed(2)}`;
  };
  // Helper function to extract numeric price value
  const extractPriceValue = (priceString) => {
    if (!priceString) return 0;
    if (priceString.includes('%')) return 0;
    const numericMatch = priceString.match(/-?\+?(\d+(?:\.\d+)?)/);
    return numericMatch && numericMatch[1] ? parseFloat(numericMatch[1]) : 0;
  };

  // Calculate total price
  const calculateTotal = () => {
    let total = 0;

    // Add base price
    if (packageData.price) {
      total += extractPriceValue(packageData.price);
    }

    // Add selected options
    if (packageData.pricing?.length > 0) {
      packageData.pricing.forEach((category, categoryIndex) => {
        const selectedIndices = selectedOptions[categoryIndex] || [];
        selectedIndices.forEach(optionIndex => {
          const option = category.options[optionIndex];
          if (option?.price) {
            total += extractPriceValue(option.price);
          }
        });
      });
    }

    // Multiply by quantity
    total *= quantity;

    return `${total.toFixed(2)} USD`;
  };

  // Handle multi-select for pricing options
  const handleMultiSelect = (categoryIndex, optionIndex) => {
    const currentSelections = [...(selectedOptions[categoryIndex] || [])];
    const updatedSelections = currentSelections.includes(optionIndex)
      ? currentSelections.filter(index => index !== optionIndex)
      : [...currentSelections, optionIndex];

    setSelectedOptions(prev => ({
      ...prev,
      [categoryIndex]: updatedSelections
    }));
  };

  // Handle quotation request
  const handleQuotationRequest = async () => {
    const quotationData = {
      packageTitle: packageData.title,
      quantity,
      totalPrice: calculateTotal(),
      selectedOptions,
      timestamp: new Date().toISOString()
    };

    try {
      const payload = {
        packageTitle: quotationData.packageTitle,
        quantity: quotationData.quantity,
        totalPrice: quotationData.totalPrice,
        addons: Object.values(selectedOptions || {}).flat().map(idx => {
          const found = packageData.pricing?.flatMap(p => p.options || []).filter(Boolean)[idx];
          return found ? { title: found.name, price: found.price } : { name: String(idx) };
        }),
        recipient: '9705516131'
      };

      const resp = await fetch('/api/send-quotation-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await resp.json();
      if (data.waLink) {
        window.open(data.waLink, '_blank');
      } else if (data.success) {
        alert('Quotation sent successfully via WhatsApp API.');
      } else {
        console.error('WhatsApp send error:', data);
        alert('Could not send quotation via WhatsApp.');
      }
    } catch (err) {
      console.error('Error sending quotation:', err);
      alert('Failed to send quotation.');
    }
  };

  if (!packageData) {
    return (
      <>
        <Head>
          <title>Package Not Found | Foxbeep Marketplace</title>
        </Head>
        <Navbar />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900">Package not found</h2>
            <Link href="/" className="text-blue-600 hover:text-blue-700 mt-4 inline-block" >
              Return to home
            </Link>
          </div>
        </div>
      </>
    );
  }

  const category = categories?.find(cat => cat._id === packageData.categoryId);

  return (
    <>
      <Head>
        <title>{packageData.title} | Foxbeep Marketplace</title>
        <meta name="description" content={packageData.description || ''} />
      </Head>

      <Navbar />

      <div className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900">Home</Link>
              <ChevronRight size={14} />
              {category && (
                <>
                  <Link href={`/category/${category.slug}`} className="hover:text-gray-900">
                    {category.name}
                  </Link>
                  <ChevronRight size={14} />
                </>
              )}
              <span className="text-gray-900">{packageData.title}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* Product Image */}
              <div className="bg-gray-100 rounded-lg overflow-hidden mb-6">
                <img
                  src={packageData.image || '/api/placeholder/800/500'}
                  alt={packageData.title}
                  className="w-full h-auto"
                />
              </div>

              {/* Demo Button */}
              {packageData.demoUrl && (
                <a
                  href={packageData.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-gray-900 hover:bg-gray-800 text-white text-center py-3 px-6 rounded-lg transition-colors mb-6 font-medium"
                >
                  View Live Demo
                </a>
              )}

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <div className="flex gap-8">
                  <button
                    onClick={() => setActiveTab('description')}
                    className={`pb-4 px-1 cursor-pointer font-medium transition-colors ${activeTab === 'description'
                        ? 'text-gray-900 border-b-2 border-gray-900'
                        : 'text-gray-600 hover:text-gray-900'
                      }`}
                  >
                    Description
                  </button>
                  {packageData.faqs?.length > 0 && (
                    <button
                      onClick={() => setActiveTab('faq')}
                      className={`pb-4 px-1 cursor-pointer font-medium transition-colors ${activeTab === 'faq'
                          ? 'text-gray-900 border-b-2 border-gray-900'
                          : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      FAQ
                    </button>
                  )}
                </div>
              </div>

              {/* Tab Content */}
              <div>
                {activeTab === 'description' && (
                  <div className="prose prose-gray max-w-none">
                    <div
                      className="text-gray-900 space-y-4"
                      dangerouslySetInnerHTML={{
                        __html: packageData.longDescription || packageData.description || '<p>No description available.</p>'
                      }}
                    />
                  </div>
                )}
                {activeTab === 'faq' && (
                  <div className="space-y-6">
                    {packageData.faqs?.map((faq, index) => (
                      <div key={index}>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-1">
              {/* Product Info Card */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 sticky top-6">
                <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                  {packageData.title}
                </h1>

                {packageData.subtitle && (
                  <p className="text-gray-600 mb-4">{packageData.subtitle}</p>
                )}

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {packageData.rating || 5.0}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    ({packageData.reviews || 0} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="text-3xl font-bold text-gray-900">
                    {convertPrice(packageData.price)}
                  </div>
                </div>

                {/* Pricing Options */}
                {packageData.pricing?.length > 0 && (
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">
                      Customize Your Package
                    </h3>
                    {packageData.pricing.map((pricingCategory, categoryIndex) => (
                      <div key={categoryIndex} className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          {pricingCategory.title}
                        </h4>
                        <div className="space-y-2">
                          {pricingCategory.options?.map((option, optionIndex) => {
                            const isSelected = (selectedOptions[categoryIndex] || []).includes(optionIndex);
                            return (
                              <label
                                key={optionIndex}
                                className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${isSelected
                                    ? 'border-gray-900 bg-gray-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                  }`}
                              >
                                <div className="flex items-center gap-3">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleMultiSelect(categoryIndex, optionIndex)}
                                    className="w-4 h-4 text-gray-900 border-gray-300 rounded"
                                  />
                                  <span className="text-sm text-gray-900">{option.name}</span>
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                  {convertPrice(option.price)}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-3 text-black">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 text-center border border-gray-900 text-black rounded py-2"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total Price */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Total Price</span>
                    <span className="text-2xl font-bold text-gray-900">
                      {convertPrice(calculateTotal())}
                    </span>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleQuotationRequest}
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-lg font-medium transition-colors mb-4"
                >
                  Get Quotation
                </button>

                {/* Features */}
                {packageData.features?.length > 0 && (
                  <div className="pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      Key Features
                    </h3>
                    <ul className="space-y-2">
                      {packageData.features.slice(0, 5).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-green-600 mt-0.5">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedPackages?.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Related Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedPackages.map((pkg) => (
                  <a
                    key={pkg._id}
                    href={`/details/${pkg.slug || slugify(pkg.title)}`}
                    className="group"
                  >
                    <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden mb-3">
                      <img
                        src={pkg.image || '/api/placeholder/400/300'}
                        alt={pkg.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="text-base font-normal text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600">
                      {pkg.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-900">{pkg.rating || 5.0}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {pkg.price}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { params } = context;
  const slug = params.slug;

  try {
    await connectDB();

    // Fetch categories
    const categories = await Category.find({}).lean().catch(() => []);

    // Fetch all active packages
    const pkgs = await Package.find({ isActive: true }).lean();

    // Find the package
    const found = pkgs.find(p => {
      const generated = slugify(p.title || p._id);
      if (p.slug && p.slug === slug) return true;
      if (generated === slug) return true;
      return String(p._id) === slug;
    });

    if (!found) {
      return { props: { packageData: null, categories: [], relatedPackages: [] } };
    }

    // Get related packages from same category
    const relatedPackages = pkgs
      .filter(p =>
        p._id !== found._id &&
        p.categoryId === found.categoryId
      )
      .slice(0, 4);

    // Serialize data
    const deepSerialize = (val) => {
      if (val === null || val === undefined) return null;
      if (Array.isArray(val)) return val.map(deepSerialize);
      if (val?._bsontype === 'ObjectID' || typeof val?.toHexString === 'function') {
        return String(val);
      }
      if (val instanceof Date) return val.toISOString();
      if (typeof val === 'object') {
        const out = {};
        for (const [k, v] of Object.entries(val)) {
          out[k] = deepSerialize(v);
        }
        return out;
      }
      return val;
    };

    return {
      props: {
        packageData: deepSerialize(found),
        categories: deepSerialize(categories),
        relatedPackages: deepSerialize(relatedPackages)
      }
    };
  } catch (err) {
    console.error('Details SSR error:', err);
    return {
      props: { packageData: null, categories: [], relatedPackages: [] }
    };
  }
}