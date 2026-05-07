'use server';

import { createArticleInputSchema } from '@/schemas/article';
import { CreateArticleUseCase } from '@/contexts/publishing/application/CreateArticleUseCase';
import { ArticleTitle } from '@/contexts/publishing/domain/article/ArticleTitle';
import { ArticleContent } from '@/contexts/publishing/domain/article/ArticleContent';
import { Slug } from '@/contexts/publishing/domain/article/Slug';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { TagId } from '@/contexts/shared-kernel/TagId';
import { PrismaArticleRepository } from '@/contexts/publishing/infrastructure/PrismaArticleRepository';
import { NoopDomainEventPublisher } from '@/lib/event-publisher';
import { prisma } from '@/lib/prisma';
import { upsertTags } from '@/presentation/actions/upsertTags';
import { requireAuth } from '@/presentation/guards/requireAuth';

export async function createArticle(input: {
  title: string;
  content: string;
  slug: string;
  tagNames?: string[];
}): Promise<{ articleId: string }> {
  const currentUser = await requireAuth();
  const validated = createArticleInputSchema.parse(input);

  const title = ArticleTitle.fromString(validated.title);
  const content = ArticleContent.fromString(validated.content);
  const slug = Slug.fromString(validated.slug);
  const tenantId = TenantId.personal();

  const tagIdStrings = await upsertTags(validated.tagNames ?? []);
  const tagIds = tagIdStrings.map((id) => TagId.fromString(id));

  const repository = new PrismaArticleRepository(prisma);
  const eventPublisher = new NoopDomainEventPublisher();
  const useCase = new CreateArticleUseCase(repository, eventPublisher);

  const articleId = await useCase.execute({
    tenantId,
    title,
    content,
    slug,
    authorId: currentUser.id,
    tagIds,
  });

  return { articleId: articleId.toString() };
}
