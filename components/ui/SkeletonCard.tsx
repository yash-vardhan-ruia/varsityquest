import React from "react";

export default function SkeletonCard() {
  return (
    <div className="w-full bg-surface-lowest rounded-lg border border-outline-variant-custom/40 shadow-level1 overflow-hidden animate-pulse">
      {/* Image Banner Shimmer */}
      <div className="h-48 w-full bg-surface-container"></div>

      {/* Content Area Shimmer */}
      <div className="p-4 space-y-4">
        {/* Category Badge & Rating */}
        <div className="flex justify-between items-center">
          <div className="h-5 w-20 bg-surface-container rounded-sm"></div>
          <div className="h-4 w-12 bg-surface-container rounded"></div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-6 w-3/4 bg-surface-container rounded"></div>
          <div className="h-4 w-1/2 bg-surface-container rounded"></div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-surface-container"></div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <div className="h-3 w-8 bg-surface-container rounded"></div>
            <div className="h-4 w-16 bg-surface-container rounded"></div>
          </div>
          <div className="space-y-1">
            <div className="h-3 w-8 bg-surface-container rounded"></div>
            <div className="h-4 w-16 bg-surface-container rounded"></div>
          </div>
          <div className="space-y-1">
            <div className="h-3 w-8 bg-surface-container rounded"></div>
            <div className="h-4 w-16 bg-surface-container rounded"></div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-surface-container"></div>

        {/* Bottom Actions */}
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 w-24 bg-surface-container rounded"></div>
          <div className="h-8 w-20 bg-surface-container rounded"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
