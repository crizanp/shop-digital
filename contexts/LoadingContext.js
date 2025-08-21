import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading...');
  const router = useRouter();

  // Optimized route change handlers
  const handleRouteChangeStart = useCallback(() => {
    setIsLoading(true);
    setLoadingText('Loading page...');
  }, []);

  const handleRouteChangeComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleRouteChangeError = useCallback(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router, handleRouteChangeStart, handleRouteChangeComplete, handleRouteChangeError]);

  const showLoading = useCallback((text = 'Loading...') => {
    setLoadingText(text);
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, loadingText, showLoading, hideLoading }}>
      {children}
      {isLoading && <GlobalLoadingOverlay text={loadingText} />}
    </LoadingContext.Provider>
  );
};

const GlobalLoadingOverlay = ({ text }) => {
  return (
    <div className="fixed inset-0 bg-white/90 z-[9999] flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center space-y-3">
        {/* Animated dots */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        
        {/* Loading text */}
        <p className="text-base font-medium text-gray-800">{text}</p>
      </div>
    </div>
  );
};
