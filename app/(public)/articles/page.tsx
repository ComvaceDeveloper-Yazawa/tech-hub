import { Suspense } from 'react';
import { listArticles } from '@/presentation/actions/listArticles';
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
  const sort = params.sort ?? 'publishedAt';
  const dir = params.dir ?? 'desc';

  const result = await listArticles({
    status: 'published',
    cursor: params.cursor,
    limit: 20,
    sortField: sort as
      | 'publishedAt'
      | 'createdAt'
      | 'updatedAt'
      | 'viewCount'
      | 'likeCount',
    sortDirection: dir as 'asc' | 'desc',
    tagId: params.tagId,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="animate-fade-in-up gradient-text mb-6 inline-block text-2xl font-bold">
        記事一覧
      </h1>

      <div className="animate-fade-in stagger-1 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Suspense>
          <TagFilter currentTagId={params.tagId} />
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
