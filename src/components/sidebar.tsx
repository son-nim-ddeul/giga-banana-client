'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Plus, MessageSquare, Image as ImageIcon, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import { useLogout } from '@/hooks/use-auth';
import Image from 'next/image';

interface SidebarProps {
  user?: {
    name: string;
    email: string;
  } | null;
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const { user: storeUser } = useAuthStore();
  const logout = useLogout();

  const currentUser = user || storeUser;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside className="w-64 border-r border-neutral-1 bg-white flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-2xl mb-4 overflow-hidden">
          <Image
            src="/giga_banana.png"
            alt="Giga Banana"
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
        <span className="font-bold text-xl tracking-tight text-neutral-3">
          Giga Banana
        </span>
      </div>

      {/* New Chat Button */}
      <div className="px-4 mb-6">
        <Link
          href="/chat/new"
          className="w-full py-2 px-4 bg-primary-2 text-white font-semibold text-sm rounded-xl hover:bg-primary-3 transition-all flex items-center justify-center gap-2 shadow-sm"
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

        <Link
          href="/chat/new"
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all',
            pathname?.startsWith('/chat')
              ? 'bg-primary-1 text-primary-2'
              : 'text-neutral-2 hover:bg-neutral-1 hover:text-neutral-3'
          )}
        >
          <MessageSquare size={18} className="shrink-0" />
          <span>Chat</span>
        </Link>

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
