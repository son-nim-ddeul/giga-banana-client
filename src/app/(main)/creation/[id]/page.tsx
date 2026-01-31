interface CreationPageProps {
  params: Promise<{ id: string }>;
}

export default async function CreationPage({ params }: CreationPageProps) {
  const { id } = await params;

  return (
    <>
      <header className="h-24 border-b border-neutral-1 bg-white flex items-center px-8 shrink-0">
        <h1 className="text-xl font-bold text-neutral-3">Creation: {id}</h1>
      </header>
      <div className="flex-1 overflow-y-auto p-8">
        <p className="text-neutral-2">생성물 상세 정보</p>
      </div>
    </>
  );
}
