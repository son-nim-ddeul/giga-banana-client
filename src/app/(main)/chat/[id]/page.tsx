interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;

  return (
    <main className="flex min-h-screen flex-col">
      <h1 className="text-2xl font-bold p-8">Chat: {id}</h1>
    </main>
  );
}
