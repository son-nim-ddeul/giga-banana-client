import Link from 'next/link';
import Image from 'next/image';
import { s3UriToImageUrl } from '@/lib/utils';

interface CreationCardProps {
  id: string;
  image_url: string;
  title: string;
  createdAt: string;
}


export function CreationCard({ id, image_url, title, createdAt }: CreationCardProps) {
  return (
    <Link href={`/creation/${id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-neutral-1 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-neutral-1">
          <Image
            src={s3UriToImageUrl(image_url) || image_url}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </Link>
  );
}
