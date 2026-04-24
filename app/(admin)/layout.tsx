import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Header } from '@/components/features/Header';
import { AdminSidebar } from '@/components/features/AdminSidebar';
import { AdminMobileSidebar } from '@/components/features/AdminMobileSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex flex-1 flex-col md:ml-0">
          <div className="border-b p-2 md:hidden">
            <AdminMobileSidebar />
          </div>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
