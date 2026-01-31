import { Sidebar } from '@/components/sidebar';

export default function MainLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-neutral-1 font-sans overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
      {modal}
    </div>
  );
}
