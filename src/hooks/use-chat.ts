import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import {
  uploadImage,
  createSession,
  sendChatMessage,
  analyzeImage,
  type ChatMessage,
  type ChatRunRequest,
  type UploadResult,
} from '@/lib/api/chat';

interface UseChatOptions {
  sessionId?: string;
  onSessionCreated?: (sessionId: string) => void;
  onSessionListRefresh?: () => void;
}

interface UploadedImage {
  uri: string;        // S3 URI for API (s3://...)
  previewUrl: string; // Local blob URL for preview display
  mimeType: string;
  fileName: string;
  file: File;         // Original file for analysis
}

interface ImageAnalysisState {
  isAnalyzing: boolean;
  tags: string[] | null;
  error: string | null;
}

interface UseChatReturn {
  // State
  messages: ChatMessage[];
  isLoading: boolean;
  isUploading: boolean;
  uploadedImage: UploadedImage | null;
  error: string | null;
  imageAnalysis: ImageAnalysisState;

  // Actions
  sendMessage: (content: string) => Promise<void>;
  uploadFile: (file: File) => Promise<UploadResult | null>;
  clearUploadedImage: () => void;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const { sessionId: initialSessionId, onSessionCreated, onSessionListRefresh } = options;
  const router = useRouter();
  const { user } = useAuthStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Image analysis state
  const [imageAnalysis, setImageAnalysis] = useState<ImageAnalysisState>({
    isAnalyzing: false,
    tags: null,
    error: null,
  });

  const sessionIdRef = useRef<string | null>(initialSessionId || null);
  const analysisPromiseRef = useRef<Promise<string[]> | null>(null);

  /**
   * Upload a file and start background analysis
   */
  const uploadFile = useCallback(
    async (file: File): Promise<UploadResult | null> => {
      if (!user?.id) {
        setError('로그인이 필요합니다.');
        return null;
      }

      setIsUploading(true);
      setError(null);

      // Reset analysis state
      setImageAnalysis({
        isAnalyzing: true,
        tags: null,
        error: null,
      });

      try {
        const result = await uploadImage(file, user.id);
        setUploadedImage({
          uri: result.uri,
          previewUrl: result.previewUrl,
          mimeType: result.mimeType,
          fileName: result.fileName,
          file: file, // Keep the original file for analysis
        });

        // Start background image analysis (don't await)
        analysisPromiseRef.current = analyzeImage(file, 15);
        analysisPromiseRef.current
          .then((tags) => {
            setImageAnalysis({
              isAnalyzing: false,
              tags,
              error: null,
            });
          })
          .catch((err) => {
            console.error('Image analysis failed:', err);
            setImageAnalysis({
              isAnalyzing: false,
              tags: null,
              error: err instanceof Error ? err.message : '이미지 분석에 실패했습니다.',
            });
          });

        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : '이미지 업로드에 실패했습니다.';
        setError(message);
        setImageAnalysis({
          isAnalyzing: false,
          tags: null,
          error: null,
        });
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [user?.id]
  );

  /**
   * Clear uploaded image and revoke the blob URL
   */
  const clearUploadedImage = useCallback(() => {
    if (uploadedImage?.previewUrl) {
      URL.revokeObjectURL(uploadedImage.previewUrl);
    }
    setUploadedImage(null);
    setImageAnalysis({
      isAnalyzing: false,
      tags: null,
      error: null,
    });
    analysisPromiseRef.current = null;
  }, [uploadedImage?.previewUrl]);

  /**
   * Send a message (creates session if needed)
   */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!user?.id) {
        setError('로그인이 필요합니다.');
        return;
      }

      if (!content.trim()) {
        return;
      }

      setIsLoading(true);
      setError(null);

      // Add user message to UI immediately (use S3 URI for persistence)
      const userMessage: ChatMessage = {
        role: 'user',
        content: content.trim(),
        image_url: uploadedImage?.uri || undefined, // Use S3 URI instead of blob URL
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      // Clear uploaded image immediately when sending message
      clearUploadedImage();

      try {
        let currentSessionId = sessionIdRef.current;

        // If no session, create one first
        if (!currentSessionId) {
          const sessionData = await createSession(user.id);
          currentSessionId = sessionData.session_id;
          sessionIdRef.current = currentSessionId;

          // Notify parent component about session creation
          if (onSessionCreated) {
            onSessionCreated(currentSessionId);
          }

          // 세션 생성 후 2초 대기 (바로 조회하면 없을 수 있음)
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // 세션 리스트 새로고침 (window 이벤트 발생)
          window.dispatchEvent(new CustomEvent('session-created'));

          // 콜백도 호출 (있는 경우)
          if (onSessionListRefresh) {
            onSessionListRefresh();
          }
        }

        // Send the message
        const request: ChatRunRequest = {
          user_id: user.id,
          session_id: currentSessionId,
          user_message: content.trim(),
        };

        // Add image if uploaded (send S3 URI to API)
        if (uploadedImage) {
          request.image_upload_url = uploadedImage.uri;
          request.image_upload_mime_type = uploadedImage.mimeType || 'image/jpeg';
        }

        // 메시지 전송 및 응답 대기
        const response = await sendChatMessage(request);

        // Add assistant response
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response.response_message || '',
          image_url: response.response_image_url || undefined,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // 새 세션이면 응답 받은 후 페이지 이동
        if (!initialSessionId && currentSessionId) {
          router.push(`/chat/${currentSessionId}`);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : '메시지 전송에 실패했습니다.';
        setError(message);
        // Remove the failed user message
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id, uploadedImage, onSessionCreated, onSessionListRefresh, router, clearUploadedImage, initialSessionId]
  );

  return {
    messages,
    isLoading,
    isUploading,
    uploadedImage,
    error,
    imageAnalysis,
    sendMessage,
    uploadFile,
    clearUploadedImage,
    setMessages,
  };
}
