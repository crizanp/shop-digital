"use client";

// Create a custom hook for smooth scrolling
import { useEffect } from 'react';

export function useSmoothScroll() {
  useEffect(() => {
    // Function to handle anchor link clicks
    const handleClick = (e) => {
      // Only handle links with hash
      const href = e.target.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      
      e.preventDefault();
      
      // Get the target element
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        // Calculate offset to account for fixed navbar (adjust 80px as needed based on navbar height)
        const offset = 80;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
        
        // Smooth scroll to the target
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Update URL without scrolling (modern browsers)
        if (history.pushState) {
          history.pushState(null, null, href);
        } else {
          location.hash = href;
        }
      }
    };

    // Add event listeners to all links with hash
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', handleClick);
    });

    // Cleanup function
    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleClick);
      });
    };
  }, []);
}

// Function to handle direct navigation to a hash URL
export function handleHashScroll() {
  useEffect(() => {
    // Check if there's a hash in the URL when the page loads
    if (window.location.hash) {
      // Slight delay to ensure the page has fully loaded
      setTimeout(() => {
        const targetId = window.location.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Calculate offset to account for fixed navbar
          const offset = 80;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
          
          // Smooth scroll to the target
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, []);
}