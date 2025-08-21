import React, { useState } from 'react';
import { useLoading } from '../contexts/LoadingContext';

const LoadingButton = ({ 
  children, 
  onClick, 
  loadingText = 'Processing...',
  className = '',
  disabled = false,
  type = 'button',
  ...props 
}) => {
  const { showLoading, hideLoading } = useLoading();
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  const handleClick = async (e) => {
    if (disabled || isLocalLoading) return;

    try {
      setIsLocalLoading(true);
      showLoading(loadingText);
      
      if (onClick) {
        await onClick(e);
      }
    } catch (error) {
      console.error('Error in LoadingButton:', error);
    } finally {
      setIsLocalLoading(false);
      hideLoading();
    }
  };

  const baseClassName = `relative transition-all duration-200 ${disabled || isLocalLoading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}`;

  return (
    <button
      type={type}
      className={`${baseClassName} ${className}`}
      onClick={handleClick}
      disabled={disabled || isLocalLoading}
      {...props}
    >
      {isLocalLoading ? (
        <span className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
          {loadingText}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingButton;
