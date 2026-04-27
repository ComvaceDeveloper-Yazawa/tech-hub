import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { MobileNav } from '@/components/features/MobileNav';
import { LogoutButton } from '@/components/features/LogoutButton';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;

  return (
    <header className="glass-header border-border sticky top-0 z-50 border-b">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link
          href="/"
          className="focus-visible:ring-ring gradient-text rounded text-lg font-bold focus-visible:ring-2 focus-visible:outline-none"
        >
          Tech Hub
        </Link>

        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="メインナビゲーション"
        >
          <Link
            href="/articles"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
          >
            記事一覧
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                href="/curriculum"
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
              >
                カリキュラム
              </Link>
              <Link href="/mypage" title="マイページ">
                <Button
                  variant="ghost"
                  size="icon"
                  className="focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none"
                  aria-label="マイページを開く"
                >
                  <User className="size-5" />
                </Button>
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
            >
              ログイン
            </Link>
          )}
        </nav>

        <MobileNav isAuthenticated={isAuthenticated} />
      </div>
    </header>
  );
}
