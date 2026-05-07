'use server';

import { publishArticleInputSchema } from '@/schemas/article';
import { PublishArticleUseCase } from '@/contexts/publishing/application/PublishArticleUseCase';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { PrismaArticleRepository } from '@/contexts/publishing/infrastructure/PrismaArticleRepository';
import { NoopDomainEventPublisher } from '@/lib/event-publisher';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/presentation/guards/requireAuth';

export async function publishArticle(input: {
  articleId: string;
}): Promise<void> {
  const currentUser = await requireAuth();
  const validated = publishArticleInputSchema.parse(input);

  const articleId = ArticleId.fromString(validated.articleId);
  const tenantId = TenantId.personal();

  const repository = new PrismaArticleRepository(prisma);
  const eventPublisher = new NoopDomainEventPublisher();
  const useCase = new PublishArticleUseCase(repository, eventPublisher);

  await useCase.execute({
    articleId,
    tenantId,
    requesterId: currentUser.id,
  });
}
