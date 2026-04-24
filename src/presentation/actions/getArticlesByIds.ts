'use server';

import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { PrismaArticleRepository } from '@/contexts/publishing/infrastructure/PrismaArticleRepository';
import { prisma } from '@/lib/prisma';

export type ArticleData = {
  id: string;
  title: string;
  slug: string;
  status: string;
  viewCount: number;
  likeCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export async function getArticlesByIds(input: {
  articleIds: string[];
}): Promise<ArticleData[]> {
  if (input.articleIds.length === 0) return [];

  const ids = input.articleIds.map((id) => ArticleId.fromString(id));
  const tenantId = TenantId.personal();

  const repository = new PrismaArticleRepository(prisma);
  const articles = await repository.findByIds(ids, tenantId);

  return articles.map((article) => ({
    id: article.id.toString(),
    title: article.title.toString(),
    slug: article.slug.toString(),
    status: article.status.toString(),
    viewCount: article.viewCount.toNumber(),
    likeCount: article.likeCount.toNumber(),
    publishedAt: article.publishedAt?.toISOString() ?? null,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
  }));
}
