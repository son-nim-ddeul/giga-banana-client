'use client';

import { useRouter } from 'next/navigation';
import { X, Trash2, Clock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface CreationModalProps {
  creation: {
    id: string;
    userId: string;
    workflow: string | null;
    metadata: Record<string, unknown> | null;
    image_url: string;
    createdAt: string;
    status: string;
  };
  onDelete?: () => void;
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

export function CreationModal({ creation, onDelete }: CreationModalProps) {
  const router = useRouter();
  const dateTime = formatDateTime(creation.createdAt);
  const title = (creation.metadata?.title as string) || 'Untitled';

  const handleClose = () => {
    router.back();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-neutral-1">
          <div>
            <h2 className="text-xl font-bold text-neutral-3">{title}</h2>
            <div className="flex items-center gap-2 mt-1 text-sm text-neutral-2">
              <Clock size={14} />
              <span>
                {dateTime.relative} • {dateTime.date} {dateTime.time}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-2 text-neutral-2 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="삭제"
              >
                <Trash2 size={18} />
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-2 text-neutral-2 hover:text-neutral-3 hover:bg-neutral-1 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row max-h-[70vh]">
          {/* Image Section */}
          <div className="md:w-1/2 p-6 flex flex-col">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-neutral-1">
              <Image
                src={creation.image_url}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
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
          <div className="md:w-1/2 p-6 border-t md:border-t-0 md:border-l border-neutral-1 overflow-y-auto">
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

        {/* Footer */}
        <div className="p-6 border-t border-neutral-1">
          <button
            onClick={handleClose}
            className="w-full py-3 px-4 bg-neutral-1 text-neutral-3 font-medium rounded-xl hover:bg-neutral-200 transition-colors"
          >
            닫기
          </button>
        </div>
      </motion.div>
    </div>
  );
}
