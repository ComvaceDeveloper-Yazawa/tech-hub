'use server';

import { getArticleBySlugInputSchema } from '@/schemas/article';
import { Slug } from '@/contexts/publishing/domain/article/Slug';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { PrismaArticleRepository } from '@/contexts/publishing/infrastructure/PrismaArticleRepository';
import { prisma } from '@/lib/prisma';

export interface ArticleTag {
  id: string;
  name: string;
}

export async function getArticleBySlug(input: { slug: string }): Promise<{
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
  tags: ArticleTag[];
} | null> {
  const validated = getArticleBySlugInputSchema.parse(input);

  const slug = Slug.fromString(validated.slug);
  const tenantId = TenantId.personal();

  const repository = new PrismaArticleRepository(prisma);
  const article = await repository.findBySlug(slug, tenantId);

  if (!article) return null;

  const tagIds = article.tagIds.map((t) => t.toString());

  // タグ名を取得
  let tags: ArticleTag[] = [];
  if (tagIds.length > 0) {
    const tagRows = await prisma.tag.findMany({
      where: { id: { in: tagIds } },
      select: { id: true, name: true },
    });
    tags = tagRows;
  }

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
    tagIds,
    tags,
  };
}
