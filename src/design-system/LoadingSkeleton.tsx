import React from 'react';

export interface LoadingSkeletonProps {
  type?: 'card' | 'row' | 'metric' | 'text';
  count?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'card',
  count = 3,
  className = '',
}) => {
  const items = Array.from({ length: count });

  if (type === 'metric') {
    return (
      <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
        {items.map((_, i) => (
          <div key={i} className="p-4 rounded-xl bg-[#111118] border border-[#292936] animate-pulse space-y-3">
            <div className="h-3 w-1/2 bg-[#171720] rounded" />
            <div className="h-7 w-1/3 bg-[#171720] rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'row') {
    return (
      <div className={`space-y-3 ${className}`}>
        {items.map((_, i) => (
          <div key={i} className="p-4 rounded-xl bg-[#111118] border border-[#292936] animate-pulse flex items-center justify-between">
            <div className="flex items-center gap-3 w-1/2">
              <div className="w-8 h-8 rounded-lg bg-[#171720]" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 w-1/2 bg-[#171720] rounded" />
                <div className="h-2 w-1/3 bg-[#171720] rounded" />
              </div>
            </div>
            <div className="h-5 w-20 bg-[#171720] rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'text') {
    return (
      <div className={`space-y-2 animate-pulse ${className}`}>
        <div className="h-3 w-3/4 bg-[#171720] rounded" />
        <div className="h-3 w-full bg-[#171720] rounded" />
        <div className="h-3 w-1/2 bg-[#171720] rounded" />
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {items.map((_, i) => (
        <div key={i} className="p-5 rounded-2xl bg-[#111118] border border-[#292936] animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-9 h-9 rounded-xl bg-[#171720]" />
            <div className="h-4 w-16 bg-[#171720] rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-2/3 bg-[#171720] rounded" />
            <div className="h-3 w-full bg-[#171720] rounded" />
          </div>
          <div className="pt-3 border-t border-[#292936] flex justify-between">
            <div className="h-3 w-20 bg-[#171720] rounded" />
            <div className="h-3 w-12 bg-[#171720] rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};
