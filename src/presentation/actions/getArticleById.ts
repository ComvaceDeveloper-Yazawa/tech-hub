'use server';

import { getArticleByIdInputSchema } from '@/schemas/article';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { PrismaArticleRepository } from '@/contexts/publishing/infrastructure/PrismaArticleRepository';
import { prisma } from '@/lib/prisma';

export async function getArticleById(input: { articleId: string }): Promise<{
  id: string;
  title: string;
  slug: string;
  content: string;
  status: string;
  viewCount: number;
  likeCount: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  tagIds: string[];
} | null> {
  const validated = getArticleByIdInputSchema.parse(input);

  const articleId = ArticleId.fromString(validated.articleId);
  const tenantId = TenantId.personal();

  const repository = new PrismaArticleRepository(prisma);
  const article = await repository.findById(articleId, tenantId);

  if (!article) return null;

  return {
    id: article.id.toString(),
    title: article.title.toString(),
    slug: article.slug.toString(),
    content: article.content.toString(),
    status: article.status.toString(),
    viewCount: article.viewCount.toNumber(),
    likeCount: article.likeCount.toNumber(),
    publishedAt: article.publishedAt?.toISOString() ?? null,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    tagIds: article.tagIds.map((t) => t.toString()),
  };
}
