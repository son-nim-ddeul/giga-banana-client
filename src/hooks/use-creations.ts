import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';

interface Creation {
  id: string;
  userId: string;
  workflow: string | null;
  metadata: Record<string, unknown> | null;
  image_url: string;
  createdAt: string;
  status: string;
}

interface CreationsResponse {
  creations: Creation[];
}

async function fetchCreations(accessToken: string): Promise<CreationsResponse> {
  const res = await fetch('/api/creations', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || '데이터를 불러올 수 없습니다.');
  }

  return res.json();
}

export function useCreations() {
  const { accessToken, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['creations'],
    queryFn: () => fetchCreations(accessToken!),
    enabled: isAuthenticated && !!accessToken,
    staleTime: 30 * 1000, // 30초
  });
}

interface CreationResponse {
  creation: Creation;
}

async function fetchCreation(id: string, accessToken: string): Promise<CreationResponse> {
  const res = await fetch(`/api/creations/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || '데이터를 불러올 수 없습니다.');
  }

  return res.json();
}

export function useCreation(id: string) {
  const { accessToken, isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['creation', id],
    queryFn: () => fetchCreation(id, accessToken!),
    enabled: isAuthenticated && !!accessToken && !!id,
    staleTime: 30 * 1000,
  });
}
