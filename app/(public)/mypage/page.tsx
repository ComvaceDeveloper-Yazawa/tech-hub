import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookmarkIcon, PencilIcon } from 'lucide-react';

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

      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/admin/articles">
          <Card className="cursor-pointer flex flex-col items-center justify-center gap-4 p-8 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
            <PencilIcon className="size-12 text-primary" />
            <h2 className="text-xl font-semibold">マイ記事</h2>
            <p className="text-center text-sm text-muted-foreground">
              あなたが作成した記事の管理
            </p>
            <Button className="w-full">マイ記事へ</Button>
          </Card>
        </Link>

        <Link href="/bookmarks">
          <Card className="cursor-pointer flex flex-col items-center justify-center gap-4 p-8 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
            <BookmarkIcon className="size-12 text-primary" />
            <h2 className="text-xl font-semibold">ブックマーク</h2>
            <p className="text-center text-sm text-muted-foreground">
              ブックマークした記事の一覧
            </p>
            <Button className="w-full">ブックマークへ</Button>
          </Card>
        </Link>
      </div>
    </div>
  );
}
