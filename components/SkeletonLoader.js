import React from 'react';

/**
 * Skeleton Loader Component
 * Displays animated skeleton placeholders while content is loading
 */

export const PackageCardSkeleton = ({ count = 4 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-50 rounded-xl overflow-hidden border border-gray-400">
            {/* Image skeleton */}
            <div className="relative w-full aspect-square bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
            </div>

            {/* Content skeleton */}
            <div className="p-5">
              {/* Title skeleton */}
              <div className="space-y-2 mb-3">
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-1/2"></div>
              </div>

              {/* Price skeleton */}
              <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export const CategoryCardSkeleton = ({ count = 9 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-50 h-full rounded-2xl p-6 border border-gray-400">
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded flex-1"></div>
              <div className="w-3 h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export const ProductListSkeleton = ({ count = 9 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-white rounded-lg overflow-hidden border border-gray-200 h-full flex flex-col">
            {/* Image skeleton */}
            <div className="relative w-full aspect-square bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
            </div>

            {/* Content skeleton */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              {/* Title skeleton */}
              <div className="space-y-2 mb-3">
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-4/5"></div>
              </div>

              {/* Rating and price skeleton */}
              <div className="space-y-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-3 h-3 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full"></div>
                  ))}
                </div>
                <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export const PackageDetailSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image skeleton */}
        <div className="relative w-full aspect-square bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-shimmer"></div>
        </div>

        {/* Details skeleton */}
        <div className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-2/3"></div>
          </div>

          {/* Rating */}
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-4 h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-full"></div>
            ))}
          </div>

          {/* Price */}
          <div className="space-y-3">
            <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-full"></div>
          </div>

          {/* Buttons */}
          <div className="space-y-2">
            <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-full"></div>
            <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-full"></div>
          </div>

          {/* Description skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default {
  PackageCardSkeleton,
  CategoryCardSkeleton,
  ProductListSkeleton,
  PackageDetailSkeleton
};
