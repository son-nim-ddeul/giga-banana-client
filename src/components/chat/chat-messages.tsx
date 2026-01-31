'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { User, Bot, ImageOff } from 'lucide-react';
import type { ChatMessage } from '@/lib/api/chat';
import { AnalysisTags } from './analysis-tags';
import { s3UriToImageUrl } from '@/lib/utils';
import { ImagePreviewModal } from './image-preview-modal';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (messages.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 py-6">
      {messages.map((message, index) => {
        if (message.role === 'user') {
          return <UserMessage key={index} message={message} onImageClick={setPreviewImage} />;
        }
        if (message.role === 'analysis' && message.tags) {
          return (
            <AnalysisMessage key={index} title={message.content} tags={message.tags} />
          );
        }
        return <AgentMessage key={index} message={message} onImageClick={setPreviewImage} />;
      })}

      {/* Loading indicator */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-4"
        >
          <div className="w-10 h-10 rounded-full bg-primary-1 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 text-primary-2" />
          </div>
          <div className="flex-1 bg-neutral-1 rounded-2xl rounded-tl-none p-4">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 bg-neutral-2 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-neutral-2 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-neutral-2 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </motion.div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <ImagePreviewModal
          isOpen={!!previewImage}
          onClose={() => setPreviewImage(null)}
          imageUrl={previewImage}
        />
      )}
    </div>
  );
}

// 이미지 로딩 실패 대체 컴포넌트
function ImagePlaceholder() {
  return (
    <div className="w-[100px] h-[100px] flex flex-col items-center justify-center bg-neutral-1 border border-neutral-2/20 rounded-xl text-neutral-2">
      <ImageOff className="w-5 h-5 mb-2 opacity-50" />
      <span className="text-xs">이미지를 불러올 수 없습니다</span>
    </div>
  );
}

// 공통 이미지 컴포넌트
function MessageImage({ imageUrl, onClick }: { imageUrl: string; onClick?: (url: string) => void }) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // S3 URI를 실제 이미지 URL로 변환
  const actualImageUrl = s3UriToImageUrl(imageUrl) || imageUrl;

  if (imageError) {
    return (
      <div className="mb-3">
        <ImagePlaceholder />
      </div>
    );
  }

  return (
    <div
      className="mb-3 relative w-[200px] h-[200px] rounded-xl overflow-hidden bg-neutral-1 cursor-pointer hover:opacity-90 transition-opacity"
      onClick={() => onClick?.(imageUrl)}
    >
      <Image
        src={actualImageUrl}
        alt="Attached"
        fill
        className="object-cover"
        onError={() => setImageError(true)}
        onLoad={() => setIsLoading(false)}
        unoptimized
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-1">
          <div className="w-6 h-6 border-2 border-primary-2 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

// 유저 메시지 컴포넌트
function UserMessage({ message, onImageClick }: { message: ChatMessage; onImageClick?: (url: string) => void }) {
  const hasImage = !!message.image_url;
  const hasText = !!message.content?.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4"
    >

      {hasImage && (
        <>
          <div className="flex justify-center items-center">
            <MessageImage imageUrl={message.image_url!} onClick={onImageClick} />
          </div>
        </>
      )}
      {hasText && (
        <div className='flex flex-row-reverse gap-4'>
          <div className="w-10 h-10 rounded-full bg-primary-3 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 max-w-[80%] rounded-2xl p-4 bg-primary-1 text-gray-800 rounded-tr-none">
            <p className="whitespace-pre-wrap leading-relaxed text-gray-800">{message.content}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// 분석 결과 메시지 컴포넌트
function AnalysisMessage({ title, tags }: { title: string; tags: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4"
    >
      <AnalysisTags title={title} tags={tags} delay={0} tagInterval={300} />
    </motion.div>
  );
}

// 에이전트 메시지 컴포넌트
function AgentMessage({ message, onImageClick }: { message: ChatMessage; onImageClick?: (url: string) => void }) {
  const hasImage = !!message.image_url;
  const hasText = !!message.content?.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4"
    >
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-primary-1 flex items-center justify-center shrink-0">
        <Bot className="w-5 h-5 text-primary-2" />
      </div>

      {/* Message Content */}
      {hasImage ? (
        <div className="flex justify-center items-center">
          <MessageImage imageUrl={message.image_url!} onClick={onImageClick} />
        </div>
      ) : hasText ? (
        <div className="flex-1 max-w-[80%] rounded-2xl p-4 bg-neutral-1 text-neutral-3 rounded-tl-none">
          <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        </div>
      ) : null}
    </motion.div>
  );
}
