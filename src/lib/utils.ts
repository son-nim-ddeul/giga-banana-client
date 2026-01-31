import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Convert S3 URI to accessible image URL
 * s3://bucket-name/path/to/file.jpg -> https://bucket-name.s3.region.amazonaws.com/path/to/file.jpg
 */
export function s3UriToImageUrl(s3Uri: string | null | undefined): string | undefined {
  if (!s3Uri) return undefined;

  // If it's already a URL (http/https), return as is
  if (s3Uri.startsWith('http://') || s3Uri.startsWith('https://')) {
    return s3Uri;
  }

  // Parse S3 URI: s3://bucket-name/path/to/file
  if (!s3Uri.startsWith('s3://')) {
    return s3Uri; // Return as is if not S3 URI format
  }

  const s3Path = s3Uri.replace('s3://', '');
  const [bucket, ...pathParts] = s3Path.split('/');
  const objectPath = pathParts.join('/');

  // Convert to S3 public URL
  // Default region: ap-northeast-2 (Seoul)
  const region = 'ap-northeast-2';
  return `https://${bucket}.s3.${region}.amazonaws.com/${objectPath}`;
}
