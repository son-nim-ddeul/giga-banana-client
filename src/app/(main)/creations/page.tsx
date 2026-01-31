import { Sidebar } from '@/components/sidebar';
import { ImageCard } from '@/components/image-card';
import { ImageIcon } from 'lucide-react';
import Image from 'next/image';

// Mock data - 나중에 API로 대체
const MOCK_IMAGES = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop&q=60',
    title: 'Mountain Mist',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop&q=60',
    title: 'Verdant Valley',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=60',
    title: 'Golden Hour Forest',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop&q=60',
    title: 'Wooden Bridge',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=60',
    title: 'Sunset Lake',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop&q=60',
    title: 'Rocky Mountains',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
];

// SSR: 서버에서 이미지 데이터 fetch (나중에 실제 API로 대체)
async function getCreations() {
  // TODO: 실제 API 호출로 대체
  // const res = await fetch(`${process.env.API_URL}/creations`, { cache: 'no-store' });
  // return res.json();
  return MOCK_IMAGES;
}

export default async function CreationsPage() {
  const creations = await getCreations();

  return (
    <div className="flex h-screen w-full bg-neutral-1 font-sans overflow-hidden">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-24 border-b border-neutral-1 bg-white flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-3">

            <div>
              <h1 className="text-xl font-bold text-neutral-3">Creations</h1>
              <p className="text-xs text-neutral-2 mt-2">{creations.length}개의 생성물</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {creations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {creations.map((creation) => (
                <ImageCard
                  key={creation.id}
                  id={creation.id}
                  url={creation.url}
                  title={creation.title}
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
              <p className="text-neutral-2">
                새로운 생성물을 생성해보세요
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
