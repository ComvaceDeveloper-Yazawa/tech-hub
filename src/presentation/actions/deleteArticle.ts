'use server';

import { deleteArticleInputSchema } from '@/schemas/article';
import { DeleteArticleUseCase } from '@/contexts/publishing/application/DeleteArticleUseCase';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { PrismaArticleRepository } from '@/contexts/publishing/infrastructure/PrismaArticleRepository';
import { NoopDomainEventPublisher } from '@/lib/event-publisher';
import { prisma } from '@/lib/prisma';

export async function deleteArticle(input: {
  articleId: string;
}): Promise<void> {
  const validated = deleteArticleInputSchema.parse(input);

  const articleId = ArticleId.fromString(validated.articleId);
  const tenantId = TenantId.personal();

  const repository = new PrismaArticleRepository(prisma);
  const eventPublisher = new NoopDomainEventPublisher();
  const useCase = new DeleteArticleUseCase(repository, eventPublisher);

  await useCase.execute({ articleId, tenantId });
}
