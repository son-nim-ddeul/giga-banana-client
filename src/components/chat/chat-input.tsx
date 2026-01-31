'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, ImageIcon, Loader2, X, Sparkles, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { AnalysisPopup } from './analysis-popup';

interface UploadedImage {
  uri: string;
  previewUrl: string;
  mimeType: string;
  fileName: string;
}

interface ImageAnalysisState {
  isAnalyzing: boolean;
  tags: string[] | null;
  error: string | null;
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
  imageAnalysis?: ImageAnalysisState;
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
  imageAnalysis,
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [showAnalysisPopup, setShowAnalysisPopup] = useState(false);
  const [popupShownForImage, setPopupShownForImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Show popup when analysis completes (only once per image)
  useEffect(() => {
    if (
      imageAnalysis?.tags &&
      !imageAnalysis.isAnalyzing &&
      uploadedImage?.previewUrl &&
      popupShownForImage !== uploadedImage.previewUrl
    ) {
      setShowAnalysisPopup(true);
      setPopupShownForImage(uploadedImage.previewUrl);
    }
  }, [imageAnalysis?.tags, imageAnalysis?.isAnalyzing, uploadedImage?.previewUrl, popupShownForImage]);

  // Reset popup state when image is cleared
  useEffect(() => {
    if (!uploadedImage) {
      setPopupShownForImage(null);
    }
  }, [uploadedImage]);

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
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-neutral-2">
                {uploadedImage.mimeType}
              </span>
              {imageAnalysis?.isAnalyzing && (
                <span className="flex items-center gap-1 text-xs text-violet-600">
                  <Sparkles className="w-3 h-3 animate-pulse" />
                  분석 중...
                </span>
              )}
              {imageAnalysis?.tags && !imageAnalysis.isAnalyzing && (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <Check className="w-3 h-3" />
                  분석 완료
                </span>
              )}
            </div>
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







      {/* Action Buttons - 이미지가 없을 때만 표시 */}
      {!uploadedImage && (
        <div className="flex items-center gap-2 flex-wrap justify-start">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Gradient Border Button */}
          <div
            className={cn(
              'relative p-[2px] rounded-xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 transition-all',
              isUploading || disabled
                ? 'opacity-50'
                : 'hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 hover:shadow-lg hover:shadow-purple-200 hover:scale-102'
            )}
          >
            <button
              type="button"
              onClick={handleFileClick}
              disabled={isUploading || disabled}
              className={cn(
                'flex items-center gap-2 px-4 py-2 bg-white rounded-[10px] text-sm font-medium transition-all cursor-pointer w-full',
                isUploading || disabled
                  ? 'text-neutral-2 cursor-not-allowed'
                  : 'text-neutral-3 hover:bg-gray-50'
              )}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent font-semibold">
                    업로드 중...
                  </span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4 text-purple-500" />
                  <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent font-semibold">
                    이미지 편집
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}


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
        <div className="relative bg-white rounded-3xl border-2 border-neutral-1 shadow-lg hover:shadow-xl transition-all focus-within:border-purple-200 focus-within:ring-4 focus-within:ring-purple-100/50 z-10">
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
                ? 'bg-primary-2 text-white hover:bg-primary-3 hover:scale-105 shadow-lg'
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

      {/* Analysis Popup */}
      {uploadedImage && imageAnalysis?.tags && (
        <AnalysisPopup
          isOpen={showAnalysisPopup}
          onClose={() => setShowAnalysisPopup(false)}
          imageUrl={uploadedImage.previewUrl}
          tags={imageAnalysis.tags}
        />
      )}
    </form>
  );
}
