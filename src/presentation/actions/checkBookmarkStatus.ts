'use server';

import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { PrismaArticleBookmarkRepository } from '@/contexts/publishing/infrastructure/PrismaArticleBookmarkRepository';
import { prisma } from '@/lib/prisma';
import { getAuthUserId } from '@/lib/supabase/auth-helpers';

export async function checkBookmarkStatus(input: {
  articleId: string;
}): Promise<{ bookmarked: boolean }> {
  const userId = await getAuthUserId();
  if (!userId) return { bookmarked: false };

  const articleId = ArticleId.fromString(input.articleId);
  const tenantId = TenantId.personal();

  const bookmarkRepository = new PrismaArticleBookmarkRepository(prisma);
  const bookmark = await bookmarkRepository.findByArticleAndUser(
    articleId,
    userId,
    tenantId
  );

  return { bookmarked: bookmark !== null };
}
