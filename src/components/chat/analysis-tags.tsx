'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface AnalysisTagsProps {
  title: string;
  tags: string[];
  delay?: number; // Initial delay before showing anything
  tagInterval?: number; // Interval between each tag appearing
}

export function AnalysisTags({
  title,
  tags,
  delay = 0,
  tagInterval = 300,
}: AnalysisTagsProps) {
  const [showTitle, setShowTitle] = useState(false);
  const [visibleTags, setVisibleTags] = useState<number>(0);

  useEffect(() => {
    // Show title after initial delay
    const titleTimer = setTimeout(() => {
      setShowTitle(true);
    }, delay);

    return () => clearTimeout(titleTimer);
  }, [delay]);

  useEffect(() => {
    if (!showTitle) return;

    // Start showing tags one by one after title appears
    if (visibleTags < tags.length) {
      const tagTimer = setTimeout(() => {
        setVisibleTags((prev) => prev + 1);
      }, tagInterval);

      return () => clearTimeout(tagTimer);
    }
  }, [showTitle, visibleTags, tags.length, tagInterval]);

  return (
    <div className="py-4">
      <AnimatePresence>
        {showTitle && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex items-center gap-2 mb-3"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-neutral-3">{title}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-wrap gap-2 ml-10">
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
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 border border-violet-200/50 shadow-sm"
            >
              {tag}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
