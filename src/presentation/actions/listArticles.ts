'use server';

import { listArticlesInputSchema } from '@/schemas/article';
import { ListArticlesUseCase } from '@/contexts/publishing/application/ListArticlesUseCase';
import { ArticleStatus } from '@/contexts/publishing/domain/article/ArticleStatus';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { UserId } from '@/contexts/shared-kernel/UserId';
import { TagId } from '@/contexts/shared-kernel/TagId';
import { PrismaArticleRepository } from '@/contexts/publishing/infrastructure/PrismaArticleRepository';
import { prisma } from '@/lib/prisma';
import type {
  ArticleListFilter,
  ArticleSortOption,
} from '@/contexts/publishing/domain/IArticleRepository';

export async function listArticles(input: {
  cursor?: string;
  limit?: number;
  status?: 'draft' | 'published';
  authorId?: string;
  tagId?: string;
  sortField?:
    | 'publishedAt'
    | 'createdAt'
    | 'updatedAt'
    | 'viewCount'
    | 'likeCount';
  sortDirection?: 'asc' | 'desc';
}): Promise<{
  items: Array<{
    id: string;
    title: string;
    slug: string;
    status: string;
    viewCount: number;
    likeCount: number;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
  }>;
  nextCursor: string | null;
  prevCursor: string | null;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}> {
  const validated = listArticlesInputSchema.parse(input);

  const tenantId = TenantId.personal();

  const filter: ArticleListFilter = {};
  if (validated.status) {
    filter.status =
      validated.status === 'published'
        ? ArticleStatus.published()
        : ArticleStatus.draft();
  }
  if (validated.authorId) {
    filter.authorId = UserId.fromString(validated.authorId);
  }
  if (validated.tagId) {
    filter.tagId = TagId.fromString(validated.tagId);
  }

  const sort: ArticleSortOption | undefined = validated.sortField
    ? {
        field: validated.sortField,
        direction: validated.sortDirection ?? 'desc',
      }
    : undefined;

  const repository = new PrismaArticleRepository(prisma);
  const useCase = new ListArticlesUseCase(repository);

  const result = await useCase.execute({
    tenantId,
    pagination: { cursor: validated.cursor, limit: validated.limit },
    filter: Object.keys(filter).length > 0 ? filter : undefined,
    sort,
  });

  return {
    items: result.items.map((article) => ({
      id: article.id.toString(),
      title: article.title.toString(),
      slug: article.slug.toString(),
      status: article.status.toString(),
      viewCount: article.viewCount.toNumber(),
      likeCount: article.likeCount.toNumber(),
      publishedAt: article.publishedAt?.toISOString() ?? null,
      createdAt: article.createdAt.toISOString(),
      updatedAt: article.updatedAt.toISOString(),
    })),
    nextCursor: result.nextCursor,
    prevCursor: result.prevCursor,
    hasNextPage: result.hasNextPage,
    hasPrevPage: result.hasPrevPage,
  };
}
