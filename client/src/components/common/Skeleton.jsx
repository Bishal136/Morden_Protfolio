import React from 'react';

export const Skeleton = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200/80 rounded-md ${className}`}
      aria-hidden="true"
    />
  );
};

export const CardSkeleton = () => (
  <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
    <Skeleton className="aspect-[16/10] w-full rounded-2xl" />
    <div className="flex gap-2 pt-1">
      <Skeleton className="h-5 w-16 rounded-md" />
      <Skeleton className="h-5 w-20 rounded-md" />
      <Skeleton className="h-5 w-14 rounded-md" />
    </div>
    <Skeleton className="h-6 w-3/4 rounded-lg" />
    <Skeleton className="h-4 w-full rounded-md" />
    <Skeleton className="h-4 w-2/3 rounded-md" />
    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
      <Skeleton className="h-8 w-24 rounded-xl" />
      <Skeleton className="h-4 w-20 rounded-md" />
    </div>
  </div>
);

export const SkillsBentoSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-2xl" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-5 w-32 rounded-md" />
            <Skeleton className="h-3 w-48 rounded-md" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {[1, 2, 3, 4].map((chip) => (
            <Skeleton key={chip} className="h-14 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export const HeroSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12">
    <div className="lg:col-span-7 space-y-6">
      <Skeleton className="h-7 w-64 rounded-full" />
      <div className="space-y-3">
        <Skeleton className="h-16 w-3/4 rounded-2xl" />
        <Skeleton className="h-8 w-1/2 rounded-xl" />
      </div>
      <Skeleton className="h-20 w-full rounded-2xl" />
      <div className="flex gap-4 pt-4">
        <Skeleton className="h-12 w-36 rounded-xl" />
        <Skeleton className="h-12 w-32 rounded-xl" />
      </div>
    </div>
    <div className="lg:col-span-5 flex justify-center">
      <Skeleton className="w-72 sm:w-80 aspect-[4/5] rounded-3xl" />
    </div>
  </div>
);

export default Skeleton;
