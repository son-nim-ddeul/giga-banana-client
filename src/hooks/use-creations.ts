import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { fetchJson } from '@/lib/fetch';

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

async function fetchCreations(): Promise<CreationsResponse> {
  return fetchJson<CreationsResponse>('/api/creations');
}

export function useCreations() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['creations'],
    queryFn: fetchCreations,
    enabled: isAuthenticated,
    staleTime: 30 * 1000, // 30초
  });
}

interface CreationResponse {
  creation: Creation;
}

async function fetchCreation(id: string): Promise<CreationResponse> {
  return fetchJson<CreationResponse>(`/api/creations/${id}`);
}

export function useCreation(id: string) {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['creation', id],
    queryFn: () => fetchCreation(id),
    enabled: isAuthenticated && !!id,
    staleTime: 30 * 1000,
  });
}
