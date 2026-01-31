'use client';

import { useCreation } from '@/hooks/use-creations';
import { CreationModal } from '@/components/creation-modal';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { Loader2 } from 'lucide-react';
import { use } from 'react';

interface ModalPageProps {
  params: Promise<{ id: string }>;
}

export default function CreationModalPage({ params }: ModalPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { accessToken } = useAuthStore();
  const { data, isLoading, error } = useCreation(id);

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const res = await fetch(`/api/creations/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || '삭제에 실패했습니다.');
      }

      // Invalidate and refetch creations list
      queryClient.invalidateQueries({ queryKey: ['creations'] });
      router.back();
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-primary-2 animate-spin mb-4" />
          <p className="text-neutral-2">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl p-8 text-center">
          <p className="text-red-500 mb-4">{error?.message || '데이터를 불러올 수 없습니다.'}</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-neutral-1 text-neutral-3 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    );
  }

  return <CreationModal creation={data.creation} onDelete={handleDelete} />;
}
