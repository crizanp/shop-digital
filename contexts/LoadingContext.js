import React, { createContext, useContext, useState, useEffect } from 'react';
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
  const [globalClicking, setGlobalClicking] = useState(false);
  const router = useRouter();

  // Show loading immediately on route change start
  useEffect(() => {
    const handleRouteChangeStart = (url) => {
      setIsLoading(true);
      setLoadingText('Loading page...');
    };

    const handleRouteChangeComplete = () => {
      setIsLoading(false);
      setGlobalClicking(false);
    };

    const handleRouteChangeError = () => {
      setIsLoading(false);
      setGlobalClicking(false);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    router.events.on('routeChangeError', handleRouteChangeError);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
      router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [router]);

  // Add global click event listeners for instant feedback
  useEffect(() => {
    const handleGlobalClick = (event) => {
      const target = event.target;
      const clickableElement = target.closest('a, button, [role="button"]');
      
      if (clickableElement) {
        // Add instant visual feedback
        clickableElement.classList.add('loading-click');
        setTimeout(() => {
          clickableElement.classList.remove('loading-click');
        }, 150);
        
        // Set global clicking state for navigation links
        if (clickableElement.tagName === 'A' && clickableElement.href && !clickableElement.href.startsWith('#')) {
          setGlobalClicking(true);
          setTimeout(() => setGlobalClicking(false), 500); // Reset after 500ms
        }
      }
    };

    document.addEventListener('click', handleGlobalClick, true);
    return () => document.removeEventListener('click', handleGlobalClick, true);
  }, []);

  const showLoading = (text = 'Loading...') => {
    setLoadingText(text);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
    setGlobalClicking(false);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, loadingText, showLoading, hideLoading, globalClicking }}>
      {children}
      {(isLoading || globalClicking) && <GlobalLoadingOverlay text={loadingText} />}
    </LoadingContext.Provider>
  );
};

const GlobalLoadingOverlay = ({ text }) => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm z-[9999] flex items-center justify-center loading-overlay">
      <div className="bg-white p-8 flex flex-col items-center space-y-4 border border-gray-200">
        {/* Animated spinner */}
        
        
        {/* Loading text */}
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800">{text}</p>
        </div>
        
        {/* Animated dots */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};
