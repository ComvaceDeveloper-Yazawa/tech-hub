'use server';

import { ArticleId } from '@/contexts/publishing/domain/article/ArticleId';
import { TenantId } from '@/contexts/shared-kernel/TenantId';
import { PrismaArticleLikeRepository } from '@/contexts/publishing/infrastructure/PrismaArticleLikeRepository';
import { prisma } from '@/lib/prisma';
import { getAuthUserId } from '@/lib/supabase/auth-helpers';

export async function checkLikeStatus(input: {
  articleId: string;
}): Promise<{ liked: boolean }> {
  const userId = await getAuthUserId();
  if (!userId) return { liked: false };

  const articleId = ArticleId.fromString(input.articleId);
  const tenantId = TenantId.personal();

  const likeRepository = new PrismaArticleLikeRepository(prisma);
  const like = await likeRepository.findByArticleAndUser(
    articleId,
    userId,
    tenantId
  );

  return { liked: like !== null };
}
