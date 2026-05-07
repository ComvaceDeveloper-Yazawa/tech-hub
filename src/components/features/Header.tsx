import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { MobileNav } from '@/components/features/MobileNav';
import { Avatar } from '@/components/features/Avatar';
import { getProfile } from '@/presentation/actions/avatar';
import type { AvatarConfig } from '@/types/avatar';

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;

  let avatarConfig: AvatarConfig | null = null;
  if (user) {
    const profile = await getProfile();
    avatarConfig = profile?.avatarConfig ?? {
      style: 'avataaars',
      seed: user.id,
    };
  }

  return (
    <header className="glass-header border-border sticky top-0 z-50 border-b">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link
          href="/"
          className="focus-visible:ring-ring gradient-text rounded text-lg font-bold focus-visible:outline-none focus-visible:ring-2"
        >
          Tech Hub
        </Link>

        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label="メインナビゲーション"
        >
          <Link
            href="/articles"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2"
          >
            記事一覧
          </Link>
          {isAuthenticated && avatarConfig ? (
            <>
              <Link
                href="/curriculum"
                className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2"
              >
                カリキュラム
              </Link>
              <Link
                href="/mypage"
                title="マイページ"
                aria-label="マイページを開く"
                className="focus-visible:ring-ring rounded-full focus-visible:outline-none focus-visible:ring-2"
              >
                <Avatar
                  config={avatarConfig}
                  size={32}
                  className="ring-border hover:ring-primary size-8 ring-1 transition-all duration-200"
                />
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2"
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
