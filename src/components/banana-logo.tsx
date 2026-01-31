'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface BananaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
}

const sizeMap = {
  sm: { container: 'w-16 h-16', image: 64 },
  md: { container: 'w-20 h-20', image: 80 },
  lg: { container: 'w-24 h-24', image: 96 },
  xl: { container: 'w-28 h-28', image: 112 },
};

export function BananaLogo({ size = 'lg', className = '', animated = true }: BananaLogoProps) {
  const { container, image } = sizeMap[size];

  const logoContent = (
    <div className={`${container} bg-gradient-to-br from-yellow-100 to-pink-100 rounded-3xl shadow-xl flex items-center justify-center overflow-hidden border border-white/50 ${className}`}>
      <Image
        src="/giga_banana.png"
        alt="Giga Banana"
        width={image}
        height={image}
        className="object-contain"
        priority={size === 'xl'}
      />
    </div>
  );

  if (!animated) {
    return logoContent;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {logoContent}
    </motion.div>
  );
}
