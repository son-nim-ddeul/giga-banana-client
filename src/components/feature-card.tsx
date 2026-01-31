'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
}

export function FeatureCard({ icon, title, description, delay = 0 }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-1 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="w-12 h-12 bg-primary-1 rounded-xl flex items-center justify-center text-primary-2 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-neutral-3 mb-2">{title}</h3>
      <p className="text-sm text-neutral-2 leading-relaxed">{description}</p>
    </motion.div>
  );
}
