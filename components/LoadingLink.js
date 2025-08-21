import React from 'react';
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

  const handleClick = (e) => {
    // Show loading immediately when link is clicked
    showLoading(loadingText);
    
    // Call any custom onClick handler
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Link href={href} {...props}>
      <span className={className} onClick={handleClick}>
        {children}
      </span>
    </Link>
  );
};

export default LoadingLink;
