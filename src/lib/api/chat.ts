const API_BASE_URL = 'http://ec2-43-200-182-133.ap-northeast-2.compute.amazonaws.com:8000';

// Types
export interface SessionCreateResponse {
  session_id: string;
  user_id: string;
  metadata?: Record<string, unknown>;
  created_at?: string;
}

export interface SessionListItem {
  session_id: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
  metadata?: Record<string, unknown>;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  image_url?: string;
  timestamp?: string;
  error_message?: string;
}

// Session Events API 응답 타입
export interface EventContent {
  message: string;
  image_upload_url?: string;
  image_upload_mime_type?: string;
}

export interface SessionEvent {
  role: 'user' | 'assistant';
  content: EventContent;
  error_message?: string;
}

export interface SessionEventsResponse {
  events: SessionEvent[];
}

export interface ChatRunRequest {
  user_id: string;
  session_id: string;
  user_message: string;
  context?: Record<string, unknown>;
  image_upload_url?: string;
  image_upload_mime_type?: string;
}

export interface ChatRunResponse {
  session_id: string;
  response: string;
  metadata?: Record<string, unknown>;
}

// Validation Error Response (from chat send)
export interface ValidationError {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface ChatErrorResponse {
  detail: ValidationError[];
}

export interface UploadResponse {
  image_upload_uri: string;
  message: string;
}

export interface UploadResult {
  uri: string;       // S3 URI for API calls (s3://...)
  previewUrl: string; // Local blob URL for preview
  mimeType: string;
  fileName: string;
}

// API Functions

/**
 * Upload an image to S3 bucket
 * Returns both S3 URI and local preview URL
 */
export async function uploadImage(file: File, userId: string): Promise<UploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('user_id', userId);

  const res = await fetch(`${API_BASE_URL}/bucket/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: '이미지 업로드에 실패했습니다.' }));
    throw new Error(error.error || error.message || '이미지 업로드에 실패했습니다.');
  }

  const data: UploadResponse = await res.json();

  // Create local preview URL
  const previewUrl = URL.createObjectURL(file);

  return {
    uri: data.image_upload_uri,
    previewUrl,
    mimeType: file.type,
    fileName: file.name,
  };
}

/**
 * Create a new chat session
 */
export async function createSession(
  userId: string,
): Promise<SessionCreateResponse> {
  const res = await fetch(`${API_BASE_URL}/sessions/create`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
    }),
  });
  // {
  //   "user_id": "string",
  //   "metadata": {
  //     "additionalProp1": {}
  //   }
  // }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: '세션 생성에 실패했습니다.' }));
    throw new Error(error.error || error.message || '세션 생성에 실패했습니다.');
  }

  return res.json();
}

/**
 * Send a message in a chat session
 */
export async function sendChatMessage(request: ChatRunRequest): Promise<ChatRunResponse> {
  const res = await fetch(`${API_BASE_URL}/images/run`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: '메시지 전송에 실패했습니다.' }));
    throw new Error(error.error || error.message || '메시지 전송에 실패했습니다.');
  }

  return res.json();
}

/**
 * Get session events (chat history)
 * GET /sessions/events/{session_id}
 */
export async function getSessionEvents(sessionId: string): Promise<ChatMessage[]> {
  const res = await fetch(`${API_BASE_URL}/sessions/events/${encodeURIComponent(sessionId)}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  });

  if (!res.ok) {
    // If endpoint doesn't exist or session not found, return empty array
    if (res.status === 404) {
      return [];
    }
    const error = await res.json().catch(() => ({ error: '이벤트를 불러올 수 없습니다.' }));
    throw new Error(error.error || error.message || '이벤트를 불러올 수 없습니다.');
  }

  const data: SessionEventsResponse = await res.json();

  // Convert SessionEvent[] to ChatMessage[]
  return (data.events || []).map((event) => ({
    role: event.role,
    content: event.content?.message || '',
    image_url: event.content?.image_upload_url,
    error_message: event.error_message,
  }));
}

/**
 * Get a single session by ID
 */
export async function getSession(sessionId: string): Promise<SessionListItem> {
  const res = await fetch(`${API_BASE_URL}/sessions/${encodeURIComponent(sessionId)}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: '세션을 불러올 수 없습니다.' }));
    throw new Error(error.error || error.message || '세션을 불러올 수 없습니다.');
  }

  return res.json();
}

/**
 * Get all sessions for a user
 */
export async function getSessions(userId: string): Promise<SessionListItem[]> {
  const res = await fetch(`${API_BASE_URL}/sessions/list?user_id=${encodeURIComponent(userId)}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  });

  if (!res.ok) {
    if (res.status === 404) {
      return [];
    }
    const error = await res.json().catch(() => ({ error: '세션 목록을 불러올 수 없습니다.' }));
    throw new Error(error.error || error.message || '세션 목록을 불러올 수 없습니다.');
  }

  const data = await res.json();
  return data.sessions || data || [];
}
