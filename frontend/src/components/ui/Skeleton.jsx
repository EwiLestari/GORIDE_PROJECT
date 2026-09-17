import React from 'react';

export const Skeleton = ({ className = '', variant = 'rectangular' }) => {
  const variantClasses = {
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
    text: 'rounded-md h-4 w-full'
  };

  return (
    <div
      className={`animate-pulse ${variantClasses[variant]} ${className}`}
      style={{ backgroundColor: 'var(--bg-subtle)' }}
    ></div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="glass-panel p-5 rounded-2xl flex flex-col h-full">
      <Skeleton className="w-full h-48 mb-4" />
      <div className="flex justify-between items-start mb-2">
        <Skeleton variant="text" className="w-1/2 h-6" />
        <Skeleton variant="circular" className="w-8 h-8 shrink-0" />
      </div>
      <Skeleton variant="text" className="w-1/3 h-3 mb-4" />
      <div className="flex gap-4 mb-6">
        <Skeleton variant="text" className="w-16 h-8" />
        <Skeleton variant="text" className="w-16 h-8" />
      </div>
      <div className="mt-auto pt-4 border-t border-[var(--border-base)] flex justify-between items-center">
        <Skeleton variant="text" className="w-1/3 h-5" />
        <Skeleton variant="rectangular" className="w-24 h-10 rounded-lg" />
      </div>
    </div>
  );
};

export const DetailSkeleton = () => {
  return (
    <div className="grid md:grid-cols-2 gap-10">
      <div className="flex flex-col gap-8">
        <div className="glass-panel p-6 rounded-2xl">
          <Skeleton className="w-full h-64 mb-6" />
          <Skeleton variant="text" className="w-2/3 h-8 mb-2" />
          <Skeleton variant="text" className="w-1/3 h-4 mb-4" />
          <Skeleton variant="text" className="w-full h-24" />
        </div>
        <div className="glass-panel p-6 rounded-2xl">
          <Skeleton variant="text" className="w-1/2 h-6 mb-6" />
          <Skeleton className="w-full h-32" />
        </div>
      </div>
      <div>
        <div className="glass-panel p-8 sticky top-28">
          <Skeleton variant="text" className="w-1/2 h-6 mb-6" />
          <Skeleton className="w-full h-20 mb-8" />
          <div className="flex flex-col gap-5">
            <Skeleton className="w-full h-16" />
            <Skeleton className="w-full h-16" />
            <Skeleton className="w-full h-16" />
            <div className="mt-4 pt-6 border-t border-[var(--border-base)] flex justify-end gap-4">
              <Skeleton className="w-24 h-10 rounded-lg" />
              <Skeleton className="w-32 h-10 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
