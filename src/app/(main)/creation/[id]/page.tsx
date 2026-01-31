interface CreationPageProps {
  params: Promise<{ id: string }>;
}

export default async function CreationPage({ params }: CreationPageProps) {
  const { id } = await params;

  return (
    <main className="flex min-h-screen flex-col">
      <h1 className="text-2xl font-bold p-8">Creation: {id}</h1>
    </main>
  );
}
