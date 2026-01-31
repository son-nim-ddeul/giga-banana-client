interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  const { id } = await params;

  return (
    <>
      <header className="h-24 border-b border-neutral-1 bg-white flex items-center px-8 shrink-0">
        <h1 className="text-xl font-bold text-neutral-3">Chat: {id}</h1>
      </header>
      <div className="flex-1 overflow-y-auto p-8">
        <p className="text-neutral-2">채팅 내용</p>
      </div>
    </>
  );
}
