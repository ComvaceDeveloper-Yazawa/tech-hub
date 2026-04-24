'use server';

import { recordViewInputSchema } from '@/schemas/article';
import { RecordViewUseCase } from '@/contexts/publishing/application/RecordViewUseCase';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { PrismaArticleRepository } from '@/contexts/publishing/infrastructure/PrismaArticleRepository';
import { prisma } from '@/lib/prisma';

export async function recordView(input: { articleId: string }): Promise<void> {
  const validated = recordViewInputSchema.parse(input);

  const articleId = ArticleId.fromString(validated.articleId);
  const tenantId = TenantId.personal();

  const repository = new PrismaArticleRepository(prisma);
  const useCase = new RecordViewUseCase(repository);

  await useCase.execute({ articleId, tenantId });
}
