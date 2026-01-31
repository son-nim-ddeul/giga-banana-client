import Link from 'next/link';
import Image from 'next/image';

interface ImageCardProps {
  id: string;
  url: string;
  title: string;
  createdAt: string;
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

export function ImageCard({ id, url, title, createdAt }: ImageCardProps) {
  return (
    <Link href={`/image/${id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-neutral-1 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-neutral-1">
          <Image
            src={url}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-neutral-3 text-base mb-1 truncate group-hover:text-primary-2 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-neutral-2">{formatRelativeTime(createdAt)}</p>
        </div>
      </div>
    </Link>
  );
}
