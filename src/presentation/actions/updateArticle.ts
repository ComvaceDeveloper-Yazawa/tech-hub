'use server';

import { updateArticleInputSchema } from '@/schemas/article';
import { UpdateArticleUseCase } from '@/contexts/publishing/application/UpdateArticleUseCase';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { ArticleTitle } from '@/contexts/publishing/domain/article/ArticleTitle';
import { ArticleContent } from '@/contexts/publishing/domain/article/ArticleContent';
import { Slug } from '@/contexts/publishing/domain/article/Slug';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { TagId } from '@/contexts/shared-kernel/TagId';
import { PrismaArticleRepository } from '@/contexts/publishing/infrastructure/PrismaArticleRepository';
import { prisma } from '@/lib/prisma';
import { upsertTags } from '@/presentation/actions/upsertTags';
import { requireAuth } from '@/presentation/guards/requireAuth';

export async function updateArticle(input: {
  articleId: string;
  title?: string;
  content?: string;
  slug?: string;
  tagNames?: string[];
}): Promise<void> {
  const currentUser = await requireAuth();
  const validated = updateArticleInputSchema.parse(input);

  const articleId = ArticleId.fromString(validated.articleId);
  const tenantId = TenantId.personal();
  const title = validated.title
    ? ArticleTitle.fromString(validated.title)
    : undefined;
  const content =
    validated.content !== undefined
      ? ArticleContent.fromString(validated.content)
      : undefined;
  const slug = validated.slug ? Slug.fromString(validated.slug) : undefined;

  const tagIdStrings =
    validated.tagNames !== undefined
      ? await upsertTags(validated.tagNames)
      : undefined;
  const tagIds = tagIdStrings?.map((id) => TagId.fromString(id));

  const repository = new PrismaArticleRepository(prisma);
  const useCase = new UpdateArticleUseCase(repository);

  await useCase.execute({
    articleId,
    tenantId,
    requesterId: currentUser.id,
    title,
    content,
    slug,
    tagIds,
  });
}
