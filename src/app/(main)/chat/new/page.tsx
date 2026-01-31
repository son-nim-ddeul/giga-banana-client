'use client';

import { motion } from 'framer-motion';
import { useChat } from '@/hooks/use-chat';
import { ChatInput } from '@/components/chat/chat-input';
import { UseCases } from '@/components/use-cases';
import { useAuthStore, useAuthHydration } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const useCases = [
  {
    title: '상품 상세 페이지',
    description: '감각적인 이커머스 디자인',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60',
  },
  {
    title: '모바일 앱 대시보드',
    description: '직관적이고 깔끔한 인터페이스',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&auto=format&fit=crop&q=60',
  },
  {
    title: '랜딩 페이지',
    description: '눈길을 사로잡는 히어로 섹션',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&auto=format&fit=crop&q=60',
  },
];

export default function NewChatPage() {
  const router = useRouter();
  const isHydrated = useAuthHydration();
  const { isAuthenticated } = useAuthStore();
  const {
    isLoading,
    isUploading,
    uploadedImage,
    error,
    sendMessage,
    uploadFile,
    clearUploadedImage,
  } = useChat();

  // Redirect to login if not authenticated (only after hydration)
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  const handleImageClick = (imageUrl: string) => {
    // Use case 이미지 선택 시 처리
    console.log('Selected use case image:', imageUrl);
  };

  // Show loading while hydrating
  if (!isHydrated) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-2" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-4xl w-full">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-4"
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-neutral-3 mb-4">
              오늘은 어떤 이미지를 만들어볼까요?
            </h1>
            <p className="text-xl text-neutral-2">
              원하는 이미지를 말씀해주세요 — AI가 바로 만들어드릴게요.
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center"
            >
              {error}
            </motion.div>
          )}

          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-12"
          >
            <ChatInput
              onSubmit={sendMessage}
              onFileUpload={uploadFile}
              isLoading={isLoading}
              isUploading={isUploading}
              uploadedImage={uploadedImage}
              onClearImage={clearUploadedImage}
              placeholder="만들고 싶은 이미지를 설명해주세요..."
            />
          </motion.div>

          {/* Use Cases Section */}
          <UseCases useCases={useCases} onImageClick={handleImageClick} />
        </div>
      </div>
    </>
  );
}
