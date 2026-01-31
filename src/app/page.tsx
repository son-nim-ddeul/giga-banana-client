import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-8">
      <h1 className="text-4xl font-bold">Giga Banana</h1>
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
