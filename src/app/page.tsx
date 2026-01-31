import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-2xl mb-4 overflow-hidden">
          <Image
            src="/giga_banana.png"
            alt="Giga Banana"
            width={96}
            height={96}
            className="object-contain"
          />
        </div>
        <h1 className="text-4xl font-bold">Giga Banana</h1>
      </div>
      <nav className="flex gap-4">
        <Link
          href="/login"
          className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="rounded-lg border border-black px-4 py-2 hover:bg-gray-100"
        >
          Sign Up
        </Link>
      </nav>
    </main>
  );
}
