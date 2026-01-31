'use client';

import { ReactNode } from 'react';

interface BananaBackgroundProps {
  children: ReactNode;
  className?: string;
}

export function BananaBackground({ children, className = '' }: BananaBackgroundProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-1/50 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-100/50 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-pink-100/40 rounded-full blur-3xl" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
