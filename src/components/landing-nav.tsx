'use client';

import Link from 'next/link';
import { BananaLogo } from './banana-logo';

interface LandingNavProps {
  onStartClick: () => void;
}

export function LandingNav({ onStartClick }: LandingNavProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-1">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <BananaLogo size="sm" animated={false} />
          <span className="text-neutral-3">Giga Banana</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-2">
          <a href="#features" className="hover:text-primary-2 transition-colors">
            Features
          </a>
          <a href="#demo" className="hover:text-primary-2 transition-colors">
            How it works
          </a>
          <button
            onClick={onStartClick}
            className="bg-primary-2 text-white px-6 py-2.5 rounded-full font-bold hover:bg-primary-3 transition-all shadow-sm"
          >
            Start Creating
          </button>
        </div>
      </div>
    </nav>
  );
}
