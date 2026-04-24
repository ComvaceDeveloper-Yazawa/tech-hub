'use server';

import { toggleBookmarkInputSchema } from '@/schemas/article';
import { ToggleBookmarkUseCase } from '@/contexts/publishing/application/ToggleBookmarkUseCase';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { PrismaArticleRepository } from '@/contexts/publishing/infrastructure/PrismaArticleRepository';
import { PrismaArticleBookmarkRepository } from '@/contexts/publishing/infrastructure/PrismaArticleBookmarkRepository';
import { NoopDomainEventPublisher } from '@/lib/event-publisher';
import { prisma } from '@/lib/prisma';
import { getAuthUserId } from '@/lib/supabase/auth-helpers';

export async function toggleBookmark(input: {
  articleId: string;
}): Promise<{ bookmarked: boolean }> {
  const validated = toggleBookmarkInputSchema.parse(input);

  const userId = await getAuthUserId();
  if (!userId) {
    throw new Error('ログインが必要です');
  }

  const articleId = ArticleId.fromString(validated.articleId);
  const tenantId = TenantId.personal();

  const articleRepository = new PrismaArticleRepository(prisma);
  const bookmarkRepository = new PrismaArticleBookmarkRepository(prisma);
  const eventPublisher = new NoopDomainEventPublisher();
  const useCase = new ToggleBookmarkUseCase(
    articleRepository,
    bookmarkRepository,
    eventPublisher
  );

  return useCase.execute({ articleId, userId, tenantId });
}
