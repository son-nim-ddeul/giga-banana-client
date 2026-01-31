'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Download } from 'lucide-react';
import Image from 'next/image';
import { s3UriToImageUrl } from '@/lib/utils';

interface ImagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export function ImagePreviewModal({
  isOpen,
  onClose,
  imageUrl,
}: ImagePreviewModalProps) {
  const actualImageUrl = s3UriToImageUrl(imageUrl) || imageUrl;

  const handleDownload = async () => {
    try {
      const response = await fetch(actualImageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `image-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Download button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
          className="absolute top-4 right-16 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
          title="다운로드"
        >
          <Download className="w-6 h-6" />
        </button>

        {/* Image container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative max-w-[90vw] max-h-[90vh] rounded-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={actualImageUrl}
            alt="Preview"
            width={800}
            height={800}
            className="object-contain max-w-[90vw] max-h-[90vh]"
            unoptimized
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
