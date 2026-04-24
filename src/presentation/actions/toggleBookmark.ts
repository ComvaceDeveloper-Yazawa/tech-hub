'use server';

import { toggleBookmarkInputSchema } from '@/schemas/article';
import { ToggleBookmarkUseCase } from '@/contexts/publishing/application/ToggleBookmarkUseCase';
import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { UserId } from '@/contexts/shared-kernel/UserId';
import { PrismaArticleRepository } from '@/contexts/publishing/infrastructure/PrismaArticleRepository';
import { PrismaArticleBookmarkRepository } from '@/contexts/publishing/infrastructure/PrismaArticleBookmarkRepository';
import { NoopDomainEventPublisher } from '@/lib/event-publisher';
import { prisma } from '@/lib/prisma';

export async function toggleBookmark(input: {
  articleId: string;
}): Promise<{ bookmarked: boolean }> {
  const validated = toggleBookmarkInputSchema.parse(input);

  const articleId = ArticleId.fromString(validated.articleId);
  const tenantId = TenantId.personal();
  // TODO: Get userId from Supabase Auth session
  const userId = UserId.fromString('00000000000000000000000001');

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
