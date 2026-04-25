import { Suspense } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { listArticles } from '@/presentation/actions/listArticles';
import { listTags } from '@/presentation/actions/listTags';
import { ArticleCard } from '@/components/features/ArticleCard';
import { Pagination } from '@/components/features/Pagination';
import { SortSelector } from '@/components/features/SortSelector';
import { TagFilter } from '@/components/features/TagFilter';

interface ArticleListPageProps {
  searchParams: Promise<{
    cursor?: string;
    sort?: string;
    dir?: string;
    tagId?: string;
  }>;
}

export default async function ArticleListPage({
  searchParams,
}: ArticleListPageProps) {
  const params = await searchParams;
  const sort = params.sort;
  const dir = params.dir;

  const [
    result,
    tags,
    {
      data: { user },
    },
  ] = await Promise.all([
    listArticles({
      status: 'published',
      cursor: params.cursor,
      limit: 20,
      sortField: (sort ?? 'publishedAt') as
        | 'publishedAt'
        | 'createdAt'
        | 'updatedAt'
        | 'viewCount'
        | 'likeCount',
      sortDirection: (dir ?? 'desc') as 'asc' | 'desc',
      tagId: params.tagId,
    }),
    listTags(),
    createClient().then((s) => s.auth.getUser()),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="animate-fade-in-up mb-6 flex items-center justify-between">
        <h1 className="gradient-text inline-block text-2xl font-bold">
          記事一覧
        </h1>
        {user && (
          <Link
            href="/admin/articles"
            className="rounded-md bg-[#528bff] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4a7fee] focus:ring-2 focus:ring-[#528bff]/50 focus:outline-none"
          >
            記事を作成・管理する
          </Link>
        )}
      </div>

      <div className="animate-fade-in stagger-1 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Suspense>
          <TagFilter currentTagId={params.tagId} tags={tags} />
        </Suspense>
        <Suspense>
          <SortSelector currentSort={sort} currentDirection={dir} />
        </Suspense>
      </div>

      {result.items.length === 0 ? (
        <p className="text-muted-foreground animate-fade-in py-12 text-center">
          記事がありません
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {result.items.map((article, i) => (
            <div
              key={article.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${0.1 + i * 0.05}s` }}
            >
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      )}

      <div className="animate-fade-in stagger-3 mt-8">
        <Suspense>
          <Pagination
            nextCursor={result.nextCursor}
            prevCursor={result.prevCursor}
            hasNextPage={result.hasNextPage}
            hasPrevPage={result.hasPrevPage}
          />
        </Suspense>
      </div>
    </div>
  );
}
