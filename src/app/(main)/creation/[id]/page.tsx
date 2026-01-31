'use client';

import { useCreation } from '@/hooks/use-creations';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth-store';
import { ArrowLeft, Trash2, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';
import { s3UriToImageUrl } from '@/lib/utils';

interface CreationPageProps {
  params: Promise<{ id: string }>;
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const diff = Date.now() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) return '방금 전';
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}일 전`;
  return `${Math.floor(days / 30)}개월 전`;
}

function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }),
    time: date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    relative: formatRelativeTime(dateString),
  };
}

export default function CreationPage({ params }: CreationPageProps) {
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

      queryClient.invalidateQueries({ queryKey: ['creations'] });
      router.push('/creations');
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <>
        <header className="h-24 border-b border-neutral-1 bg-white flex items-center px-8 shrink-0">
          <Link href="/creations" className="flex items-center gap-2 text-neutral-2 hover:text-neutral-3 transition-colors">
            <ArrowLeft size={20} />
            <span>뒤로가기</span>
          </Link>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-primary-2 animate-spin mb-4" />
            <p className="text-neutral-2">로딩 중...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <header className="h-24 border-b border-neutral-1 bg-white flex items-center px-8 shrink-0">
          <Link href="/creations" className="flex items-center gap-2 text-neutral-2 hover:text-neutral-3 transition-colors">
            <ArrowLeft size={20} />
            <span>뒤로가기</span>
          </Link>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error?.message || '데이터를 불러올 수 없습니다.'}</p>
            <Link
              href="/creations"
              className="px-4 py-2 bg-neutral-1 text-neutral-3 rounded-lg hover:bg-neutral-200 transition-colors inline-block"
            >
              목록으로
            </Link>
          </div>
        </div>
      </>
    );
  }

  const creation = data.creation;
  const dateTime = formatDateTime(creation.createdAt);
  const title = (creation.metadata?.title as string) || 'Untitled';

  return (
    <>
      <header className="h-24 border-b border-neutral-1 bg-white flex items-center justify-between px-8 shrink-0">
        <Link href="/creations" className="flex items-center gap-2 text-neutral-2 hover:text-neutral-3 transition-colors">
          <ArrowLeft size={20} />
          <span>뒤로가기</span>
        </Link>
        <button
          onClick={handleDelete}
          className="p-2 text-neutral-2 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="삭제"
        >
          <Trash2 size={18} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Title Section */}
          <div className="p-6 border-b border-neutral-1">
            <h1 className="text-2xl font-bold text-neutral-3">{title}</h1>
            <div className="flex items-center gap-2 mt-2 text-sm text-neutral-2">
              <Clock size={14} />
              <span>
                {dateTime.relative} • {dateTime.date} {dateTime.time}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col md:flex-row">
            {/* Image Section */}
            <div className="md:w-1/2 p-6 flex flex-col">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-1">
                <Image
                  src={s3UriToImageUrl(creation.image_url) || creation.image_url}
                  alt={title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                />
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                  <CheckCircle2 size={16} />
                  <span>Analyzed</span>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-primary-1 border-2 border-white flex items-center justify-center text-[10px] font-bold text-primary-2">
                    JD
                  </div>
                  <div className="w-7 h-7 rounded-full bg-neutral-1 border-2 border-white flex items-center justify-center text-[10px] font-medium text-neutral-2">
                    +1
                  </div>
                </div>
              </div>
            </div>

            {/* Info Section */}
            <div className="md:w-1/2 p-6 border-t md:border-t-0 md:border-l border-neutral-1">
              {/* Workflow */}
              {creation.workflow && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <h3 className="font-semibold text-neutral-3">Workflow</h3>
                  </div>
                  <pre className="bg-neutral-1 rounded-lg p-4 text-sm text-neutral-3 overflow-x-auto font-mono">
                    {typeof creation.workflow === 'string'
                      ? creation.workflow
                      : JSON.stringify(creation.workflow, null, 2)}
                  </pre>
                </div>
              )}

              {/* Metadata */}
              {creation.metadata && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <h3 className="font-semibold text-neutral-3">Metadata</h3>
                  </div>
                  <pre className="bg-neutral-1 rounded-lg p-4 text-sm text-neutral-3 overflow-x-auto font-mono">
                    {JSON.stringify(creation.metadata, null, 2)}
                  </pre>
                </div>
              )}

              {/* Created */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <h3 className="font-semibold text-neutral-3">Created</h3>
                </div>
                <div className="bg-neutral-1 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-2">Date:</span>
                    <span className="font-medium text-neutral-3">
                      {dateTime.date}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-2">Time:</span>
                    <span className="font-medium text-neutral-3">
                      {dateTime.time}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-2">Relative:</span>
                    <span className="font-medium text-neutral-3">
                      {dateTime.relative}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
