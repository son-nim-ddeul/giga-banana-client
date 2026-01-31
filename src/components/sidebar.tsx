'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus, MessageSquare, Image as ImageIcon, LogOut, ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore, useAuthHydration } from '@/stores/auth-store';
import { useLogout } from '@/hooks/use-auth';
import { getSessions, type SessionListItem } from '@/lib/api/chat';
import Image from 'next/image';

interface SidebarProps {
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const isHydrated = useAuthHydration();
  const { user: storeUser } = useAuthStore();
  const logout = useLogout();

  const currentUser = isHydrated ? (user || storeUser) : null;

  const [sessions, setSessions] = useState<SessionListItem[]>([]);
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(true);

  // Fetch sessions function
  const fetchSessions = useCallback(async () => {
    if (!isHydrated || !currentUser?.id) return;

    setIsLoadingSessions(true);
    try {
      const data = await getSessions(currentUser.id);
      setSessions(data);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    } finally {
      setIsLoadingSessions(false);
    }
  }, [isHydrated, currentUser?.id]);

  // Fetch sessions when user is available and hydrated
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Listen for session creation event to refresh list
  useEffect(() => {
    const handleSessionCreated = () => {
      fetchSessions();
    };

    window.addEventListener('session-created', handleSessionCreated);
    return () => {
      window.removeEventListener('session-created', handleSessionCreated);
    };
  }, [fetchSessions]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatSessionDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '어제';
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  return (
    <aside className="w-64 border-r border-neutral-1 bg-white flex flex-col shrink-0">
      {/* Logo */}
      <Link href="/" className="p-2 flex items-center gap-1">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl">
          <Image
            src="/giga_banana.png"
            alt="Giga Banana"
            width={42}
            height={42}
            className="object-contain"
          />
        </div>
        <span className="font-bold text-xl tracking-tight text-neutral-3">
          Giga Banana
        </span>
      </Link>

      {/* New Chat Button */}
      <div className="px-4 mb-6">
        <Link
          href="/chat/new"
          className="w-full py-2 px-4 bg-primary-2 text-white font-semibold text-sm rounded-xl hover:bg-primary-3 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
        >
          <Plus size={18} />
          <span>New Chat</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <p className="px-3 py-2 text-xs font-medium text-neutral-2 uppercase tracking-wider">
          Menu
        </p>

        {/* Chat Section with Expandable Sessions */}
        <div>
          <button
            onClick={() => setIsChatExpanded(!isChatExpanded)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all',
              pathname?.startsWith('/chat')
                ? 'bg-primary-1 text-primary-2'
                : 'text-neutral-2 hover:bg-neutral-1 hover:text-neutral-3'
            )}
          >
            <MessageSquare size={18} className="shrink-0" />
            <span className="flex-1 text-left">Chat</span>
            <ChevronDown
              size={16}
              className={cn(
                'shrink-0 transition-transform',
                isChatExpanded ? 'rotate-180' : ''
              )}
            />
          </button>

          {/* Sessions List */}
          {isChatExpanded && (
            <div className="mt-1 ml-4 space-y-0.5">
              {isLoadingSessions ? (
                <div className="flex items-center gap-2 px-3 py-2 text-xs text-neutral-2">
                  <Loader2 size={14} className="animate-spin" />
                  <span>로딩 중...</span>
                </div>
              ) : sessions.length === 0 ? (
                <p className="px-3 py-2 text-xs text-neutral-2">
                  채팅 기록이 없습니다
                </p>
              ) : (
                sessions.slice(0, 10).map((session) => (
                  <Link
                    key={session.session_id}
                    href={`/chat/${session.session_id}`}
                    className={cn(
                      'block px-3 py-2 text-xs rounded-lg truncate transition-colors',
                      pathname === `/chat/${session.session_id}`
                        ? 'bg-primary-1 text-primary-2 font-medium'
                        : 'text-neutral-2 hover:bg-neutral-1 hover:text-neutral-3'
                    )}
                  >
                    <span className="font-mono">#{session.session_id.slice(0, 8)}</span>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        <Link
          href="/creations"
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all',
            pathname === '/creations'
              ? 'bg-primary-1 text-primary-2'
              : 'text-neutral-2 hover:bg-neutral-1 hover:text-neutral-3'
          )}
        >
          <ImageIcon size={18} className="shrink-0" />
          <span>Creations</span>
        </Link>
      </nav>

      {/* User Profile */}
      {currentUser && (
        <div className="p-4 border-t border-neutral-1">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-neutral-1 transition-colors">
            <div className="w-10 h-10 rounded-full bg-primary-1 flex items-center justify-center text-sm font-bold text-primary-2">
              {getInitials(currentUser.name)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-neutral-3 truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-neutral-2 truncate">
                {currentUser.email}
              </p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-neutral-2 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="로그아웃"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
