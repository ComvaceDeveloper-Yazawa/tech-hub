'use server';

import { toggleLikeInputSchema } from '@/schemas/article';
import { ToggleLikeUseCase } from '@/contexts/publishing/application/ToggleLikeUseCase';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { UserId } from '@/contexts/shared-kernel/UserId';
import { PrismaArticleRepository } from '@/contexts/publishing/infrastructure/PrismaArticleRepository';
import { PrismaArticleLikeRepository } from '@/contexts/publishing/infrastructure/PrismaArticleLikeRepository';
import { NoopDomainEventPublisher } from '@/lib/event-publisher';
import { prisma } from '@/lib/prisma';

export async function toggleLike(input: {
  articleId: string;
}): Promise<{ liked: boolean }> {
  const validated = toggleLikeInputSchema.parse(input);

  const articleId = ArticleId.fromString(validated.articleId);
  const tenantId = TenantId.personal();
  // TODO: Get userId from Supabase Auth session
  const userId = UserId.fromString('00000000000000000000000001');

  const articleRepository = new PrismaArticleRepository(prisma);
  const likeRepository = new PrismaArticleLikeRepository(prisma);
  const eventPublisher = new NoopDomainEventPublisher();
  const useCase = new ToggleLikeUseCase(
    articleRepository,
    likeRepository,
    eventPublisher
  );

  return useCase.execute({ articleId, userId, tenantId });
}
