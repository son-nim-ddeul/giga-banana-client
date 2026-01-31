'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { s3UriToImageUrl } from '@/lib/utils';

interface AnalysisPopupProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  tags: string[];
}

export function AnalysisPopup({
  isOpen,
  onClose,
  imageUrl,
  tags,
}: AnalysisPopupProps) {
  const [visibleTags, setVisibleTags] = useState(0);

  // Reset visible tags when popup opens
  useEffect(() => {
    if (isOpen) {
      setVisibleTags(0);
    }
  }, [isOpen]);

  // Show tags one by one with 0.4s interval
  useEffect(() => {
    if (!isOpen || visibleTags >= tags.length) return;

    const timer = setTimeout(() => {
      setVisibleTags((prev) => prev + 1);
    }, 400);

    return () => clearTimeout(timer);
  }, [isOpen, visibleTags, tags.length]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-3xl p-6 max-w-md w-full mx-4 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-neutral-2 hover:text-neutral-3 hover:bg-neutral-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-neutral-3">이미지 분석 완료</h3>
          </div>

          {/* Image with gradient glow */}
          <div className="relative flex justify-center mb-6">
            {/* Gradient glow background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[240px] h-[240px] rounded-3xl bg-gradient-to-br from-violet-400 via-purple-400 to-pink-400 blur-2xl opacity-40" />
            </div>

            {/* Image */}
            <div className="relative w-[200px] h-[200px] rounded-2xl overflow-hidden border-2 border-white shadow-xl z-10">
              <Image
                src={s3UriToImageUrl(imageUrl) || imageUrl}
                alt="Analyzed image"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 justify-center min-h-[80px]">
            <AnimatePresence>
              {tags.slice(0, visibleTags).map((tag, index) => (
                <motion.span
                  key={`${tag}-${index}`}
                  initial={{ opacity: 0, scale: 0.5, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: [0.34, 1.56, 0.64, 1], // Bouncy easing
                  }}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 border border-violet-200/50 shadow-sm"
                >
                  {tag}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>

          {/* Progress indicator */}
          {visibleTags < tags.length && (
            <div className="flex justify-center mt-4">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Close button at bottom */}
          {visibleTags >= tags.length && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex justify-center"
            >
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-medium hover:from-violet-600 hover:to-purple-700 transition-all shadow-lg shadow-violet-200"
              >
                확인
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
