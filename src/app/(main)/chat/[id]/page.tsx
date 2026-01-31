'use client';

import { use, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useChat } from '@/hooks/use-chat';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatMessages } from '@/components/chat/chat-messages';
import { useAuthStore, useAuthHydration } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { getSessionEvents } from '@/lib/api/chat';
import { ArrowLeft, Sparkles, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const { id: sessionId } = use(params);
  const router = useRouter();
  const isHydrated = useAuthHydration();
  const { isAuthenticated } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    isLoading,
    isUploading,
    uploadedImage,
    error,
    sendMessage,
    uploadFile,
    clearUploadedImage,
    setMessages,
  } = useChat({ sessionId });

  // Redirect to login if not authenticated (only after hydration)
  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  // Load session events on mount
  useEffect(() => {
    async function loadEvents() {
      try {
        const events = await getSessionEvents(sessionId);
        if (events.length > 0) {
          setMessages(events);
        }
      } catch (err) {
        console.error('Failed to load session events:', err);
      }
    }

    if (isAuthenticated && sessionId) {
      loadEvents();
    }
  }, [sessionId, isAuthenticated, setMessages]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show loading while hydrating
  if (!isHydrated) {
    return (
      <div className="flex-1 flex items-center justify-center bg-neutral-1">
        <Loader2 className="w-8 h-8 animate-spin text-primary-2" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col h-full bg-neutral-1">
      {/* Header */}
      <header className="h-16 border-b border-neutral-1 bg-white/80 backdrop-blur-sm flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
        <div className="flex items-center">
          <Link
            href="/chat/new"
            className="flex items-center gap-2 text-neutral-2 hover:text-neutral-3 hover:bg-gray-100 hover:scale-105 active:scale-95 transition-all mr-4 p-2 rounded-lg cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-neutral-3">#{sessionId.slice(0, 8)}</h1>
          </div>
        </div>

        <Link
          href="/chat/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary-1 hover:bg-primary-2/30 hover:shadow-md hover:scale-105 active:scale-95 text-primary-2 rounded-xl text-sm font-medium transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>새 채팅</span>
        </Link>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 py-6">
          {messages.length === 0 && !isLoading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary-1 to-primary-2/30 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                <Sparkles className="w-10 h-10 text-primary-2" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-3 mb-3">
                AI와 대화를 시작하세요
              </h2>
              <p className="text-neutral-2 max-w-md">
                아래 입력창에 메시지를 입력하면 AI가 이미지를 생성하고 편집해 드립니다.
              </p>
            </motion.div>
          ) : (
            <ChatMessages messages={messages} isLoading={isLoading} />
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 pb-4"
        >
          <div className="max-w-3xl mx-auto p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center text-sm">
            {error}
          </div>
        </motion.div>
      )}

      {/* Input Area - 배경 제거하고 전체 배경과 일관성 유지 */}
      <div className="px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-3xl mx-auto"
        >
          <ChatInput
            onSubmit={sendMessage}
            onFileUpload={uploadFile}
            isLoading={isLoading}
            isUploading={isUploading}
            uploadedImage={uploadedImage}
            onClearImage={clearUploadedImage}
            placeholder="이미지 생성 또는 편집을 요청하세요..."
          />
        </motion.div>
      </div>
    </div>
  );
}
