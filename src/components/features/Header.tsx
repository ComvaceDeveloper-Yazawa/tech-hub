import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { MobileNav } from '@/components/features/MobileNav';

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;

  return (
    <header className="bg-background border-border border-b">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link
          href="/"
          className="focus-visible:ring-ring text-foreground rounded text-lg font-bold focus-visible:ring-2 focus-visible:outline-none"
        >
          Tech Hub
        </Link>

        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="メインナビゲーション"
        >
          <Link
            href="/articles"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            記事一覧
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                href="/bookmarks"
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                ブックマーク
              </Link>
              <Link
                href="/admin/articles"
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
              >
                管理
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none"
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
