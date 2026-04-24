'use server';

import { createArticleInputSchema } from '@/schemas/article';
import { CreateArticleUseCase } from '@/contexts/publishing/application/CreateArticleUseCase';
import { ArticleTitle } from '@/contexts/publishing/domain/article/ArticleTitle';
import { ArticleContent } from '@/contexts/publishing/domain/article/ArticleContent';
import { Slug } from '@/contexts/publishing/domain/article/Slug';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { UserId } from '@/contexts/shared-kernel/UserId';
import { TagId } from '@/contexts/shared-kernel/TagId';
import { PrismaArticleRepository } from '@/contexts/publishing/infrastructure/PrismaArticleRepository';
import { NoopDomainEventPublisher } from '@/lib/event-publisher';
import { prisma } from '@/lib/prisma';

export async function createArticle(input: {
  title: string;
  content: string;
  slug: string;
  tagIds?: string[];
}): Promise<{ articleId: string }> {
  const validated = createArticleInputSchema.parse(input);

  const title = ArticleTitle.fromString(validated.title);
  const content = ArticleContent.fromString(validated.content);
  const slug = Slug.fromString(validated.slug);
  const tenantId = TenantId.personal();
  // TODO: Get authorId from Supabase Auth session
  const authorId = UserId.fromString('00000000000000000000000001');
  const tagIds = validated.tagIds?.map((id) => TagId.fromString(id));

  const repository = new PrismaArticleRepository(prisma);
  const eventPublisher = new NoopDomainEventPublisher();
  const useCase = new CreateArticleUseCase(repository, eventPublisher);

  const articleId = await useCase.execute({
    tenantId,
    title,
    content,
    slug,
    authorId,
    tagIds,
  });

  return { articleId: articleId.toString() };
}
