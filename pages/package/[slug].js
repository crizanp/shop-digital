// pages/details/[slug].js
import Head from 'next/head';
import { useState } from 'react';
import { Star, ChevronRight, Menu, X, FileDown, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import connectDB from '@/lib/mongodb';
import { Package, Category } from '@/lib/models';
import { useCurrency } from '@/contexts/CurrencyContext';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { truncateText } from '@/lib/seo-helpers';
import { generateQuotationPDF } from '@/lib/pdf-generator';
import { PackageDetailSkeleton } from '@/components/SkeletonLoader';

const slugify = (s = '') =>
  s
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export default function PackageDetail({ packageData, categories, relatedPackages, categoryData }) {
  const baseUrl = 'https://shop.foxbeep.com';
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quotationPanelOpen, setQuotationPanelOpen] = useState(false);
  const { currencyInfo, exchangeRates } = useCurrency();

  if (!packageData) {
    return <div>Product not found</div>;
  }

  // Generate SEO metadata
  const canonicalUrl = `${baseUrl}/package/${packageData.slug || packageData._id}`;
  const seoTitle = `${packageData.name || packageData.title} | Professional ${categoryData?.name || 'Services'} | Foxbeep`;
  const metaDescription = truncateText(
    packageData.description || packageData.summary || `Buy ${packageData.name || packageData.title} on Foxbeep Marketplace. Professional ${categoryData?.name || 'services'} from verified providers.`,
    160
  );
  const productImage = packageData.image || packageData.images?.[0] || 'https://shop.foxbeep.com/images/default-product.png';

  // Structured data for Product
  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: packageData.name || packageData.title,
    description: packageData.description || '',
    image: productImage,
    url: canonicalUrl,
    brand: {
      '@type': 'Brand',
      name: 'Foxbeep'
    },
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'USD',
      price: packageData.price ? String(packageData.price).replace(/[^0-9.]/g, '') : '0',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: packageData.seller || packageData.author || 'Foxbeep'
      }
    },
    aggregateRating: packageData.rating ? {
      '@type': 'AggregateRating',
      ratingValue: packageData.rating,
      reviewCount: packageData.reviews || packageData.reviewCount || 0
    } : undefined
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: categoryData?.name || 'Products',
        item: `${baseUrl}/category/${categoryData?.slug}`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: packageData.name || packageData.title,
        item: canonicalUrl
      }
    ]
  };
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

  // Handle quotation request with PDF generation
  const handleQuotationRequest = async () => {
    try {
      // Generate PDF first
      await generateQuotationPDF(packageData, quantity, selectedOptions, calculateTotal(), currencyInfo);

      const quotationData = {
        packageTitle: packageData.title,
        quantity,
        totalPrice: calculateTotal(),
        selectedOptions,
        timestamp: new Date().toISOString()
      };

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
        alert('Quotation PDF downloaded! Message sent successfully via WhatsApp API.');
      } else {
        console.error('WhatsApp send error:', data);
        alert('Quotation PDF downloaded! You can also contact via WhatsApp.');
      }
    } catch (err) {
      console.error('Error sending quotation:', err);
      alert('Failed to process quotation.');
    }
  };

  // Handle PDF download only
  const handleDownloadPDF = async () => {
    try {
      await generateQuotationPDF(packageData, quantity, selectedOptions, calculateTotal(), currencyInfo);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert('Failed to download PDF.');
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
        <title>{seoTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={`${packageData.name || packageData.title}, ${categoryData?.name || ''}, buy ${packageData.name || packageData.title}, professional ${packageData.name || packageData.title}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta charSet="UTF-8" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:type" content="product" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={productImage} />
        <meta property="og:site_name" content="Foxbeep Marketplace" />
        <meta property="product:price:amount" content={packageData.price ? String(packageData.price).replace(/[^0-9.]/g, '') : '0'} />
        <meta property="product:price:currency" content="USD" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={productImage} />
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Head>

      <Navbar />

      <div className="min-h-screen bg-white pb-20 lg:pb-0">
        {!packageData ? (
          <>
            <div className="max-w-7xl mx-auto px-6 py-8">
              <PackageDetailSkeleton />
            </div>
          </>
        ) : (
          <>
            {/* Get Quotation Button for Mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <button
              onClick={() => setQuotationPanelOpen(!quotationPanelOpen)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
            >
              <Menu size={20} />
              <span>Get Quotation</span>
            </button>
          </div>
        </div>

        {/* Mobile Quotation Panel Overlay */}
        {quotationPanelOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setQuotationPanelOpen(false)}
          />
        )}

        {/* Breadcrumb */}
        <div className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-4 overflow-x-auto">
            <div className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
              <Link href="/" className="hover:text-gray-900">Home</Link>
              <ChevronRight size={14} className="flex-shrink-0" />
              {category && (
                <>
                  <Link href={`/category/${category.slug}`} className="hover:text-gray-900">
                    {category.name}
                  </Link>
                  <ChevronRight size={14} className="flex-shrink-0" />
                </>
              )}
              <span className="text-gray-900">{packageData.title}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8 sm:hidden">
            {packageData.title}
          </h1>
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
            <div className={`lg:col-span-1 ${quotationPanelOpen
              ? 'fixed left-0 top-0 h-screen w-full bg-white shadow-lg z-50  lg:static lg:w-auto lg:relative lg:block flex flex-col'
              : 'hidden lg:block'
              }`}>
              {/* Close button for mobile */}
              {quotationPanelOpen && (
                <div className="flex justify-between items-center p-4 lg:hidden border-b border-gray-200 flex-shrink-0">
                  <h3 className="text-base font-semibold bg-gray-800 p-2 rounded text-gray-100">Get Quotation</h3>
                  <button
                    onClick={() => setQuotationPanelOpen(false)}
                    className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                  >
                    <X size={24} className="text-gray-900" />
                  </button>
                </div>
              )}

              {/* Product Info Card - Scrollable Content */}
              <div className={`${quotationPanelOpen ? 'flex-1 overflow-y-auto' : ''} lg:bg-white lg:border lg:border-gray-600 lg:rounded-lg  lg:mb-6 lg:sticky lg:top-6`}>
                <div className={`bg-white ${quotationPanelOpen ? 'rounded-none border-none p-4' : 'rounded-lg border border-gray-200 p-6'} lg:rounded-lg lg:border lg:p-6`}>
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
                  {/* Download PDF Button */}
                  <button
                    onClick={handleDownloadPDF}
                    className="w-full cursor-pointer bg-gray-900 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-medium transition-colors mb-4 flex items-center justify-center gap-2"
                  >
                    <FileDown size={18} />
                    Download Quotation PDF
                  </button>
                  {/* CTA Button */}
                  <button
                    onClick={handleQuotationRequest}
                    className="w-full bg-blue-900 cursor-pointer hover:bg-blue-800 text-white py-3 px-6 rounded-lg font-medium transition-colors mb-3 flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={18} />
                    Contact WhatsApp
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
                    href={`/package/${pkg.slug || slugify(pkg.title)}`}
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
                        ${pkg.price}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
        <Footer />
          </>
        )}
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

    // Get the category data
    const categoryData = categories.find(cat => String(cat._id) === String(found.categoryId)) || null;

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
        categoryData: deepSerialize(categoryData),
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