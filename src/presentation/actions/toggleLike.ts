'use server';

import { toggleLikeInputSchema } from '@/schemas/article';
import { ToggleLikeUseCase } from '@/contexts/publishing/application/ToggleLikeUseCase';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { PrismaArticleRepository } from '@/contexts/publishing/infrastructure/PrismaArticleRepository';
import { PrismaArticleLikeRepository } from '@/contexts/publishing/infrastructure/PrismaArticleLikeRepository';
import { NoopDomainEventPublisher } from '@/lib/event-publisher';
import { prisma } from '@/lib/prisma';
import { getAuthUserId } from '@/lib/supabase/auth-helpers';

export async function toggleLike(input: {
  articleId: string;
}): Promise<{ liked: boolean }> {
  const validated = toggleLikeInputSchema.parse(input);

  const userId = await getAuthUserId();
  if (!userId) {
    throw new Error('ログインが必要です');
  }

  const articleId = ArticleId.fromString(validated.articleId);
  const tenantId = TenantId.personal();

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
