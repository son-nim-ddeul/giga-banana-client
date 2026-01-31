import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import {
  uploadImage,
  createSession,
  sendChatMessage,
  type ChatMessage,
  type ChatRunRequest,
  type UploadResult,
} from '@/lib/api/chat';

interface UseChatOptions {
  sessionId?: string;
  onSessionCreated?: (sessionId: string) => void;
}

interface UploadedImage {
  uri: string;        // S3 URI for API (s3://...)
  previewUrl: string; // Local blob URL for preview display
  mimeType: string;
  fileName: string;
}

interface UseChatReturn {
  // State
  messages: ChatMessage[];
  isLoading: boolean;
  isUploading: boolean;
  uploadedImage: UploadedImage | null;
  error: string | null;

  // Actions
  sendMessage: (content: string) => Promise<void>;
  uploadFile: (file: File) => Promise<UploadResult | null>;
  clearUploadedImage: () => void;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export function useChat(options: UseChatOptions = {}): UseChatReturn {
  const { sessionId: initialSessionId, onSessionCreated } = options;
  const router = useRouter();
  const { user } = useAuthStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionIdRef = useRef<string | null>(initialSessionId || null);

  /**
   * Upload a file and return the upload result
   */
  const uploadFile = useCallback(
    async (file: File): Promise<UploadResult | null> => {
      if (!user?.id) {
        setError('로그인이 필요합니다.');
        return null;
      }

      setIsUploading(true);
      setError(null);

      try {
        const result = await uploadImage(file, user.id);
        setUploadedImage({
          uri: result.uri,
          previewUrl: result.previewUrl,
          mimeType: result.mimeType,
          fileName: result.fileName,
        });
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : '이미지 업로드에 실패했습니다.';
        setError(message);
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

      // Add user message to UI immediately (use preview URL for display)
      const userMessage: ChatMessage = {
        role: 'user',
        content: content.trim(),
        image_url: uploadedImage?.previewUrl || undefined,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      try {
        let currentSessionId = sessionIdRef.current;

        // If no session, create one first
        if (!currentSessionId) {
          const sessionData = await createSession(user.id);
          currentSessionId = sessionData.session_id;
          sessionIdRef.current = currentSessionId;

          // Navigate to the session page
          if (onSessionCreated) {
            onSessionCreated(currentSessionId);
          }
          router.push(`/chat/${currentSessionId}`);

          // Wait 2 seconds for session to be fully ready
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        // Send the message
        const request: ChatRunRequest = {
          user_id: user.id,
          session_id: currentSessionId,
          user_message: content.trim(),
          context: {},
        };

        // Add image if uploaded (send S3 URI to API)
        if (uploadedImage) {
          request.image_upload_url = uploadedImage.uri;
          request.image_upload_mime_type = uploadedImage.mimeType || 'image/jpeg';
        }

        const response = await sendChatMessage(request);

        // Add assistant response
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: response.response,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Clear uploaded image after sending
        clearUploadedImage();
      } catch (err) {
        const message = err instanceof Error ? err.message : '메시지 전송에 실패했습니다.';
        setError(message);
        // Remove the failed user message
        setMessages((prev) => prev.slice(0, -1));
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id, uploadedImage, onSessionCreated, router, clearUploadedImage]
  );

  return {
    messages,
    isLoading,
    isUploading,
    uploadedImage,
    error,
    sendMessage,
    uploadFile,
    clearUploadedImage,
    setMessages,
  };
}
