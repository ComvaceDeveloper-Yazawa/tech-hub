import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { createClient } from '@/lib/supabase/server';
import { listBookmarks } from '@/presentation/actions/listBookmarks';
import { getArticlesByIds } from '@/presentation/actions/getArticlesByIds';
import { ArticleCard } from '@/components/features/ArticleCard';
import { Pagination } from '@/components/features/Pagination';

interface BookmarksPageProps {
  searchParams: Promise<{ cursor?: string }>;
}

export default async function BookmarksPage({
  searchParams,
}: BookmarksPageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const params = await searchParams;
  const result = await listBookmarks({
    cursor: params.cursor,
    limit: 20,
  });

  const articleIds = result.items.map((item) => item.articleId);
  const articles = await getArticlesByIds({ articleIds });

  // articleId → article のマップを作成して順序を保持
  const articleMap = new Map(articles.map((a) => [a.id, a]));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">ブックマーク</h1>

      {result.items.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground mb-4">
            ブックマークした記事はありません
          </p>
          <Link
            href="/articles"
            className="text-primary focus-visible:ring-ring rounded text-sm font-medium underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:outline-none"
          >
            記事一覧を見る
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {result.items.map((bookmark) => {
              const article = articleMap.get(bookmark.articleId);
              if (!article) return null;
              return <ArticleCard key={article.id} article={article} />;
            })}
          </div>

          <div className="mt-8">
            <Suspense>
              <Pagination
                nextCursor={result.nextCursor}
                prevCursor={result.prevCursor}
                hasNextPage={result.hasNextPage}
                hasPrevPage={result.hasPrevPage}
              />
            </Suspense>
          </div>
        </>
      )}
    </div>
  );
}
