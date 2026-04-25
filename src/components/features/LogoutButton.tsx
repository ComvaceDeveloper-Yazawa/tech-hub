'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useLoading } from '@/contexts/loading/LoadingContext';

export function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { showLoading, hideLoading } = useLoading();

  const handleLogout = () => {
    startTransition(async () => {
      showLoading();
      const supabase = createClient();
      await supabase.auth.signOut();
      hideLoading();
      router.push('/login');
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-1 rounded text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50"
      aria-label="ログアウト"
    >
      <LogOut className="size-4" aria-hidden="true" />
      {isPending ? '...' : 'ログアウト'}
    </button>
  );
}
