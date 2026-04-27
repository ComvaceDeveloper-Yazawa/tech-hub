import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookmarkIcon, PencilIcon, AwardIcon } from 'lucide-react';

export default async function MyPagePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">マイページ</h1>

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
    </div>
  );
}
