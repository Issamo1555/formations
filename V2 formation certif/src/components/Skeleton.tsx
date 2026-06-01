'use client';

import React from 'react';

// Base skeleton primitive
export function Skeleton({
  className = '',
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`skeleton ${className}`}
      style={style}
    />
  );
}

// Skeleton for dashboard page
export function DashboardSkeleton() {
  return (
    <div className="animate-fade-in">
      {/* Hero skeleton */}
      <div className="rounded-2xl border border-[var(--border-light)] p-6 sm:p-8 mb-8 overflow-hidden"
        style={{ background: 'var(--bg-panel)' }}
      >
        <Skeleton className="h-6 w-32 rounded-full mb-4" />
        <Skeleton className="h-8 w-3/4 rounded-lg mb-3" />
        <Skeleton className="h-5 w-1/2 rounded-lg mb-6" />
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card">
            <div className="flex items-center justify-between mb-3">
              <Skeleton className="h-4 w-24 rounded-md" />
              <Skeleton className="h-6 w-12 rounded-full" />
            </div>
            <Skeleton className="h-9 w-16 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Course cards skeleton */}
      <Skeleton className="h-6 w-48 rounded-lg mb-6" />
      <div className="grid sm:grid-cols-2 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card">
            <Skeleton className="h-14 w-14 rounded-xl mb-4" />
            <Skeleton className="h-5 w-3/4 rounded-lg mb-2" />
            <Skeleton className="h-4 w-1/3 rounded-md mb-4" />
            <Skeleton className="h-2 w-full rounded-full mb-4" />
            <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-8 w-24 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Skeleton for course page
export function CourseSkeleton() {
  return (
    <div className="min-h-screen flex animate-fade-in">
      {/* Sidebar skeleton */}
      <aside className="hidden lg:flex flex-col w-72 border-r border-[var(--border-light)] h-screen sticky top-0"
        style={{ backgroundColor: 'var(--bg-panel)' }}
      >
        <div className="p-4 border-b border-[var(--border-light)]">
          <Skeleton className="h-4 w-32 rounded-md mb-3" />
          <Skeleton className="h-5 w-48 rounded-md mb-2" />
          <div className="flex items-center gap-2 mt-2">
            <Skeleton className="h-2 flex-1 rounded-full" />
            <Skeleton className="h-4 w-8 rounded-md" />
          </div>
        </div>
        <div className="p-3 space-y-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5">
              <Skeleton className="h-4 w-4 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-full rounded-md mb-1" />
                <Skeleton className="h-3 w-16 rounded-sm" />
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main content skeleton */}
      <main className="flex-1">
        <div className="px-4 sm:px-8 lg:px-12 py-8 max-w-4xl">
          <div className="flex items-center gap-2 mb-6">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="flex gap-1 p-1 mb-8 w-fit">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-lg" />
            ))}
          </div>
          <div className="border border-[var(--border-light)] rounded-2xl p-6 sm:p-8"
            style={{ backgroundColor: 'var(--bg-panel)' }}
          >
            <Skeleton className="h-7 w-3/4 rounded-lg mb-4" />
            <Skeleton className="h-4 w-full rounded-md mb-2" />
            <Skeleton className="h-4 w-full rounded-md mb-2" />
            <Skeleton className="h-4 w-5/6 rounded-md mb-4" />
            <Skeleton className="h-4 w-full rounded-md mb-2" />
            <Skeleton className="h-4 w-2/3 rounded-md mb-6" />
            <Skeleton className="h-32 w-full rounded-xl mb-4" />
            <Skeleton className="h-4 w-full rounded-md mb-2" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
          </div>
        </div>
      </main>
    </div>
  );
}

// Skeleton for profile page
export function ProfileSkeleton() {
  return (
    <div className="animate-fade-in">
      {/* Profile header */}
      <div className="card mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <Skeleton className="w-20 h-20 rounded-2xl" />
        <div className="flex-1 text-center sm:text-left">
          <Skeleton className="h-7 w-48 rounded-lg mb-2" />
          <Skeleton className="h-4 w-40 rounded-md mb-2" />
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="card text-center py-5">
            <Skeleton className="h-6 w-6 rounded-md mx-auto mb-2" />
            <Skeleton className="h-8 w-12 rounded-lg mx-auto mb-1" />
            <Skeleton className="h-3 w-20 rounded-sm mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
