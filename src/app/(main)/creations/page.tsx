'use client';

import { ImageIcon, Loader2 } from 'lucide-react';
import { useCreations } from '@/hooks/use-creations';
import { useAuthStore, useAuthHydration } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CreationCard } from '@/components/creation-card';

export default function CreationsPage() {
  const router = useRouter();
  const isHydrated = useAuthHydration();
  const { isAuthenticated } = useAuthStore();
  const { data, isLoading, error } = useCreations();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  // Show loading while hydrating
  if (!isHydrated) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-2" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const creations = data?.creations || [];

  return (
    <>
      {/* Header */}
      <header className="h-24 border-b border-neutral-1 bg-white flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-bold text-neutral-3">Creations</h1>
            <p className="text-xs text-neutral-2 mt-2">
              {isLoading ? '로딩 중...' : `${creations.length}개의 생성물`}
            </p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="w-10 h-10 text-primary-2 animate-spin mb-4" />
            <p className="text-neutral-2">로딩 중...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <ImageIcon className="w-10 h-10 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-neutral-3 mb-2">
              오류가 발생했습니다
            </h2>
            <p className="text-neutral-2">{error.message}</p>
          </div>
        ) : creations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {creations.map((creation) => (
              <CreationCard
                key={creation.id}
                id={creation.id}
                image_url={creation.image_url}
                title={(creation.metadata?.title as string) || 'Untitled'}
                createdAt={creation.createdAt}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-20 h-20 rounded-full bg-neutral-1 flex items-center justify-center mb-4">
              <ImageIcon className="w-10 h-10 text-neutral-2" />
            </div>
            <h2 className="text-xl font-bold text-neutral-3 mb-2">
              생성물이 없습니다
            </h2>
            <p className="text-neutral-2">새로운 이미지를 생성해보세요</p>
          </div>
        )}
      </div>
    </>
  );
}
