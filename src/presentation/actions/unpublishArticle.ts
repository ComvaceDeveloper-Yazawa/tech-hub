'use server';

import { unpublishArticleInputSchema } from '@/schemas/article';
import { UnpublishArticleUseCase } from '@/contexts/publishing/application/UnpublishArticleUseCase';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { PrismaArticleRepository } from '@/contexts/publishing/infrastructure/PrismaArticleRepository';
import { NoopDomainEventPublisher } from '@/lib/event-publisher';
import { prisma } from '@/lib/prisma';

export async function unpublishArticle(input: {
  articleId: string;
}): Promise<void> {
  const validated = unpublishArticleInputSchema.parse(input);

  const articleId = ArticleId.fromString(validated.articleId);
  const tenantId = TenantId.personal();

  const repository = new PrismaArticleRepository(prisma);
  const eventPublisher = new NoopDomainEventPublisher();
  const useCase = new UnpublishArticleUseCase(repository, eventPublisher);

  await useCase.execute({ articleId, tenantId });
}
