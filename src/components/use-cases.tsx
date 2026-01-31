'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface UseCase {
  title: string;
  description: string;
  image: string;
}

interface UseCasesProps {
  useCases: UseCase[];
  onImageClick?: (imageUrl: string) => void;
}

export function UseCases({ useCases, onImageClick }: UseCasesProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mt-16"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-3 mb-2">이런 것도 만들 수 있어요</h2>
        <p className="text-neutral-2">다른 사용자들이 만든 작품들을 구경해보세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {useCases.map((useCase, index) => (
          <motion.div
            key={useCase.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            className="group bg-white rounded-3xl overflow-hidden border border-neutral-1 hover:shadow-xl transition-all hover:-translate-y-1 select-none"
            onClick={() => onImageClick?.(useCase.image)}
          >
            <div className="aspect-video bg-neutral-1 overflow-hidden relative">
              <Image
                src={useCase.image}
                alt={useCase.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="p-5">
              <h3 className="font-bold text-neutral-3 mb-1">{useCase.title}</h3>
              <p className="text-sm text-neutral-2">{useCase.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
