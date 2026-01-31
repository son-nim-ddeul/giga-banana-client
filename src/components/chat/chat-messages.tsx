'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ChatMessage } from '@/lib/api/chat';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  if (messages.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6 py-6">
      {messages.map((message, index) => (
        <MessageBubble key={index} message={message} />
      ))}

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
    </div>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex gap-4', isUser && 'flex-row-reverse')}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
          isUser ? 'bg-primary-2' : 'bg-primary-1'
        )}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-primary-2" />
        )}
      </div>

      {/* Message Content */}
      <div
        className={cn(
          'flex-1 max-w-[80%] rounded-2xl p-4',
          isUser
            ? 'bg-primary-2 text-white rounded-tr-none'
            : 'bg-neutral-1 text-neutral-3 rounded-tl-none'
        )}
      >
        {/* Attached Image */}
        {message.image_url && (
          <div className="mb-3 relative aspect-video w-full max-w-sm rounded-xl overflow-hidden">
            <Image
              src={message.image_url}
              alt="Attached"
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Text Content */}
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>

        {/* Timestamp */}
        {message.timestamp && (
          <p
            className={cn(
              'text-xs mt-2',
              isUser ? 'text-white/60' : 'text-neutral-2'
            )}
          >
            {new Date(message.timestamp).toLocaleTimeString('ko-KR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        )}
      </div>
    </motion.div>
  );
}
