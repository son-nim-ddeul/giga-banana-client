'use client';

import { useAuthStore } from '@/stores/auth-store';

interface FetchOptions extends RequestInit {
  skipAuth?: boolean; // 인증 헤더 생략 여부
}

/**
 * 401 에러 시 자동으로 refresh token으로 갱신하는 fetch wrapper
 */
export async function fetchWithAuth(
  url: string,
  options: FetchOptions = {}
): Promise<Response> {
  const { skipAuth, ...fetchOptions } = options;

  // 인증 헤더 추가
  if (!skipAuth) {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }
  }

  // 첫 번째 요청
  let response = await fetch(url, fetchOptions);

  // 401 에러 시 토큰 갱신 시도
  if (response.status === 401 && !skipAuth) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      // 새 토큰으로 재요청
      const newAccessToken = useAuthStore.getState().accessToken;
      fetchOptions.headers = {
        ...fetchOptions.headers,
        Authorization: `Bearer ${newAccessToken}`,
      };
      response = await fetch(url, fetchOptions);
    } else {
      // refresh 실패 시 로그아웃
      useAuthStore.getState().logout();
    }
  }

  return response;
}

/**
 * Access Token 갱신
 */
async function refreshAccessToken(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include', // httpOnly 쿠키 전송
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    useAuthStore.getState().setAccessToken(data.accessToken);
    return true;
  } catch (error) {
    console.error('Token refresh failed:', error);
    return false;
  }
}

/**
 * JSON 응답을 자동으로 파싱하는 fetchWithAuth
 */
export async function fetchJson<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const response = await fetchWithAuth(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: '요청에 실패했습니다.' }));
    throw new Error(error.error || error.message || '요청에 실패했습니다.');
  }

  return response.json();
}

/**
 * POST 요청 헬퍼
 */
export async function postJson<T>(
  url: string,
  body: unknown,
  options: FetchOptions = {}
): Promise<T> {
  return fetchJson<T>(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * DELETE 요청 헬퍼
 */
export async function deleteJson<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  return fetchJson<T>(url, {
    ...options,
    method: 'DELETE',
  });
}
