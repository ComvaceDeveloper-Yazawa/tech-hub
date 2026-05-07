import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookmarkIcon, PencilIcon, AwardIcon } from 'lucide-react';
import { getProfile } from '@/presentation/actions/avatar';
import { AvatarCreator } from '@/components/features/AvatarCreator';
import { LogoutButton } from '@/components/features/LogoutButton';
import type { AvatarConfig } from '@/types/avatar';

export default async function MyPagePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const profile = await getProfile();
  const defaultConfig: AvatarConfig = {
    style: 'avataaars',
    seed: user.id,
  };
  const avatarConfig = profile?.avatarConfig ?? defaultConfig;
  const displayName = profile?.displayName ?? '';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">マイページ</h1>

      {/* プロフィールセクション */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-semibold">プロフィール</h2>
        <AvatarCreator
          initialConfig={avatarConfig}
          initialDisplayName={displayName}
        />
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        <Link href="/admin/articles">
          <Card className="flex cursor-pointer flex-col items-center justify-center gap-4 p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            <PencilIcon className="text-primary size-12" />
            <h2 className="text-xl font-semibold">マイ記事</h2>
            <p className="text-muted-foreground text-center text-sm">
              あなたが作成した記事の管理
            </p>
            <Button className="w-full">マイ記事へ</Button>
          </Card>
        </Link>

        <Link href="/bookmarks">
          <Card className="flex cursor-pointer flex-col items-center justify-center gap-4 p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            <BookmarkIcon className="text-primary size-12" />
            <h2 className="text-xl font-semibold">ブックマーク</h2>
            <p className="text-muted-foreground text-center text-sm">
              ブックマークした記事の一覧
            </p>
            <Button className="w-full">ブックマークへ</Button>
          </Card>
        </Link>

        <Link href="/skill-sheets">
          <Card className="flex cursor-pointer flex-col items-center justify-center gap-4 p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
            <AwardIcon className="text-primary size-12" />
            <h2 className="text-xl font-semibold">スキルシート</h2>
            <p className="text-muted-foreground text-center text-sm">
              スキルシートの作成・管理
            </p>
            <Button className="w-full">スキルシートへ</Button>
          </Card>
        </Link>
      </div>

      {/* アカウントセクション */}
      <section className="border-border mt-12 border-t pt-8">
        <h2 className="mb-4 text-xl font-semibold">アカウント</h2>
        <Card className="flex flex-col items-start gap-3 p-6">
          <p className="text-muted-foreground text-sm">
            ログアウトすると、次回アクセス時に再度ログインが必要になります。
          </p>
          <LogoutButton />
        </Card>
      </section>
    </div>
  );
}
