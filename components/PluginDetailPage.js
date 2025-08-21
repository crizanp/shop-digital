import React, { useState, useEffect } from 'react';
import Image from "next/image";
import { 
  ArrowLeft, 
  CheckCircle, 
  HelpCircle, 
  Info, 
  Download, 
  Star, 
  Shield, 
  Clock, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Globe,
  User,
  Calendar,
  Package,
  FileText,
  Code,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import LoadingLink from './LoadingLink';
import { useLoading } from '../contexts/LoadingContext';

const PluginDetailPage = ({
  pluginData,
  categoryData = null,
  onDownloadRequest = null,
  loading = false,
  error = false, // Add error prop to distinguish between loading and not found
  lightTheme = true // Changed default to true for white theme
}) => {
  const { isLoading } = useLoading();
  const [activeTab, setActiveTab] = useState('description');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedPricing, setSelectedPricing] = useState({});

  // Image carousel handlers
  const nextImage = () => {
    if (pluginData?.images?.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === pluginData.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (pluginData?.images?.length > 1) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? pluginData.images.length - 1 : prev - 1
      );
    }
  };

  // Get category information
  const getCategoryInfo = () => {
    if (!categoryData || !pluginData?.categoryId) return null;

    const category = categoryData.find(cat => cat._id === pluginData.categoryId);
    if (!category) return null;

    const subcategory = category.subcategories?.[pluginData.subcategoryIndex];

    return {
      categoryName: category.name,
      categorySlug: category.slug,
      subcategoryName: subcategory?.name,
      subcategorySlug: subcategory?.slug
    };
  };

  const categoryInfo = getCategoryInfo();

  const handleDownload = () => {
    if (pluginData?.downloadUrl) {
      // Track download
      if (onDownloadRequest) {
        onDownloadRequest({
          pluginId: pluginData._id,
          pluginName: pluginData.name,
          downloadUrl: pluginData.downloadUrl,
          timestamp: new Date().toISOString()
        });
      }
      
      // Open download link
      window.open(pluginData.downloadUrl, '_blank');
    }
  };

  // Show global loading overlay when loading or when no plugin data yet (to prevent immediate "not found")
  if (isLoading || loading || (!pluginData && !error)) {
    return (
      <div className={`min-h-screen ${lightTheme ? 'bg-white' : 'bg-black'}`}>
        <div className={`container mx-auto max-w-7xl px-4 pt-12 ${lightTheme ? 'bg-white text-gray-900' : 'bg-black text-gray-300'}`}>
          {/* Back button skeleton */}
          <div className="animate-pulse mb-4">
            <div className={`h-6 w-32 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded`}></div>
          </div>

          {/* Main grid layout skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
            {/* Left column - Main content */}
            <div className="lg:col-span-2">
              {/* Image carousel skeleton */}
              <div className={`${lightTheme ? 'bg-gray-100' : 'bg-gray-900'} rounded-xl mb-6 border ${lightTheme ? 'border-gray-200' : 'border-gray-800'}`}>
                <div className={`h-64 md:h-80 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded-xl`}></div>
                {/* Carousel controls skeleton */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  <div className={`w-3 h-3 ${lightTheme ? 'bg-gray-300' : 'bg-gray-700'} rounded-full`}></div>
                  <div className={`w-3 h-3 ${lightTheme ? 'bg-gray-300' : 'bg-gray-700'} rounded-full`}></div>
                  <div className={`w-3 h-3 ${lightTheme ? 'bg-gray-300' : 'bg-gray-700'} rounded-full`}></div>
                </div>
              </div>

              {/* Plugin title and info skeleton */}
              <div className={`${lightTheme ? 'bg-gray-100' : 'bg-gray-900'} p-6 rounded-xl mb-6 border ${lightTheme ? 'border-gray-200' : 'border-gray-800'}`}>
                {/* Category badge */}
                <div className={`h-6 w-24 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded-full mb-3`}></div>
                {/* Title */}
                <div className={`h-8 w-3/4 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded mb-2`}></div>
                {/* Description */}
                <div className={`h-4 w-full ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded mb-2`}></div>
                <div className={`h-4 w-2/3 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded mb-4`}></div>
                {/* Price */}
                <div className={`h-10 w-20 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded-full`}></div>
              </div>

              {/* Tabs navigation skeleton */}
              <div className={`${lightTheme ? 'bg-gray-100' : 'bg-gray-900'} rounded-t-lg border ${lightTheme ? 'border-gray-200' : 'border-gray-800'}`}>
                <div className="flex">
                  <div className={`h-12 w-32 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded-t-lg mr-2`}></div>
                  <div className={`h-12 w-36 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded-t-lg mr-2`}></div>
                  <div className={`h-12 w-32 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded-t-lg`}></div>
                </div>
              </div>

              {/* Tab content skeleton */}
              <div className={`${lightTheme ? 'bg-gray-100' : 'bg-gray-900'} p-6 rounded-b-lg border ${lightTheme ? 'border-gray-200 border-t-0' : 'border-gray-800 border-t-0'}`}>
                <div className={`h-4 w-full ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded mb-3`}></div>
                <div className={`h-4 w-5/6 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded mb-3`}></div>
                <div className={`h-4 w-4/5 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded mb-3`}></div>
                <div className={`h-4 w-3/4 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded`}></div>
              </div>
            </div>

            {/* Right column - Sidebar */}
            <div className="lg:col-span-1">
              {/* Download section skeleton */}
              <div className={`${lightTheme ? 'bg-gray-100' : 'bg-gray-900'} p-6 rounded-xl mb-6 border ${lightTheme ? 'border-gray-200' : 'border-gray-800'}`}>
                {/* Download button */}
                <div className={`h-12 w-full ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded-lg mb-4`}></div>
                {/* Demo button */}
                <div className={`h-10 w-full ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded-lg mb-4`}></div>
                {/* Features list */}
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className={`w-5 h-5 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded mr-2`}></div>
                    <div className={`h-4 w-24 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded`}></div>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-5 h-5 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded mr-2`}></div>
                    <div className={`h-4 w-32 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded`}></div>
                  </div>
                  <div className="flex items-center">
                    <div className={`w-5 h-5 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded mr-2`}></div>
                    <div className={`h-4 w-28 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded`}></div>
                  </div>
                </div>
              </div>

              {/* Technical requirements skeleton */}
              <div className={`${lightTheme ? 'bg-gray-100' : 'bg-gray-900'} p-6 rounded-xl mb-6 border ${lightTheme ? 'border-gray-200' : 'border-gray-800'}`}>
                <div className={`h-6 w-40 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded mb-4`}></div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className={`h-4 w-24 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded`}></div>
                    <div className={`h-4 w-16 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded`}></div>
                  </div>
                  <div className="flex justify-between">
                    <div className={`h-4 w-20 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded`}></div>
                    <div className={`h-4 w-12 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded`}></div>
                  </div>
                  <div className="flex justify-between">
                    <div className={`h-4 w-28 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded`}></div>
                    <div className={`h-4 w-14 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded`}></div>
                  </div>
                </div>
              </div>

              {/* Plugin info skeleton */}
              <div className={`${lightTheme ? 'bg-gray-100' : 'bg-gray-900'} p-6 rounded-xl border ${lightTheme ? 'border-gray-200' : 'border-gray-800'}`}>
                <div className={`h-6 w-32 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded mb-4`}></div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <div className={`h-4 w-16 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded`}></div>
                    <div className={`h-4 w-12 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded`}></div>
                  </div>
                  <div className="flex justify-between">
                    <div className={`h-4 w-20 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded`}></div>
                    <div className={`h-4 w-24 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded`}></div>
                  </div>
                  <div className="flex justify-between">
                    <div className={`h-4 w-24 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded`}></div>
                    <div className={`h-4 w-16 ${lightTheme ? 'bg-gray-200' : 'bg-gray-800'} rounded`}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show "not found" only when we have an error or when data fetching is complete but no plugin found
  if (!pluginData && (error || (!loading && !isLoading))) {
    return (
      <div className={`flex flex-col justify-center items-center h-96 ${lightTheme ? 'text-gray-700 bg-white' : 'text-gray-400 bg-gray-900'}`}>
        <div className="text-xl mb-4">Plugin not found</div>
        <LoadingLink href="/plugins" className="text-green-400 hover:text-green-300" loadingText="Returning to plugins...">
          Return to plugins
        </LoadingLink>
      </div>
    );
  }

  const outerBg = lightTheme ? 'bg-white' : 'bg-black';
  const containerBg = lightTheme ? 'bg-white text-gray-900' : 'bg-black text-gray-300';
  const panelBg = lightTheme ? 'bg-white' : 'bg-white';

  // Theme-aware class helpers
  const primaryText = lightTheme ? 'text-gray-900' : 'text-gray-300';
  const secondaryText = lightTheme ? 'text-gray-700' : 'text-gray-400';
  const mutedText = lightTheme ? 'text-gray-600' : 'text-gray-400';
  const cardBgClass = lightTheme ? 'bg-white border border-gray-200 shadow-sm' : 'bg-gray-900 border border-gray-800';
  const badgeBgClass = lightTheme ? 'bg-violet-100 text-violet-700' : 'bg-black/70 text-white';
  const priceBadge = lightTheme ? 'bg-violet-600 text-white' : 'bg-green-900/80 text-white';
  const featureIconBg = lightTheme ? 'bg-violet-50 text-violet-600' : 'bg-green-900/40';
  const buttonClass = lightTheme ? 'bg-violet-600 hover:bg-violet-500 text-white' : 'bg-green-700 hover:bg-green-600 text-white';
  const downloadButtonClass = lightTheme ? 'bg-purple-600 hover:bg-purple-500 text-white' : 'bg-green-700 hover:bg-green-600 text-white';
  const tabActive = lightTheme ? 'text-violet-600 border-b-2 border-violet-600 bg-violet-50' : 'text-green-400 border-b-2 border-green-400 bg-green-900/20';
  const tabInactive = lightTheme ? 'text-gray-600 hover:text-violet-500 hover:bg-gray-50' : 'text-gray-400 hover:text-green-300 hover:bg-gray-800';

  return (
    <div className={`plugin-detail ${outerBg} min-h-screen`}>
      {lightTheme && (
        <style jsx global>{`
          /* don't override elements explicitly marked to preserve their color */
          .plugin-detail *:not(.preserve-color) { color: #0f172a !important; }
          .plugin-detail .download-btn, .plugin-detail .demo-btn { color: #ffffff !important; }
          .plugin-detail .download-btn svg, .plugin-detail .demo-btn svg { color: #ffffff !important; }
          .plugin-detail a { color: #7c3aed !important; }
          .plugin-detail svg { color: inherit !important; }
          .plugin-detail .bg-gradient-to-r { background-image: none !important; }

          /* Strong override: any element inside .preserve-color keeps its color (icons & text)
             This must come after the general rule and use the same specificity and !important. */
          .plugin-detail .preserve-color, .plugin-detail .preserve-color * { color: #ffffff !important; fill: currentColor !important; stroke: currentColor !important; }
        `}</style>
      )}
      
      <div className={`container mx-auto max-w-7xl px-4 pt-12 ${containerBg}`}>
        <LoadingLink href="/plugins" className={`inline-flex items-center ${lightTheme ? 'text-gray-700 hover:text-gray-900' : 'text-green-400 hover:text-green-300'} mb-4 transition-colors`} loadingText="Going back to plugins...">
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span className="font-medium">Back to Plugins</span>
        </LoadingLink>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 order-1 lg:order-1">
            {/* Image Carousel */}
            <div className={`${cardBgClass} rounded-xl overflow-hidden mb-6`}>
              <div className="relative">
                {pluginData.images?.length > 0 ? (
                  <>
                    <Image
                      src={pluginData.images[currentImageIndex]?.url || '/api/placeholder/800/400'}
                      alt={pluginData.images[currentImageIndex]?.alt || pluginData.name}
                      width={0}
                      height={0}
                      sizes="90vw"
                      style={{ width: '100%', height: 'auto' }}
                      className={lightTheme ? '' : 'brightness-75'}
                      priority
                    />
                    
                    {/* Carousel Controls */}
                    {pluginData.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className={`absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors cursor-pointer ${lightTheme ? 'bg-white shadow-md hover:bg-white/95 text-gray-900' : 'bg-black/50 hover:bg-black/70 text-white'}`}
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-colors cursor-pointer ${lightTheme ? 'bg-white shadow-md hover:bg-white/95 text-gray-900' : 'bg-black/50 hover:bg-black/70 text-white'}`}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                        
                        {/* Image Indicators */}
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                          {pluginData.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${
                                index === currentImageIndex 
                                  ? 'bg-white' 
                                  : 'bg-white/50 hover:bg-white/70'
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="h-64 bg-gray-700 flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Mobile title block: show on small screens before tabs */}
            <div className="block lg:hidden px-0 mb-4">
              <div className={`${cardBgClass} rounded-lg p-4 shadow-sm mb-4`}>
                <div className="max-w-3xl">
                  <div className="flex items-center gap-2 mb-3">
                    {pluginData.featured && (
                      <span className="inline-flex bg-gradient-to-r from-violet-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium items-center">
                        <Star size={14} className="mr-1 fill-current" />
                        Featured
                      </span>
                    )}
                    {categoryInfo && (
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm ${badgeBgClass}`}>
                        {categoryInfo.subcategoryName || categoryInfo.categoryName}
                      </span>
                    )}
                    {pluginData.isPremium && (
                      <span className="inline-flex bg-gradient-to-r from-purple-500 to-violet-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Premium
                      </span>
                    )}
                  </div>

                  <h1 className="text-xl md:text-3xl font-bold tracking-tight">{pluginData.name}</h1>
                  {pluginData.shortDescription && (
                    <p className={`mt-2 ${secondaryText} font-light`}>{pluginData.shortDescription}</p>
                  )}
                  <div className="flex items-center mt-3">
                    <span className="inline-flex bg-black text-white px-4 py-1.5 rounded-full text-lg font-bold preserve-color">
                      {pluginData.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className={`${lightTheme ? 'rounded-t-lg overflow-hidden shadow-sm border-b-0' : 'bg-gray-900 rounded-t-lg overflow-hidden shadow-sm border border-gray-800 border-b-0'}`}>
              <div className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`py-4 px-8 font-medium text-base whitespace-nowrap cursor-pointer transition-colors duration-300 ${activeTab === 'description' ? tabActive : tabInactive}`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('documentation')}
                  className={`py-4 px-8 font-medium text-base whitespace-nowrap cursor-pointer transition-colors duration-300 ${activeTab === 'documentation' ? tabActive : tabInactive}`}
                >
                  Documentation
                </button>
                <button
                  onClick={() => setActiveTab('requirements')}
                  className={`py-4 px-8 font-medium text-base whitespace-nowrap cursor-pointer transition-colors duration-300 ${activeTab === 'requirements' ? tabActive : tabInactive}`}
                >
                  Requirements
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className={`${lightTheme ? 'p-6 rounded-b-lg shadow-sm mb-6 border border-gray-200 bg-white' : 'bg-gray-900 p-6 rounded-b-lg shadow-md mb-6 border border-gray-800 border-t-0'}`}>
              {/* Description Tab */}
              {activeTab === 'description' && (
                <div className="description-content">
                  {lightTheme ? (
                    <style jsx global>{`
                      .description-content h2 { font-size: 1.75rem; font-weight: 700; color: #0f172a; margin-top: 1.5rem; margin-bottom: 1rem; line-height: 1.3; }
                      .description-content h3 { font-size: 1.35rem; font-weight: 600; color: #111827; margin-bottom: 0.75rem; margin-top: 1.25rem; line-height: 1.3; }
                      .description-content p { margin-bottom: 1.25rem; color: #374151; line-height: 1.6; font-size: 1.05rem; }
                      .description-content ul { list-style-type: disc; padding-left: 1.75rem; margin-bottom: 1.25rem; }
                      .description-content li { color: #374151; margin-bottom: 0.5rem; line-height: 1.6; font-size: 1.05rem; }
                      .description-content strong { color: #6d28d9; font-weight: 600; }
                      .description-content a { color: #7c3aed; text-decoration: underline; transition: color 0.2s; }
                      .description-content a:hover { color: #6d28d9; }
                      .description-content blockquote { border-left: 4px solid #8b5cf6; padding-left: 1rem; margin-left: 0; margin-right: 0; font-style: italic; color: #374151; }
                      .description-content *:first-child { margin-top: 0; }
                    `}</style>
                  ) : (
                    <style jsx global>{`
                      .description-content h2 { font-size: 1.75rem; font-weight: 700; color: #e2e8f0; margin-top: 1.5rem; margin-bottom: 1rem; line-height: 1.3; }
                      .description-content h3 { font-size: 1.35rem; font-weight: 600; color: #cbd5e0; margin-bottom: 0.75rem; margin-top: 1.25rem; line-height: 1.3; }
                      .description-content p { margin-bottom: 1.25rem; color: #a0aec0; line-height: 1.6; font-size: 1.05rem; }
                      .description-content ul { list-style-type: disc; padding-left: 1.75rem; margin-bottom: 1.25rem; }
                      .description-content li { color: #a0aec0; margin-bottom: 0.5rem; line-height: 1.6; font-size: 1.05rem; }
                      .description-content strong { color: #c4b5fd; font-weight: 600; }
                      .description-content a { color: #a78bfa; text-decoration: underline; transition: color 0.2s; }
                      .description-content a:hover { color: #c4b5fd; }
                      .description-content blockquote { border-left: 4px solid #9f7aea; padding-left: 1rem; margin-left: 0; margin-right: 0; font-style: italic; color: #a0aec0; }
                      .description-content *:first-child { margin-top: 0; }
                    `}</style>
                  )}
                  <div dangerouslySetInnerHTML={{
                    __html: pluginData.longDescription || pluginData.shortDescription || '<p>No detailed description available.</p>'
                  }} />
                </div>
              )}

              {/* Documentation Tab */}
              {activeTab === 'documentation' && (
                <div className="description-content">
                  {pluginData.documentation ? (
                    <div dangerouslySetInnerHTML={{
                      __html: pluginData.documentation
                    }} />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <FileText className="w-10 h-10 text-gray-600 mb-2" />
                      <p className="text-gray-400 text-lg">No documentation available for this plugin.</p>
                      <p className="text-gray-500 text-base mt-1">Check the plugin files after download for setup instructions.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Requirements Tab */}
              {activeTab === 'requirements' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`${lightTheme ? 'bg-gray-50' : 'bg-gray-800'} p-4 rounded-lg`}>
                      <h3 className={`font-semibold ${primaryText} mb-3 flex items-center`}>
                        <Code className="w-5 h-5 mr-2" />
                        Technical Requirements
                      </h3>
                      <ul className="space-y-2">
                        <li className={`${secondaryText} flex justify-between`}>
                          <span>WordPress Version:</span>
                          <span className="font-medium">{pluginData.requirements?.wordpressVersion || '5.0+'}</span>
                        </li>
                        <li className={`${secondaryText} flex justify-between`}>
                          <span>PHP Version:</span>
                          <span className="font-medium">{pluginData.requirements?.phpVersion || '7.4+'}</span>
                        </li>
                        <li className={`${secondaryText} flex justify-between`}>
                          <span>Tested up to:</span>
                          <span className="font-medium">{pluginData.requirements?.testedUpTo || '6.4'}</span>
                        </li>
                      </ul>
                    </div>

                    <div className={`${lightTheme ? 'bg-gray-50' : 'bg-gray-800'} p-4 rounded-lg`}>
                      <h3 className={`font-semibold ${primaryText} mb-3 flex items-center`}>
                        <Info className="w-5 h-5 mr-2" />
                        Plugin Info
                      </h3>
                      <ul className="space-y-2">
                        <li className={`${secondaryText} flex justify-between`}>
                          <span>Version:</span>
                          <span className="font-medium">{pluginData.version}</span>
                        </li>
                        <li className={`${secondaryText} flex justify-between`}>
                          <span>Author:</span>
                          <span className="font-medium">{pluginData.author}</span>
                        </li>
                        <li className={`${secondaryText} flex justify-between`}>
                          <span>Downloads:</span>
                          <span className="font-medium">{pluginData.downloads?.toLocaleString()}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Plugin Info and Download */}
          <div className="space-y-6 order-2 lg:order-2">
            <div className={`${cardBgClass} rounded-lg p-5 shadow-sm`}>
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 mb-3">
                  {pluginData.featured && (
                    <span className="inline-flex bg-gradient-to-r from-violet-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium items-center">
                      <Star size={14} className="mr-1 fill-current" />
                      Featured
                    </span>
                  )}
                  {categoryInfo && (
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm ${badgeBgClass}`}>
                      {categoryInfo.subcategoryName || categoryInfo.categoryName}
                    </span>
                  )}
                  {pluginData.isPremium && (
                    <span className="inline-flex bg-gradient-to-r from-purple-500 to-violet-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Premium
                    </span>
                  )}
                </div>

                {/* Title/details block visible on lg and above (hidden on mobile because we show mobile title above) */}
                <div className="hidden lg:block">
                  <h1 className="text-xl md:text-3xl font-bold tracking-tight">{pluginData.name}</h1>
                  {pluginData.shortDescription && (
                    <p className={`mt-2 ${secondaryText} font-light`}>{pluginData.shortDescription}</p>
                  )}
                  <div className="flex items-center mt-4 space-x-4">
                    {/* rating placeholder (kept hidden/commented as before) */}
                  </div>

                  <div className="flex items-center mt-3">
                    <span className="inline-flex bg-black text-white px-4 py-1.5 rounded-full text-lg font-bold preserve-color">
                      {pluginData.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            {pluginData.features?.length > 0 && (
              <div className={`${cardBgClass} rounded-lg p-5 shadow-sm`}>
                <h2 className={`text-xl font-bold ${primaryText} mb-3`}>Key Features</h2>
                <ul className="space-y-3">
                  {pluginData.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <div className={`${featureIconBg} p-1 rounded-full mt-0.5 mr-3 shrink-0`}>
                        <CheckCircle className={`w-4 h-4 ${lightTheme ? 'text-violet-600' : 'text-green-400'}`} />
                      </div>
                      <span className={`${secondaryText} text-base`}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Download Section */}
            <div className={`${cardBgClass} rounded-lg p-5 shadow-sm`}>
              <h2 className={`text-xl font-bold ${primaryText} mb-4`}>Download Plugin</h2>
              
              <div className="space-y-4">
                <button
                  onClick={handleDownload}
                  className={`w-full ${lightTheme ? 'bg-black text-white preserve-color cursor-pointer' : downloadButtonClass} font-bold py-3 px-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg download-btn`}
                >
                  <Download className="w-5 h-5 mr-2 text-white preserve-color" />
                  Download Now
                </button>

                {pluginData.demoUrl && (
                  <button
                    onClick={() => window.open(pluginData.demoUrl, '_blank')}
                    className={`w-full ${lightTheme ? 'bg-black text-white preserve-color cursor-pointer' : buttonClass} font-bold py-3 px-6 rounded-xl text-lg transition-all duration-300 flex items-center justify-center demo-btn`}
                  >
                    <ExternalLink className="w-5 h-5 mr-2 text-white preserve-color " />
                    View Demo
                  </button>
                )}

                <div className="text-center">
                  <div className={`${mutedText} text-sm flex items-center justify-center`}>
                    <Download className="w-4 h-4 mr-1" />
                    {pluginData.downloads?.toLocaleString()} downloads
                  </div>
                </div>
              </div>
            </div>

            {/* Plugin Info */}
            <div className={`${cardBgClass} rounded-lg p-5 shadow-sm`}>
              <h2 className={`text-xl font-bold ${primaryText} mb-4`}>Plugin Information</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`${mutedText}`}>Version:</span>
                  <span className={`${primaryText} font-medium`}>{pluginData.version}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`${mutedText}`}>Author:</span>
                  <span className={`${primaryText} font-medium`}>{pluginData.author}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`${mutedText}`}>Last Updated:</span>
                  <span className={`${primaryText} font-medium`}>
                    {new Date(pluginData.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
                {pluginData.authorUrl && (
                  <div className="pt-2 border-t border-gray-200">
                    <a
                      href={pluginData.authorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center ${lightTheme ? 'text-violet-600 hover:text-violet-500' : 'text-green-400 hover:text-green-300'} transition-colors`}
                    >
                      <Globe className="w-4 h-4 mr-1" />
                      Author Website
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Tags */}
            {pluginData.tags?.length > 0 && (
              <div className={`${cardBgClass} rounded-lg p-5 shadow-sm mb-4`}>
                <h2 className={`text-xl font-bold ${primaryText} mb-3`}>Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {pluginData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 ${lightTheme ? 'bg-gray-100 text-gray-700' : 'bg-gray-700 text-gray-300'} rounded-full text-sm`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PluginDetailPage;
