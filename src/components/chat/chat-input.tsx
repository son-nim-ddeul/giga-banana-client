'use client';

import { useState, useRef } from 'react';
import { Send, ImageIcon, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface UploadedImage {
  uri: string;
  previewUrl: string;
  mimeType: string;
  fileName: string;
}

interface ChatInputProps {
  onSubmit: (message: string) => void;
  onFileUpload: (file: File) => Promise<unknown>;
  isLoading?: boolean;
  isUploading?: boolean;
  uploadedImage?: UploadedImage | null;
  onClearImage?: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({
  onSubmit,
  onFileUpload,
  isLoading = false,
  isUploading = false,
  uploadedImage,
  onClearImage,
  placeholder = '만들고 싶은 이미지를 설명해주세요...',
  disabled = false,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading || disabled) return;

    onSubmit(message.trim());
    setMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    await onFileUpload(file);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const canSubmit = message.trim() && !isLoading && !disabled;

  return (
    <form onSubmit={handleSubmit} className="relative">
      {/* Uploaded Image Preview */}
      {uploadedImage && (
        <div className="mb-3 flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-xl border border-blue-200">
          {/* Image Preview */}
          <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-blue-200 shrink-0">
            <Image
              src={uploadedImage.previewUrl}
              alt="Uploaded preview"
              fill
              className="object-cover"
            />
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-neutral-3 truncate">
              {uploadedImage.fileName}
            </p>
            <p className="text-xs text-neutral-2 mt-0.5">
              {uploadedImage.mimeType} • 이미지가 첨부됩니다
            </p>
          </div>

          {/* Remove Button */}
          {onClearImage && (
            <button
              type="button"
              onClick={onClearImage}
              className="p-2 hover:bg-primary-2/10 rounded-lg transition-colors shrink-0"
              title="이미지 제거"
            >
              <X className="w-5 h-5 text-neutral-2 hover:text-red-500" />
            </button>
          )}
        </div>
      )}







      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap justify-start">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={handleFileClick}
          disabled={isUploading || disabled}
          className={cn(
            'flex items-center gap-2 px-4 py-2 bg-white border border-neutral-1 rounded-xl text-sm font-medium transition-colors cursor-pointer',
            isUploading || disabled
              ? 'text-neutral-2 cursor-not-allowed opacity-50'
              : 'text-neutral-3 hover:bg-gray-200'
          )}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>업로드 중...</span>
            </>
          ) : (
            <>
              <ImageIcon className="w-4 h-4" />
              <span>이미지 편집</span>
            </>
          )}
        </button>
      </div>


      {/* Main Input Wrapper with Gradient Shadow Background */}
      <div className="relative mt-4">
        {/* Gradient Shadow Background - behind the input, slightly larger */}
        <div className="absolute -inset-[2px] rounded-3xl overflow-hidden pointer-events-none z-0">
          {/* Left Blue Gradient Shadow - 더 진한 파란색 */}
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-linear-to-r from-blue-300 via-blue-100 to-transparent blur-3xl" />

          {/* Right Purple Gradient Shadow - 더 진한 보라색 */}
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-linear-to-l from-purple-300 via-purple-100 to-transparent blur-3xl" />
        </div>

        {/* Input Box - on top of the shadow */}
        <div className="relative bg-white rounded-3xl border-2 border-neutral-1 shadow-lg hover:shadow-xl transition-all focus-within:border-primary-2 focus-within:ring-4 focus-within:ring-primary-2/10 z-10">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            className="w-full px-6 py-6 pr-16 text-lg text-neutral-3 placeholder-neutral-2 resize-none focus:outline-none rounded-3xl min-h-[120px] max-h-[300px] disabled:opacity-50 bg-white"
            rows={3}
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!canSubmit}
            className={cn(
              'absolute bottom-6 right-6 w-10 h-10 rounded-xl flex items-center justify-center transition-all z-10',
              canSubmit
                ? 'bg-primary-2 text-white hover:bg-primary-3 hover:scale-110 shadow-lg'
                : 'bg-neutral-1 text-neutral-2 cursor-not-allowed'
            )}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>


    </form>
  );
}
