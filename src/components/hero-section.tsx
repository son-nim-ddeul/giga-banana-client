'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onStart: () => void;
  isLoading?: boolean;
}

export function HeroSection({ onStart, isLoading }: HeroSectionProps) {
  return (
    <section className="relative flex flex-col items-center justify-center text-center px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-1/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-100/50 rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mb-8"
      >
        <div className="w-28 h-28 bg-gradient-to-br from-yellow-100 to-pink-100 rounded-3xl shadow-xl flex items-center justify-center overflow-hidden">
          <Image
            src="/giga_banana.png"
            alt="Giga Banana"
            width={112}
            height={112}
            className="object-contain"
            priority
          />
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative z-10"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-neutral-3 mb-4">
          Giga Banana
        </h1>
        <p className="text-xl text-neutral-2 mb-2">
          AI 이미지 생성 플랫폼
        </p>
        <p className="text-base text-neutral-2/70 max-w-md mx-auto">
          창의적인 아이디어를 현실로. 간단한 텍스트로 놀라운 이미지를 만들어보세요.
        </p>
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative z-10 mt-10"
      >
        <button
          onClick={onStart}
          disabled={isLoading}
          className="group relative px-8 py-4 bg-primary-2 hover:bg-primary-3 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-80 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <span className="flex items-center gap-3">
            {isLoading ? '확인 중...' : '시작하기'}
            <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </button>
      </motion.div>
    </section>
  );
}
