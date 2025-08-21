import React, { useCallback } from 'react';
import Link from 'next/link';
import { useLoading } from '../contexts/LoadingContext';

const LoadingLink = ({ 
  children, 
  href, 
  loadingText = 'Loading...',
  className = '',
  onClick,
  ...props 
}) => {
  const { showLoading } = useLoading();

  const handleClick = useCallback((e) => {
    // Only show loading for actual navigation (not hash links)
    if (href && !href.startsWith('#')) {
      showLoading(loadingText);
    }
    
    // Call any custom onClick handler
    if (onClick) {
      onClick(e);
    }
  }, [href, loadingText, onClick, showLoading]);

  return (
    <Link href={href} {...props}>
      <span className={`${className} transition-transform duration-100 active:scale-95`} onClick={handleClick}>
        {children}
      </span>
    </Link>
  );
};

export default LoadingLink;
